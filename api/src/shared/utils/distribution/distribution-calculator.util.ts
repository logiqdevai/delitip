import { DistributionRecipientType } from 'generated/prisma';

export interface RuleRecipientInput {
    recipient_type: DistributionRecipientType;
    employee_id: string | null;
    percentage: number;
    sort_order: number;
}

export interface DistributionLine {
    recipient_type: DistributionRecipientType;
    employee_id: string | null;
    percentage: number;
    amount: number;
}

interface WorkingLine {
    recipient_type: DistributionRecipientType;
    employee_id: string | null;
    percentage: number;
    sort_order: number;
}

// Splits a tip's amount across a Distribution Rule's recipients (§5).
// - No rule at all (empty recipients) with one or more employees selected:
//   the whole tip is split evenly across the selected employees, none of it
//   goes to the Store — a customer who picked an employee to tip must reach
//   them even when the store hasn't configured a distribution rule.
// - Zero employees selected: the whole employee share folds into the Store.
// - One or more employees selected: any rule recipient matching a selected
//   employee keeps its named percentage; the percentage of rule recipients
//   whose employee wasn't selected this time is pooled and handed to the
//   selected employees that *are* unnamed in the rule (if any), otherwise
//   renormalized across the matched/selected employees — this is what makes
//   "70/30 Maria/Nikos, only Nikos picked -> Nikos gets 100%" work (§5).
// Store recipients are never touched by that redistribution.
export function calculateTipDistribution(
    recipients: RuleRecipientInput[],
    selectedEmployeeIds: string[],
    tipAmount: number,
): DistributionLine[] {
    if (!recipients || recipients.length === 0) {
        if (selectedEmployeeIds.length > 0) {
            const uniqueIds = Array.from(new Set(selectedEmployeeIds));
            const share = 100 / uniqueIds.length;
            const lines: WorkingLine[] = uniqueIds.map((employeeId, index) => ({
                recipient_type: 'EMPLOYEE',
                employee_id: employeeId,
                percentage: share,
                sort_order: index,
            }));
            return finalizeAmounts(lines, tipAmount);
        }

        return finalizeAmounts([{ recipient_type: 'STORE', employee_id: null, percentage: 100, sort_order: 0 }], tipAmount);
    }

    const storeRecipients: WorkingLine[] = recipients
        .filter((r) => r.recipient_type === 'STORE')
        .map((r) => ({ ...r }));
    const employeeRecipients: WorkingLine[] = recipients
        .filter((r) => r.recipient_type === 'EMPLOYEE')
        .map((r) => ({ ...r }));

    if (selectedEmployeeIds.length === 0) {
        const leftover = employeeRecipients.reduce((sum, r) => sum + r.percentage, 0);

        if (leftover === 0) {
            return finalizeAmounts(storeRecipients, tipAmount);
        }

        if (storeRecipients.length === 0) {
            return finalizeAmounts([{ recipient_type: 'STORE', employee_id: null, percentage: leftover, sort_order: 0 }], tipAmount);
        }

        const lowestStore = storeRecipients.reduce((a, b) => (a.sort_order <= b.sort_order ? a : b));
        lowestStore.percentage += leftover;

        return finalizeAmounts(storeRecipients, tipAmount);
    }

    const selectedSet = new Set(selectedEmployeeIds);
    const matched = employeeRecipients.filter((r) => r.employee_id && selectedSet.has(r.employee_id));
    const matchedIds = new Set(matched.map((r) => r.employee_id));
    const unmatchedPool = employeeRecipients
        .filter((r) => !r.employee_id || !matchedIds.has(r.employee_id))
        .reduce((sum, r) => sum + r.percentage, 0);
    const selectedButUnnamed = selectedEmployeeIds.filter((id) => !matchedIds.has(id));

    const maxSortOrder = recipients.reduce((max, r) => Math.max(max, r.sort_order), 0);
    let finalLines: WorkingLine[] = [...storeRecipients, ...matched];

    if (selectedButUnnamed.length > 0) {
        const share = unmatchedPool / selectedButUnnamed.length;
        selectedButUnnamed.forEach((employeeId, index) => {
            finalLines.push({
                recipient_type: 'EMPLOYEE',
                employee_id: employeeId,
                percentage: share,
                sort_order: maxSortOrder + 1 + index,
            });
        });
    } else if (unmatchedPool > 0 && matched.length > 0) {
        const matchedTotal = matched.reduce((sum, r) => sum + r.percentage, 0);
        if (matchedTotal > 0) {
            matched.forEach((r) => {
                r.percentage += unmatchedPool * (r.percentage / matchedTotal);
            });
        } else {
            const share = unmatchedPool / matched.length;
            matched.forEach((r) => {
                r.percentage += share;
            });
        }
    } else if (unmatchedPool > 0) {
        // Employees are selected but none of them are named in the rule and
        // there's no unnamed-selected bucket to fall back to (shouldn't
        // normally happen) — keep the money with the Store rather than lose it.
        if (storeRecipients.length === 0) {
            finalLines.push({ recipient_type: 'STORE', employee_id: null, percentage: unmatchedPool, sort_order: 0 });
        } else {
            const lowestStore = storeRecipients.reduce((a, b) => (a.sort_order <= b.sort_order ? a : b));
            lowestStore.percentage += unmatchedPool;
        }
    }

    return finalizeAmounts(finalLines, tipAmount);
}

function finalizeAmounts(lines: WorkingLine[], tipAmount: number): DistributionLine[] {
    const nonZero = lines.filter((l) => l.percentage > 0).sort((a, b) => a.sort_order - b.sort_order);

    if (nonZero.length === 0) {
        return [{ recipient_type: 'STORE', employee_id: null, percentage: 100, amount: tipAmount }];
    }

    const amounts = nonZero.map((l) => Math.floor((tipAmount * l.percentage) / 100));
    const distributed = amounts.reduce((sum, a) => sum + a, 0);
    const remainder = tipAmount - distributed;
    amounts[0] += remainder;

    return nonZero.map((l, index) => ({
        recipient_type: l.recipient_type,
        employee_id: l.employee_id,
        percentage: Math.round(l.percentage * 100) / 100,
        amount: amounts[index],
    }));
}

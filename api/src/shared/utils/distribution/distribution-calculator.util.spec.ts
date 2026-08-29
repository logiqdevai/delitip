import { DistributionRecipientType } from 'generated/prisma';
import { calculateTipDistribution, RuleRecipientInput } from './distribution-calculator.util';

const store = (percentage: number, sort_order = 0): RuleRecipientInput => ({
    recipient_type: DistributionRecipientType.STORE,
    employee_id: null,
    percentage,
    sort_order,
});

const employee = (employee_id: string, percentage: number, sort_order: number): RuleRecipientInput => ({
    recipient_type: DistributionRecipientType.EMPLOYEE,
    employee_id,
    percentage,
    sort_order,
});

const sumAmounts = (lines: { amount: number }[]) => lines.reduce((sum, l) => sum + l.amount, 0);

describe('calculateTipDistribution', () => {
    describe('no distribution rule', () => {
        it('sends 100% to a synthetic Store line when recipients is empty', () => {
            const result = calculateTipDistribution([], [], 1000);

            expect(result).toEqual([
                { recipient_type: DistributionRecipientType.STORE, employee_id: null, percentage: 100, amount: 1000 },
            ]);
        });

        it('sends 100% to a synthetic Store line when recipients is null/undefined', () => {
            expect(calculateTipDistribution(null as any, [], 1000)).toEqual([
                { recipient_type: DistributionRecipientType.STORE, employee_id: null, percentage: 100, amount: 1000 },
            ]);
            expect(calculateTipDistribution(undefined as any, [], 1000)).toEqual([
                { recipient_type: DistributionRecipientType.STORE, employee_id: null, percentage: 100, amount: 1000 },
            ]);
        });
    });

    describe('store-only recipients', () => {
        it('splits across multiple store recipients and dumps the rounding remainder on the lowest sort_order line', () => {
            // 3-way split of 100 at equal thirds does not divide evenly.
            const recipients = [store(33.34, 1), store(33.33, 0), store(33.33, 2)];

            const result = calculateTipDistribution(recipients, [], 100);

            expect(sumAmounts(result)).toBe(100);
            // output is sorted by sort_order ascending; sort_order 0 is first and absorbs the rounding remainder
            expect(result[0].amount).toBe(34); // floor(33.33) = 33, +1 remainder
            expect(result[1].amount).toBe(33);
            expect(result[2].amount).toBe(33);
        });

        it('excludes zero-percentage lines from the output', () => {
            const recipients = [store(100, 0), store(0, 1)];

            const result = calculateTipDistribution(recipients, [], 500);

            expect(result).toHaveLength(1);
            expect(result[0]).toEqual({ recipient_type: DistributionRecipientType.STORE, employee_id: null, percentage: 100, amount: 500 });
        });

        it('falls back to a single synthetic Store line worth 100% when every recipient has a zero percentage', () => {
            const recipients = [store(0, 0)];

            const result = calculateTipDistribution(recipients, [], 750);

            expect(result).toEqual([
                { recipient_type: DistributionRecipientType.STORE, employee_id: null, percentage: 100, amount: 750 },
            ]);
        });

        it('rounds displayed percentages to 2 decimal places', () => {
            const recipients = [store(100 / 3, 0), store(100 / 3, 1), store(100 / 3, 2)];

            const result = calculateTipDistribution(recipients, [], 300);

            result.forEach((line) => {
                expect(line.percentage).toBe(Math.round((100 / 3) * 100) / 100);
            });
        });
    });

    describe('employee recipients, no employees selected', () => {
        it('leaves store-only recipients untouched (no employee recipients at all)', () => {
            const recipients = [store(100, 0)];

            const result = calculateTipDistribution(recipients, [], 1000);

            expect(result).toEqual([{ recipient_type: DistributionRecipientType.STORE, employee_id: null, percentage: 100, amount: 1000 }]);
        });

        it('folds the unclaimed employee share into the lowest sort_order Store line', () => {
            const recipients = [store(50, 5), store(20, 1), employee('e1', 30, 0)];

            const result = calculateTipDistribution(recipients, [], 1000);

            // lowest sort_order store line (sort_order 1, 20%) should absorb employee e1's 30% -> 50%
            const augmented = result.find((l) => l.percentage === 50 && l.recipient_type === DistributionRecipientType.STORE);
            expect(augmented).toBeDefined();
            expect(sumAmounts(result)).toBe(1000);
            expect(result.some((l) => l.recipient_type === DistributionRecipientType.EMPLOYEE)).toBe(false);
        });

        it('creates a synthetic Store line for the leftover when there are no Store recipients at all', () => {
            const recipients = [employee('e1', 40, 0), employee('e2', 60, 1)];

            const result = calculateTipDistribution(recipients, [], 1000);

            expect(result).toEqual([{ recipient_type: DistributionRecipientType.STORE, employee_id: null, percentage: 100, amount: 1000 }]);
        });
    });

    describe('employees selected and named in the rule', () => {
        it('leaves the split untouched when every selected employee is named with no leftover', () => {
            // 70/30 Maria/Nikos, both selected -> unchanged.
            const recipients = [employee('maria', 70, 0), employee('nikos', 30, 1)];

            const result = calculateTipDistribution(recipients, ['maria', 'nikos'], 1000);

            const byId = Object.fromEntries(result.map((l) => [l.employee_id, l]));
            expect(byId['maria'].amount).toBe(700);
            expect(byId['nikos'].amount).toBe(300);
            expect(sumAmounts(result)).toBe(1000);
        });

        it('gives the picked employee the unpicked named employee\'s share (documented §5 example)', () => {
            // 70/30 Maria/Nikos, only Nikos picked -> Nikos gets 100%.
            const recipients = [employee('maria', 70, 0), employee('nikos', 30, 1)];

            const result = calculateTipDistribution(recipients, ['nikos'], 1000);

            expect(result).toHaveLength(1);
            expect(result[0]).toMatchObject({ recipient_type: DistributionRecipientType.EMPLOYEE, employee_id: 'nikos', amount: 1000 });
        });

        it('proportionally redistributes an unmatched named share across multiple matched employees', () => {
            // Maria 20 (unselected/unmatched), Nikos 30 + Elena 50 (both selected/matched).
            const recipients = [employee('maria', 20, 0), employee('nikos', 30, 1), employee('elena', 50, 2)];

            const result = calculateTipDistribution(recipients, ['nikos', 'elena'], 1000);

            const byId = Object.fromEntries(result.map((l) => [l.employee_id, l]));
            expect(byId['maria']).toBeUndefined();
            // 20 split proportionally 30:50 -> Nikos +7.5 = 37.5%, Elena +12.5 = 62.5%
            expect(byId['nikos'].percentage).toBeCloseTo(37.5);
            expect(byId['elena'].percentage).toBeCloseTo(62.5);
            expect(sumAmounts(result)).toBe(1000);
        });

        it('splits the unmatched pool evenly across matched employees when their combined named percentage is zero', () => {
            // 'a' and 'b' are selected+matched but both named at 0%; 'c' is unselected/unmatched at 100%.
            const recipients = [employee('a', 0, 0), employee('b', 0, 1), employee('c', 100, 2)];

            const result = calculateTipDistribution(recipients, ['a', 'b'], 1000);

            const byId = Object.fromEntries(result.map((l) => [l.employee_id, l]));
            expect(byId['c']).toBeUndefined();
            expect(byId['a']).toMatchObject({ recipient_type: DistributionRecipientType.EMPLOYEE, percentage: 50, amount: 500 });
            expect(byId['b']).toMatchObject({ recipient_type: DistributionRecipientType.EMPLOYEE, percentage: 50, amount: 500 });
            expect(sumAmounts(result)).toBe(1000);
        });
    });

    describe('employees selected but not named in the rule', () => {
        it('splits the entire unmatched pool evenly across the unnamed selected employees', () => {
            const recipients = [employee('maria', 100, 0)];

            const result = calculateTipDistribution(recipients, ['nikos', 'elena'], 1000);

            const byId = Object.fromEntries(result.map((l) => [l.employee_id, l]));
            expect(byId['maria']).toBeUndefined();
            expect(byId['nikos'].amount + byId['elena'].amount).toBe(1000);
            expect(byId['nikos'].percentage).toBeCloseTo(50);
            expect(byId['elena'].percentage).toBeCloseTo(50);
        });

        it('keeps Store recipients untouched when redistributing to unnamed selected employees', () => {
            const recipients = [store(20, 0), employee('maria', 80, 1)];

            const result = calculateTipDistribution(recipients, ['nikos'], 1000);

            const storeLine = result.find((l) => l.recipient_type === DistributionRecipientType.STORE);
            expect(storeLine).toMatchObject({ percentage: 20, amount: 200 });
            const nikosLine = result.find((l) => l.employee_id === 'nikos');
            expect(nikosLine).toMatchObject({ percentage: 80, amount: 800 });
        });
    });

    it('always distributes the exact tip amount with no leftover cents, across an uneven 3-way employee split', () => {
        const recipients = [employee('a', 100, 0)];

        const result = calculateTipDistribution(recipients, ['x', 'y', 'z'], 100);

        expect(sumAmounts(result)).toBe(100);
    });
});

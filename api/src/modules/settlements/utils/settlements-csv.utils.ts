import { escapeCsvCell, formatTipAmountMajor } from '@/modules/tips/utils/tips-csv.utils';

export type SettlementCsvRow = {
  tip_id: string;
  earned_at: Date | string;
  employee_name: string;
  tip_amount: number;
  share_percentage: number;
  net_earned: number;
  currency: string;
  received_by_store: boolean;
  settled_at: Date | string | null;
  settlement_reference: string | null;
  confirmed_by_employee: boolean;
};

// One line per share rather than per handover: an accountant reconciling what
// the business owes needs to trace each cent back to the tip it came from.
const CSV_HEADERS = [
  'Tip ID',
  'Earned At',
  'Employee',
  'Tip Amount',
  'Share %',
  'Net Earned',
  'Currency',
  'Received By Business',
  'Handed Over At',
  'Reference',
  'Confirmed By Employee',
  'Still Owed',
] as const;

function toIsoTimestamp(value: Date | string | null | undefined): string {
  if (!value) return '';
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toISOString();
}

export function buildSettlementsCsv(rows: SettlementCsvRow[]): string {
  const lines = [
    CSV_HEADERS.join(','),
    ...rows.map((row) =>
      [
        row.tip_id,
        toIsoTimestamp(row.earned_at),
        row.employee_name,
        formatTipAmountMajor(row.tip_amount),
        row.share_percentage.toFixed(2),
        formatTipAmountMajor(row.net_earned),
        row.currency,
        row.received_by_store ? 'Yes' : 'No',
        toIsoTimestamp(row.settled_at),
        row.settlement_reference ?? '',
        row.settled_at ? (row.confirmed_by_employee ? 'Yes' : 'No') : '',
        row.settled_at ? '' : formatTipAmountMajor(row.net_earned),
      ]
        .map((cell) => escapeCsvCell(String(cell)))
        .join(','),
    ),
  ];

  return lines.join('\n');
}

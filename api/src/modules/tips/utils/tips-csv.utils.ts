export type TipCsvRow = {
    id: string;
    paid_at: Date | string | null;
    created_at: Date | string;
    employee?: { full_name: string } | null;
    qr_code?: { label: string } | null;
    payment_transaction?: { payment_method?: string | null } | null;
    amount: number;
    currency: string;
    status: string;
};

const CSV_HEADERS = [
    'Transaction ID',
    'Timestamp',
    'Employee',
    'QR Code',
    'Payment Method',
    'Amount',
    'Currency',
    'Status',
] as const;

export function escapeCsvCell(value: string): string {
    if (/[",\n\r]/.test(value)) {
        return `"${value.replace(/"/g, '""')}"`;
    }
    return value;
}

export function formatTipAmountMajor(amountMinor: number): string {
    return (amountMinor / 100).toFixed(2);
}

function toIsoTimestamp(value: Date | string | null | undefined): string {
    if (!value) return '';
    const date = value instanceof Date ? value : new Date(value);
    if (Number.isNaN(date.getTime())) return '';
    return date.toISOString();
}

export function buildTipsCsv(tips: TipCsvRow[]): string {
    const lines = [
        CSV_HEADERS.join(','),
        ...tips.map((tip) =>
            [
                tip.id,
                toIsoTimestamp(tip.paid_at ?? tip.created_at),
                tip.employee?.full_name ?? 'Store',
                tip.qr_code?.label ?? '',
                tip.payment_transaction?.payment_method ?? '',
                formatTipAmountMajor(tip.amount),
                tip.currency,
                tip.status,
            ]
                .map((cell) => escapeCsvCell(String(cell)))
                .join(','),
        ),
    ];

    return `\uFEFF${lines.join('\r\n')}`;
}

export function tipsExportFilename(date = new Date()): string {
    return `tips-${date.toISOString().slice(0, 10)}.csv`;
}

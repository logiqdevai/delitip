import { jsPDF } from "jspdf";
import type {
  EmployeeBalance,
  Settlement,
} from "@/features/settlements/interfaces/settlements.interfaces";
import type { Currency } from "@/features/stores/interfaces/stores.interfaces";
import { formatMoney } from "@/lib/money";

const MARGIN = 56;
const LINE = 16;

const formatDate = (value?: string | null) =>
  value ? new Date(value).toLocaleDateString(undefined, { dateStyle: "medium" }) : "—";

interface StatementInput {
  businessName: string;
  balance: EmployeeBalance;
  settlements: Settlement[];
  currency: Currency;
}

/**
 * A one-page statement of what a business owes an employee and what it has
 * already handed over — the paper an accountant files, or the employee signs
 * on handover. Drawn directly rather than rasterized from the DOM, so it stays
 * legible and searchable.
 */
export function downloadSettlementStatementPdf({
  businessName,
  balance,
  settlements,
  currency,
}: StatementInput): void {
  const pdf = new jsPDF({ orientation: "portrait", unit: "pt", format: "a4" });
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const right = pageWidth - MARGIN;
  let y = MARGIN;

  const money = (amount: number) => formatMoney(amount, currency);

  const heading = (text: string, size: number) => {
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(size);
    pdf.text(text, MARGIN, y);
    y += size + 6;
  };

  const row = (label: string, value: string, bold = false) => {
    pdf.setFont("helvetica", bold ? "bold" : "normal");
    pdf.setFontSize(10);
    pdf.text(label, MARGIN, y);
    pdf.text(value, right, y, { align: "right" });
    y += LINE;
  };

  const rule = () => {
    pdf.setDrawColor(210);
    pdf.line(MARGIN, y, right, y);
    y += LINE;
  };

  heading("Tip statement", 18);
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(10);
  pdf.setTextColor(110);
  pdf.text(`${businessName} · generated ${formatDate(new Date().toISOString())}`, MARGIN, y);
  pdf.setTextColor(0);
  y += LINE * 2;

  heading(balance.name, 13);
  rule();

  row("Earned in tips", money(balance.earned_amount));
  row("Already handed over", money(balance.settled_amount));
  if (balance.pending_adjustments_amount !== 0) {
    row("Deductions pending", money(balance.pending_adjustments_amount));
  }
  rule();
  row("Still owed", money(balance.outstanding_amount), true);
  y += LINE;

  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(8);
  pdf.setTextColor(110);
  pdf.text(
    `Of what is owed, ${money(balance.received_by_store_amount)} has reached the business account so far.`,
    MARGIN,
    y,
  );
  pdf.setTextColor(0);
  y += LINE * 2;

  const recorded = settlements.filter((settlement) => !settlement.reversed_at);
  if (recorded.length > 0) {
    heading("Payments recorded", 12);
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(9);
    pdf.text("Date", MARGIN, y);
    pdf.text("Reference", MARGIN + 110, y);
    pdf.text("Confirmed", MARGIN + 300, y);
    pdf.text("Amount", right, y, { align: "right" });
    y += LINE;
    rule();

    for (const settlement of recorded) {
      if (y > pageHeight - MARGIN * 2) {
        pdf.addPage();
        y = MARGIN;
      }
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(9);
      pdf.text(formatDate(settlement.settled_at), MARGIN, y);
      pdf.text((settlement.reference ?? "—").slice(0, 32), MARGIN + 110, y);
      pdf.text(settlement.confirmed_by_employee_at ? "Yes" : "Not yet", MARGIN + 300, y);
      pdf.text(money(settlement.amount), right, y, { align: "right" });
      y += LINE;
    }
  }

  y = Math.max(y + LINE * 2, pageHeight - MARGIN - LINE * 3);
  pdf.setDrawColor(210);
  pdf.line(MARGIN, y, MARGIN + 220, y);
  pdf.line(right - 220, y, right, y);
  y += 12;
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(8);
  pdf.setTextColor(110);
  pdf.text("Received by", MARGIN, y);
  pdf.text("Paid by", right - 220, y);

  const slug = balance.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const objectUrl = URL.createObjectURL(pdf.output("blob"));
  const anchor = document.createElement("a");
  anchor.href = objectUrl;
  anchor.download = `tip-statement-${slug || "employee"}-${new Date().toISOString().slice(0, 10)}.pdf`;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(objectUrl);
}

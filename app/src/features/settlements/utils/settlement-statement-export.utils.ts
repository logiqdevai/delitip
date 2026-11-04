import { jsPDF } from "jspdf";
import type {
  EmployeeBalance,
  Settlement,
} from "@/features/settlements/interfaces/settlements.interfaces";
import type { Currency } from "@/features/stores/interfaces/stores.interfaces";
import { formatMoney } from "@/lib/money";

const MARGIN = 56;
const LINE = 16;

const formatDate = (value: string | null | undefined, locale: string) =>
  value ? new Date(value).toLocaleDateString(locale, { dateStyle: "medium" }) : "—";

// jsPDF's built-in fonts only cover Latin text. Anything outside that range
// (e.g. Greek) is drawn with the browser's own fonts onto a canvas and placed
// in the PDF as an image, so every language stays legible.
const NEEDS_RASTER = /[^\u0000-\u00ff\u2013\u2014\u2018\u2019\u201c\u201d\u2022\u20ac]/;
const RASTER_SCALE = 4;

type Translate = (key: string, values?: Record<string, string | number>) => string;

interface StatementInput {
  businessName: string;
  balance: EmployeeBalance;
  settlements: Settlement[];
  currency: Currency;
  locale: string;
  /** Translator scoped to `dashboard.money.statement`. */
  t: Translate;
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
  locale,
  t,
}: StatementInput): void {
  const pdf = new jsPDF({ orientation: "portrait", unit: "pt", format: "a4" });
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const right = pageWidth - MARGIN;
  let y = MARGIN;

  const money = (amount: number) => formatMoney(amount, currency, locale);

  const drawText = (
    text: string,
    x: number,
    baseline: number,
    options?: { align?: "right" },
  ) => {
    if (!NEEDS_RASTER.test(text)) {
      pdf.text(text, x, baseline, options);
      return;
    }
    const size = pdf.getFontSize();
    const bold = pdf.getFont().fontStyle === "bold";
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const font = `${bold ? "bold " : ""}${size * RASTER_SCALE}px Helvetica, Arial, sans-serif`;
    ctx.font = font;
    const widthPx = Math.ceil(ctx.measureText(text).width) + 2;
    const heightPx = Math.ceil(size * 1.4 * RASTER_SCALE);
    canvas.width = widthPx;
    canvas.height = heightPx;
    ctx.font = font;
    ctx.fillStyle = pdf.getTextColor();
    ctx.textBaseline = "alphabetic";
    ctx.fillText(text, 0, size * 1.1 * RASTER_SCALE);
    const widthPt = widthPx / RASTER_SCALE;
    const left = options?.align === "right" ? x - widthPt : x;
    pdf.addImage(
      canvas.toDataURL("image/png"),
      "PNG",
      left,
      baseline - size * 1.1,
      widthPt,
      heightPx / RASTER_SCALE,
    );
  };

  const heading = (text: string, size: number) => {
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(size);
    drawText(text, MARGIN, y);
    y += size + 6;
  };

  const row = (label: string, value: string, bold = false) => {
    pdf.setFont("helvetica", bold ? "bold" : "normal");
    pdf.setFontSize(10);
    drawText(label, MARGIN, y);
    drawText(value, right, y, { align: "right" });
    y += LINE;
  };

  const rule = () => {
    pdf.setDrawColor(210);
    pdf.line(MARGIN, y, right, y);
    y += LINE;
  };

  heading(t("title"), 18);
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(10);
  pdf.setTextColor(110);
  drawText(
    t("generated", {
      business: businessName,
      date: formatDate(new Date().toISOString(), locale),
    }),
    MARGIN,
    y,
  );
  pdf.setTextColor(0);
  y += LINE * 2;

  heading(balance.name, 13);
  rule();

  row(t("earned"), money(balance.earned_amount));
  row(t("handedOver"), money(balance.settled_amount));
  if (balance.pending_adjustments_amount !== 0) {
    row(t("deductionsPending"), money(balance.pending_adjustments_amount));
  }
  rule();
  row(t("stillOwed"), money(balance.outstanding_amount), true);
  y += LINE;

  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(8);
  pdf.setTextColor(110);
  drawText(
    t("reachedBusiness", { amount: money(balance.received_by_store_amount) }),
    MARGIN,
    y,
  );
  pdf.setTextColor(0);
  y += LINE * 2;

  const recorded = settlements.filter((settlement) => !settlement.reversed_at);
  if (recorded.length > 0) {
    heading(t("paymentsRecorded"), 12);
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(9);
    drawText(t("date"), MARGIN, y);
    drawText(t("reference"), MARGIN + 110, y);
    drawText(t("confirmed"), MARGIN + 300, y);
    drawText(t("amount"), right, y, { align: "right" });
    y += LINE;
    rule();

    for (const settlement of recorded) {
      if (y > pageHeight - MARGIN * 2) {
        pdf.addPage();
        y = MARGIN;
      }
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(9);
      drawText(formatDate(settlement.settled_at, locale), MARGIN, y);
      drawText((settlement.reference ?? "—").slice(0, 32), MARGIN + 110, y);
      drawText(
        settlement.confirmed_by_employee_at ? t("yes") : t("notYet"),
        MARGIN + 300,
        y,
      );
      drawText(money(settlement.amount), right, y, { align: "right" });
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
  drawText(t("receivedBy"), MARGIN, y);
  drawText(t("paidBy"), right - 220, y);

  const slug = balance.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const objectUrl = URL.createObjectURL(pdf.output("blob"));
  const anchor = document.createElement("a");
  anchor.href = objectUrl;
  anchor.download = `${t("filePrefix")}-${slug || t("fileFallback")}-${new Date().toISOString().slice(0, 10)}.pdf`;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(objectUrl);
}

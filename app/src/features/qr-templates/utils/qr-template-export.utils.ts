import { toPng } from "html-to-image";
import { jsPDF } from "jspdf";

const CARD_WIDTH_IN = 4;
const CARD_HEIGHT_IN = 6;

/** Rasterizes `node` at print resolution and downloads it as a full-bleed 4x6in PDF. */
export async function downloadTemplatePdf(
  node: HTMLElement,
  filename: string,
): Promise<void> {
  const dataUrl = await toPng(node, { pixelRatio: 4, cacheBust: true });

  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "in",
    format: [CARD_WIDTH_IN, CARD_HEIGHT_IN],
  });
  pdf.addImage(dataUrl, "PNG", 0, 0, CARD_WIDTH_IN, CARD_HEIGHT_IN);

  const objectUrl = URL.createObjectURL(pdf.output("blob"));
  const anchor = document.createElement("a");
  anchor.href = objectUrl;
  anchor.download = filename.endsWith(".pdf") ? filename : `${filename}.pdf`;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(objectUrl);
}

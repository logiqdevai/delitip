import { type FC, type ReactNode } from "react";
import { Store } from "lucide-react";
import {
  getQrEditorSectionOption,
  type QrEditorSection,
} from "@/config/constants/dropdowns/qr-codes/qr-editor-section.options";

interface SectionCardProps {
  section: QrEditorSection;
  children: ReactNode;
}

export const SectionCard: FC<SectionCardProps> = ({ section, children }) => {
  const option = getQrEditorSectionOption(section);

  return (
    <div className="@container space-y-5 rounded-2xl border border-zinc-200/80 bg-white px-4 py-5 shadow-xs sm:p-6">
      <div>
        <h2 className="text-sm font-bold text-ink-charcoal">{option.label}</h2>
        <p className="mt-0.5 text-xs text-zinc-500">{option.description}</p>
        {option.storeWide ? (
          <p className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-zinc-100 px-2.5 py-1 text-[11px] font-medium text-zinc-600">
            <Store className="size-3" strokeWidth={2} />
            Applies to all QR codes in this store
          </p>
        ) : null}
      </div>
      {children}
    </div>
  );
};

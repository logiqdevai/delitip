import { type FC, type ReactNode } from "react";
import { useTranslations } from "next-intl";
import { Store } from "lucide-react";
import {
  getQrEditorSectionOption,
  QrEditorSectionOptions,
  type QrEditorSection,
} from "@/config/constants/dropdowns/qr-codes/qr-editor-section.options";
import {
  useDropdownDescription,
  useDropdownLabel,
} from "@/hooks/use-dropdown-options";

interface SectionCardProps {
  section: QrEditorSection;
  children: ReactNode;
}

export const SectionCard: FC<SectionCardProps> = ({ section, children }) => {
  const t = useTranslations("dashboard.access.qrEditor.section");
  const label = useDropdownLabel();
  const description = useDropdownDescription();
  const option = getQrEditorSectionOption(section);

  return (
    <div className="@container space-y-5 rounded-2xl border border-zinc-200/80 bg-white px-4 py-5 shadow-xs sm:p-6">
      <div>
        <h2 className="text-sm font-bold text-ink-charcoal">{label(QrEditorSectionOptions, option.id)}</h2>
        <p className="mt-0.5 text-xs text-zinc-500">{description(QrEditorSectionOptions, option.id)}</p>
        {option.storeWide ? (
          <p className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-zinc-100 px-2.5 py-1 text-[11px] font-medium text-zinc-600">
            <Store className="size-3" strokeWidth={2} />
            {t("storeWide")}
          </p>
        ) : null}
      </div>
      {children}
    </div>
  );
};

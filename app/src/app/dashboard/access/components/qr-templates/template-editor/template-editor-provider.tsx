"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type FC,
  type ReactNode,
} from "react";
import {
  TEMPLATE_STRUCTURAL_SHAPE,
  buildDefaultCanvas,
  buildDefaultElements,
} from "@/features/qr-templates/config/qr-template-layouts.config";
import { useQrTemplateAssets } from "@/features/qr-templates/hooks/use-qr-template-assets";
import {
  useQrTemplateCustomization,
  useResetQrTemplateCustomization,
  useSaveQrTemplateCustomization,
} from "@/features/qr-templates/hooks/use-qr-template-customization";
import type {
  TemplateCanvasConfig,
  TemplateElement,
  TemplateElementPatch,
  TemplateStructuralShape,
} from "@/features/qr-templates/interfaces/qr-template-elements.interfaces";
import type { QrTemplateId } from "@/features/qr-templates/interfaces/qr-templates.interfaces";
import type { Store } from "@/features/stores/interfaces/stores.interfaces";

interface TemplateEditorContextValue {
  store: Store;
  qrLabel: string;
  templateId: QrTemplateId;
  setTemplateId: (id: QrTemplateId) => void;
  elements: TemplateElement[];
  canvas: TemplateCanvasConfig;
  /** This store's actual default colors/content for the current template - used as the "Reset" target for individual color/text fields, as opposed to resetToDefault() which discards the whole saved customization. */
  defaultElements: TemplateElement[];
  defaultCanvas: TemplateCanvasConfig;
  structural: TemplateStructuralShape;
  selectedElementId: string | null;
  selectedElement: TemplateElement | null;
  selectElement: (id: string | null) => void;
  updateElement: (id: string, patch: TemplateElementPatch) => void;
  updateCanvas: (patch: Partial<TemplateCanvasConfig>) => void;
  isDirty: boolean;
  isReady: boolean;
  isLoading: boolean;
  isSaving: boolean;
  isResetting: boolean;
  save: () => Promise<void>;
  resetToDefault: () => Promise<void>;
  qrObjectUrl: string | null;
  logoObjectUrl: string | null;
  assetsError: string | null;
}

const TemplateEditorContext = createContext<TemplateEditorContextValue | null>(
  null,
);

export function useTemplateEditor(): TemplateEditorContextValue {
  const ctx = useContext(TemplateEditorContext);
  if (!ctx) {
    throw new Error(
      "useTemplateEditor must be used within a TemplateEditorProvider",
    );
  }
  return ctx;
}

interface TemplateEditorProviderProps {
  store: Store;
  qrLabel: string;
  tipUrl: string;
  initialTemplateId: QrTemplateId;
  open: boolean;
  children: ReactNode;
}

export const TemplateEditorProvider: FC<TemplateEditorProviderProps> = ({
  store,
  qrLabel,
  tipUrl,
  initialTemplateId,
  open,
  children,
}) => {
  const [templateId, setTemplateId] = useState<QrTemplateId>(initialTemplateId);
  const [elements, setElements] = useState<TemplateElement[]>(() =>
    buildDefaultElements(initialTemplateId, store),
  );
  const [canvas, setCanvas] = useState<TemplateCanvasConfig>(() =>
    buildDefaultCanvas(store),
  );
  const [selectedElementId, setSelectedElementId] = useState<string | null>(
    null,
  );
  const [isDirty, setIsDirty] = useState(false);
  const [loadedTemplateId, setLoadedTemplateId] = useState<QrTemplateId | null>(
    null,
  );

  const query = useQrTemplateCustomization(store.id, templateId, open);
  const saveMutation = useSaveQrTemplateCustomization(store.id, templateId);
  const resetMutation = useResetQrTemplateCustomization(store.id, templateId);
  const {
    qrObjectUrl,
    logoObjectUrl,
    error: assetsError,
  } = useQrTemplateAssets(open ? tipUrl : null, store.logo_document?.url);

  // Seed local editable state once per template - from a saved customization
  // if one exists, else the built-in defaults. Deliberately NOT re-run on
  // every query refetch (e.g. window refocus), so it never clobbers
  // in-progress, unsaved edits.
  useEffect(() => {
    if (!open) return;
    if (query.isPending) return;
    if (loadedTemplateId === templateId) return;

    const saved = query.data;
    setElements(saved ? saved.elements : buildDefaultElements(templateId, store));
    setCanvas(saved ? saved.canvas : buildDefaultCanvas(store));
    setSelectedElementId(null);
    setIsDirty(false);
    setLoadedTemplateId(templateId);
  }, [open, templateId, query.data, query.isPending, loadedTemplateId, store]);

  const selectElement = (id: string | null) => setSelectedElementId(id);

  const updateElement = (id: string, patch: TemplateElementPatch) => {
    setElements((prev) =>
      prev.map((element) =>
        element.id === id
          ? ({ ...element, ...patch } as TemplateElement)
          : element,
      ),
    );
    setIsDirty(true);
  };

  const updateCanvas = (patch: Partial<TemplateCanvasConfig>) => {
    setCanvas((prev) => ({ ...prev, ...patch }));
    setIsDirty(true);
  };

  const save = async () => {
    await saveMutation.mutateAsync({ canvas, elements });
    setIsDirty(false);
  };

  const resetToDefault = async () => {
    await resetMutation.mutateAsync();
    setElements(buildDefaultElements(templateId, store));
    setCanvas(buildDefaultCanvas(store));
    setSelectedElementId(null);
    setIsDirty(false);
  };

  const selectedElement = useMemo(
    () => elements.find((element) => element.id === selectedElementId) ?? null,
    [elements, selectedElementId],
  );

  const defaultElements = useMemo(
    () => buildDefaultElements(templateId, store),
    [templateId, store],
  );
  const defaultCanvas = useMemo(() => buildDefaultCanvas(store), [store]);

  const value: TemplateEditorContextValue = {
    store,
    qrLabel,
    templateId,
    setTemplateId,
    elements,
    canvas,
    defaultElements,
    defaultCanvas,
    structural: TEMPLATE_STRUCTURAL_SHAPE[templateId],
    selectedElementId,
    selectedElement,
    selectElement,
    updateElement,
    updateCanvas,
    isDirty,
    isReady: loadedTemplateId === templateId,
    isLoading: query.isPending,
    isSaving: saveMutation.isPending,
    isResetting: resetMutation.isPending,
    save,
    resetToDefault,
    qrObjectUrl,
    logoObjectUrl,
    assetsError,
  };

  return (
    <TemplateEditorContext.Provider value={value}>
      {children}
    </TemplateEditorContext.Provider>
  );
};

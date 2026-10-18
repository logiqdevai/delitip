"use client";

import { type FC, type ReactNode, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  buildEditorDefaults,
  buildStorePayload,
} from "@/app/dashboard/access/qr/hooks/use-qr-editor-defaults";
import {
  QrEditorContext,
  type QrEditorContextValue,
} from "@/app/dashboard/access/qr/hooks/use-qr-editor";
import {
  qrEditorSchema,
  type QrEditorFormValues,
} from "@/app/dashboard/access/qr/validation-schemas/qr-editor.schema";
import {
  useCreateQrCode,
  useUpdateQrCode,
} from "@/features/qr-codes/hooks/use-qr-codes";
import type { QrCode } from "@/features/qr-codes/interfaces/qr-codes.interfaces";
import type { Store } from "@/features/stores/interfaces/stores.interfaces";
import { useUpdateStore } from "@/features/stores/hooks/use-stores";
import { useUnsavedChangesWarning } from "@/hooks/use-unsaved-changes-warning";
import { Routes } from "@/routes/routes";

interface QrEditorProviderProps {
  store: Store;
  qr: QrCode | null;
  /** Employees preselected when creating a new QR code. */
  defaultEmployeeIds?: string[];
  children: ReactNode;
}

export const QrEditorProvider: FC<QrEditorProviderProps> = ({
  store,
  qr,
  defaultEmployeeIds,
  children,
}) => {
  const router = useRouter();
  const isEdit = !!qr;
  const createQr = useCreateQrCode(store.id);
  const updateQr = useUpdateQrCode();
  const updateStore = useUpdateStore();

  // Computed once per mount; the page remounts this provider (via `key`)
  // when it switches to another QR code.
  const [defaults] = useState<QrEditorFormValues>(() =>
    buildEditorDefaults(store, qr, defaultEmployeeIds),
  );

  // Last persisted values, so "Discard" never rolls back past a save.
  const [savedValues, setSavedValues] = useState(defaults);

  const form = useForm<QrEditorFormValues>({
    resolver: zodResolver(qrEditorSchema),
    defaultValues: defaults,
    mode: "onChange",
  });

  const { isDirty, dirtyFields } = form.formState;
  const isSaving =
    createQr.isPending || updateQr.isPending || updateStore.isPending;

  useUnsavedChangesWarning(isDirty && !isSaving);

  const submit = form.handleSubmit(async (values) => {
    try {
      const storeDirty = Object.keys(dirtyFields.store ?? {}).length > 0;
      if (storeDirty) {
        await updateStore.mutateAsync({
          id: store.id,
          payload: buildStorePayload(values.store),
        });
      }

      const qrPayload = {
        label: values.qr.label,
        selection_mode: values.qr.selection_mode,
        employee_ids: values.qr.employee_ids,
        spot_ids: values.qr.spot_ids,
      };

      if (qr) {
        const qrDirty = Object.keys(dirtyFields.qr ?? {}).length > 0;
        if (qrDirty) {
          await updateQr.mutateAsync({
            id: qr.id,
            payload: {
              ...qrPayload,
              is_active: values.qr.is_active,
              distribution_rule_id: values.qr.distribution_rule_id || null,
            },
          });
        }
        setSavedValues(values);
        form.reset(values);
        return;
      }

      const created = await createQr.mutateAsync({
        ...qrPayload,
        distribution_rule_id: values.qr.distribution_rule_id || undefined,
      });
      setSavedValues(values);
      form.reset(values);
      router.replace(Routes.dashboard.accessQrEdit(created.id));
    } catch {
      // Mutation hooks already surface the error as a toast.
    }
  });

  const value: QrEditorContextValue = {
    form,
    store,
    qr,
    isEdit,
    isDirty,
    isSaving,
    save: async () => {
      await submit();
    },
    discard: () => form.reset(savedValues),
  };

  return (
    <QrEditorContext.Provider value={value}>
      {children}
    </QrEditorContext.Provider>
  );
};

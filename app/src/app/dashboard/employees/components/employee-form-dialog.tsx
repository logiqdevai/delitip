"use client";

import { type FC, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ActionButtonWithPending } from "@/components/ui/action-button-with-pending";
import { Button } from "@/components/ui/button";
import { CountryFlag } from "@/components/ui/country-flag";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ImagePicker } from "@/components/ui/image-picker";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { StoreLanguageFormOptions } from "@/config/constants/dropdowns/stores/store-language-form.options";
import {
  useDeleteDocument,
  useUploadDocument,
} from "@/features/documents/hooks/use-documents";
import { DocumentTypes } from "@/features/documents/interfaces/documents.interfaces";
import {
  useCreateEmployee,
  useUpdateEmployee,
  useUpdateEmployeeTranslation,
} from "@/features/employees/hooks/use-employees";
import type { Employee } from "@/features/employees/interfaces/employees.interfaces";
import {
  employeeFormSchema,
  type EmployeeFormData,
} from "@/features/employees/validation-schemas/employees.schema";
import { useWorkspace } from "@/features/stores/hooks/use-workspace";
import type { Language } from "@/features/stores/interfaces/stores.interfaces";

interface EmployeeFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  storeId: string;
  employee?: Employee | null;
}

const getLanguageLabel = (language: Language): string =>
  StoreLanguageFormOptions.find((option) => option.id === language)?.label ??
  language;

const EmployeeTranslationRow: FC<{
  employeeId: string;
  language: Language;
  initialText: string;
}> = ({ employeeId, language, initialText }) => {
  const updateTranslation = useUpdateEmployeeTranslation();
  const [text, setText] = useState(initialText);
  const dirty = text !== initialText;
  const option = StoreLanguageFormOptions.find((item) => item.id === language);

  const handleSave = () => {
    updateTranslation.mutate({
      id: employeeId,
      payload: { language, text },
    });
  };

  return (
    <div className="flex items-end gap-2">
      <div className="min-w-0 flex-1 space-y-1.5">
        <Label className="flex items-center gap-1.5 text-[11px] text-zinc-500">
          {option ? <CountryFlag countryCode={option.flagCountryCode} /> : null}
          {getLanguageLabel(language)}
        </Label>
        <Input
          value={text}
          onChange={(event) => setText(event.target.value)}
          placeholder="Name in this language"
        />
      </div>
      <Button
        type="button"
        size="sm"
        variant="outline"
        disabled={!dirty || updateTranslation.isPending}
        onClick={handleSave}
      >
        {updateTranslation.isPending ? "Saving…" : "Save"}
      </Button>
    </div>
  );
};

export const EmployeeFormDialog: FC<EmployeeFormDialogProps> = ({
  open,
  onOpenChange,
  storeId,
  employee,
}) => {
  const isEdit = !!employee;
  const { store } = useWorkspace();
  const createEmployee = useCreateEmployee(storeId);
  const updateEmployee = useUpdateEmployee();
  const uploadDocument = useUploadDocument();
  const deleteDocument = useDeleteDocument();
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [photoDocumentId, setPhotoDocumentId] = useState<string | null>(null);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [photoSeededForOpen, setPhotoSeededForOpen] = useState(false);

  if (open && !photoSeededForOpen) {
    setPhotoSeededForOpen(true);
    setPhotoDocumentId(employee?.photo_document_id ?? null);
    setPhotoUrl(employee?.photo_document?.url ?? null);
  } else if (!open && photoSeededForOpen) {
    setPhotoSeededForOpen(false);
  }

  const isPending =
    createEmployee.isPending || updateEmployee.isPending || isUploadingPhoto;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EmployeeFormData>({
    resolver: zodResolver(employeeFormSchema),
    defaultValues: {
      full_name: "",
      email: "",
      position: "",
    },
  });

  const primaryLanguage: Language = store?.primary_language ?? "EN";

  useEffect(() => {
    if (!open) {
      return;
    }
    const primaryKey = primaryLanguage.toLowerCase();
    const seededName = employee
      ? (employee.full_name_translations?.[primaryKey] ?? employee.full_name)
      : "";
    reset({
      full_name: seededName,
      email: employee?.email ?? "",
      position: employee?.position ?? "",
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [employee, open, reset]);

  const onSubmit = handleSubmit(async (values) => {
    const base = {
      full_name: values.full_name,
      email: values.email,
      position: values.position?.trim() || undefined,
    };

    try {
      if (isEdit && employee) {
        await updateEmployee.mutateAsync({
          id: employee.id,
          payload: { ...base, photo_document_id: photoDocumentId },
        });
      } else {
        await createEmployee.mutateAsync({
          ...base,
          photo_document_id: photoDocumentId ?? undefined,
        });
      }
      onOpenChange(false);
    } catch {}
  });

  const otherLanguages = (store?.supported_languages ?? []).filter(
    (language) => language !== primaryLanguage,
  );

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (isPending) return;
        onOpenChange(next);
      }}
    >
      <DialogContent className="sm:max-w-md" showCloseButton={!isPending}>
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit employee" : "Add employee"}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Update their profile details for tipping and QR assignment."
              : "Add a team member so customers can tip and review them."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-4" noValidate>
          <ImagePicker
            mode="image"
            label="Photo"
            hint="Optional"
            value={photoUrl ?? undefined}
            isPending={isUploadingPhoto}
            disabled={isPending || deleteDocument.isPending}
            onChange={(file) => {
              setIsUploadingPhoto(true);
              uploadDocument.mutate(
                { file, type: DocumentTypes.IMAGE },
                {
                  onSuccess: (document) => {
                    setPhotoDocumentId(document.id);
                    setPhotoUrl(document.url);
                  },
                  onSettled: () => setIsUploadingPhoto(false),
                },
              );
            }}
            onClear={
              photoDocumentId
                ? () =>
                    deleteDocument.mutate(photoDocumentId, {
                      onSuccess: () => {
                        setPhotoDocumentId(null);
                        setPhotoUrl(null);
                      },
                    })
                : undefined
            }
          />

          <div className="space-y-1.5">
            <Label htmlFor="employee-full-name">
              Full name{" "}
              <span className="font-normal text-zinc-400">
                ({getLanguageLabel(primaryLanguage)})
              </span>
            </Label>
            <Input
              id="employee-full-name"
              autoComplete="name"
              placeholder="Maria Papadopoulou"
              aria-invalid={!!errors.full_name}
              {...register("full_name")}
            />
            {errors.full_name ? (
              <p className="text-xs text-red-600">{errors.full_name.message}</p>
            ) : null}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="employee-email">Email</Label>
            <Input
              id="employee-email"
              type="email"
              autoComplete="email"
              placeholder="maria@example.com"
              aria-invalid={!!errors.email}
              {...register("email")}
            />
            {errors.email ? (
              <p className="text-xs text-red-600">{errors.email.message}</p>
            ) : null}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="employee-position">
              Position{" "}
              <span className="font-normal text-zinc-400">(optional)</span>
            </Label>
            <Input
              id="employee-position"
              placeholder="Server, barista…"
              aria-invalid={!!errors.position}
              {...register("position")}
            />
            {errors.position ? (
              <p className="text-xs text-red-600">{errors.position.message}</p>
            ) : null}
          </div>

          {isEdit && employee && otherLanguages.length > 0 ? (
            <div className="space-y-3 border-t border-zinc-100 pt-4">
              <div>
                <p className="text-xs font-bold text-ink-charcoal">
                  Name in other languages
                </p>
                <p className="text-[11px] text-zinc-500">
                  Shown to customers who view the tip page in a different
                  language.
                </p>
              </div>
              <div className="space-y-3">
                {otherLanguages.map((language) => (
                  <EmployeeTranslationRow
                    key={language}
                    employeeId={employee.id}
                    language={language}
                    initialText={
                      employee.full_name_translations?.[language.toLowerCase()] ?? ""
                    }
                  />
                ))}
              </div>
            </div>
          ) : null}

          <DialogFooter className="gap-2 sm:gap-2">
            <Button
              type="button"
              variant="outline"
              disabled={isPending}
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <ActionButtonWithPending type="submit" isPending={isPending}>
              {isEdit ? "Save changes" : "Add employee"}
            </ActionButtonWithPending>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

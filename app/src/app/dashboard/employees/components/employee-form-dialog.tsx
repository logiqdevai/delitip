"use client";

import { type FC, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ActionButtonWithPending } from "@/components/ui/action-button-with-pending";
import { Button } from "@/components/ui/button";
import {
  ConfirmationDialog,
  useConfirmationDialog,
} from "@/components/ui/confirmation-dialog";
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
import { MultilingualInput } from "@/components/ui/multilingual-input";
import { useUploadDocument } from "@/features/documents/hooks/use-documents";
import { DocumentTypes } from "@/features/documents/interfaces/documents.interfaces";
import { deleteDocument as deleteDocumentRequest } from "@/features/documents/services/documents.services";
import {
  useCreateEmployee,
  useUpdateEmployee,
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
  onCreated?: (employee: Employee) => void;
}

export const EmployeeFormDialog: FC<EmployeeFormDialogProps> = ({
  open,
  onOpenChange,
  storeId,
  employee,
  onCreated,
}) => {
  const isEdit = !!employee;
  const { store } = useWorkspace();
  const createEmployee = useCreateEmployee(storeId);
  const updateEmployee = useUpdateEmployee();
  const uploadDocument = useUploadDocument();
  const removePhotoConfirm = useConfirmationDialog();
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [photoDocumentId, setPhotoDocumentId] = useState<string | null>(null);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [photoDirty, setPhotoDirty] = useState(false);
  const [fullNameTranslations, setFullNameTranslations] = useState<
    Record<string, string>
  >({});
  const [fullNameError, setFullNameError] = useState<string | null>(null);
  const [seededOpen, setSeededOpen] = useState(false);

  if (open && !seededOpen) {
    setSeededOpen(true);
    setPhotoDocumentId(employee?.photo_document_id ?? null);
    setPhotoUrl(employee?.photo_document?.url ?? null);
    setPhotoDirty(false);
    setFullNameTranslations(employee?.full_name_translations ?? {});
    setFullNameError(null);
  } else if (!open && seededOpen) {
    setSeededOpen(false);
    setPhotoDirty(false);
  }

  useEffect(() => {
    if (!open || photoDirty) return;
    setPhotoDocumentId(employee?.photo_document_id ?? null);
    setPhotoUrl(employee?.photo_document?.url ?? null);
  }, [
    open,
    photoDirty,
    employee?.photo_document_id,
    employee?.photo_document?.url,
  ]);

  const isPending =
    createEmployee.isPending ||
    (updateEmployee.isPending && !isUploadingPhoto) ||
    isUploadingPhoto;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EmployeeFormData>({
    resolver: zodResolver(employeeFormSchema),
    defaultValues: {
      email: "",
      position: "",
    },
  });

  const primaryLanguage: Language = store?.primary_language ?? "EN";
  const fieldLanguages = store?.supported_languages?.length
    ? store.supported_languages
    : [primaryLanguage];

  useEffect(() => {
    if (!open) {
      return;
    }
    reset({
      email: employee?.email ?? "",
      position: employee?.position ?? "",
    });
  }, [employee?.id, employee?.email, employee?.position, open, reset]);

  const persistPhoto = async (
    nextDocumentId: string | null,
    nextUrl: string | null,
    previousId: string | null,
  ) => {
    if (!isEdit || !employee) {
      setPhotoDirty(true);
      setPhotoDocumentId(nextDocumentId);
      setPhotoUrl(nextUrl);
      if (previousId && previousId !== nextDocumentId) {
        void deleteDocumentRequest(previousId).catch(() => undefined);
      }
      return;
    }

    await updateEmployee.mutateAsync({
      id: employee.id,
      payload: { photo_document_id: nextDocumentId },
    });

    setPhotoDocumentId(nextDocumentId);
    setPhotoUrl(nextUrl);
    setPhotoDirty(false);

    if (previousId && previousId !== nextDocumentId) {
      void deleteDocumentRequest(previousId).catch(() => undefined);
    }
  };

  const onSubmit = handleSubmit(async (values) => {
    const primaryKey = primaryLanguage.toLowerCase();
    const fullName = fullNameTranslations[primaryKey]?.trim() ?? "";
    if (!fullName) {
      setFullNameError("Full name is required");
      return;
    }
    setFullNameError(null);

    const position = values.position?.trim() || undefined;

    try {
      if (isEdit && employee) {
        await updateEmployee.mutateAsync({
          id: employee.id,
          payload: {
            full_name_translations: fullNameTranslations,
            email: values.email,
            position,
          },
        });
      } else {
        const created = await createEmployee.mutateAsync({
          full_name: fullName,
          email: values.email,
          position,
          photo_document_id: photoDocumentId ?? undefined,
        });
        onOpenChange(false);
        onCreated?.(created);
        return;
      }

      onOpenChange(false);
    } catch {}
  });

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
            disabled={isPending}
            onChange={(file) => {
              setIsUploadingPhoto(true);
              const previousId = photoDocumentId;
              uploadDocument.mutate(
                { file, type: DocumentTypes.IMAGE },
                {
                  onSuccess: (document) => {
                    void persistPhoto(document.id, document.url, previousId)
                      .catch(() => {
                        void deleteDocumentRequest(document.id).catch(
                          () => undefined,
                        );
                      })
                      .finally(() => setIsUploadingPhoto(false));
                  },
                  onError: () => setIsUploadingPhoto(false),
                },
              );
            }}
            onClear={
              photoDocumentId
                ? () => removePhotoConfirm.openDialog()
                : undefined
            }
          />

          <div className="space-y-1.5">
            <Label htmlFor="employee-full-name">Full name</Label>
            <MultilingualInput
              key={employee?.id ?? "new"}
              storeId={storeId}
              id="employee-full-name"
              autoComplete="name"
              placeholder="Maria Papadopoulou"
              languages={isEdit ? fieldLanguages : [primaryLanguage]}
              primaryLanguage={primaryLanguage}
              value={fullNameTranslations}
              onValueChange={setFullNameTranslations}
              invalid={!!fullNameError}
            />
            {fullNameError ? (
              <p className="text-xs text-red-600">{fullNameError}</p>
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

      <ConfirmationDialog
        state={removePhotoConfirm}
        title="Remove photo?"
        description={
          isEdit
            ? "This photo will be removed from the employee profile right away."
            : "This photo will be discarded."
        }
        confirmLabel="Remove"
        isPending={isUploadingPhoto}
        onConfirm={async () => {
          setIsUploadingPhoto(true);
          const previousId = photoDocumentId;
          try {
            await persistPhoto(null, null, previousId);
          } finally {
            setIsUploadingPhoto(false);
          }
        }}
      />
    </Dialog>
  );
};

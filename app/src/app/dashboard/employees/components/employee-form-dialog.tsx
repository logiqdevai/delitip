"use client";

import { type FC, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ActionButtonWithPending } from "@/components/ui/action-button-with-pending";
import { Button } from "@/components/ui/button";
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
import {
  useDeleteDocument,
  useUploadDocument,
} from "@/features/documents/hooks/use-documents";
import { DocumentTypes } from "@/features/documents/interfaces/documents.interfaces";
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
}

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
  const [fullNameTranslations, setFullNameTranslations] = useState<
    Record<string, string>
  >({});
  const [fullNameError, setFullNameError] = useState<string | null>(null);

  if (open && !photoSeededForOpen) {
    setPhotoSeededForOpen(true);
    setPhotoDocumentId(employee?.photo_document_id ?? null);
    setPhotoUrl(employee?.photo_document?.url ?? null);
    setFullNameTranslations(employee?.full_name_translations ?? {});
    setFullNameError(null);
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
  }, [employee, open, reset]);

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
            photo_document_id: photoDocumentId,
          },
        });
      } else {
        await createEmployee.mutateAsync({
          full_name: fullName,
          email: values.email,
          position,
          photo_document_id: photoDocumentId ?? undefined,
        });
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
    </Dialog>
  );
};

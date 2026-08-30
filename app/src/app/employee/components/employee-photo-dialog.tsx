"use client";

import { type FC, useState } from "react";
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
import { useUploadDocument } from "@/features/documents/hooks/use-documents";
import { DocumentTypes } from "@/features/documents/interfaces/documents.interfaces";
import { deleteDocument as deleteDocumentRequest } from "@/features/documents/services/documents.services";
import { useUpdateEmployee } from "@/features/employees/hooks/use-employees";
import type { Employee } from "@/features/employees/interfaces/employees.interfaces";

interface EmployeePhotoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  employee: Employee;
}

export const EmployeePhotoDialog: FC<EmployeePhotoDialogProps> = ({
  open,
  onOpenChange,
  employee,
}) => {
  const uploadDocument = useUploadDocument();
  const updateEmployee = useUpdateEmployee();
  const removePhotoConfirm = useConfirmationDialog();
  const [isUploading, setIsUploading] = useState(false);

  const isPending = isUploading || updateEmployee.isPending;

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (isPending) return;
        onOpenChange(next);
      }}
    >
      <DialogContent className="sm:max-w-sm" showCloseButton={!isPending}>
        <DialogHeader>
          <DialogTitle>Profile photo</DialogTitle>
          <DialogDescription>
            Shown to your team in the dashboard. Customers never see it.
          </DialogDescription>
        </DialogHeader>

        <ImagePicker
          mode="image"
          label="Photo"
          value={employee.photo_document?.url}
          isPending={isUploading}
          disabled={isPending}
          onChange={(file) => {
            setIsUploading(true);
            const previousId = employee.photo_document_id;
            uploadDocument.mutate(
              { file, type: DocumentTypes.IMAGE },
              {
                onSuccess: (document) =>
                  updateEmployee.mutate(
                    {
                      id: employee.id,
                      payload: { photo_document_id: document.id },
                    },
                    {
                      onSuccess: () => {
                        if (previousId) {
                          void deleteDocumentRequest(previousId).catch(
                            () => undefined,
                          );
                        }
                      },
                      onError: () => {
                        void deleteDocumentRequest(document.id).catch(
                          () => undefined,
                        );
                      },
                      onSettled: () => setIsUploading(false),
                    },
                  ),
                onError: () => setIsUploading(false),
              },
            );
          }}
          onClear={
            employee.photo_document_id
              ? () => removePhotoConfirm.openDialog()
              : undefined
          }
        />

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            disabled={isPending}
            onClick={() => onOpenChange(false)}
          >
            Done
          </Button>
        </DialogFooter>
      </DialogContent>

      <ConfirmationDialog
        state={removePhotoConfirm}
        title="Remove photo?"
        description="This photo will be removed from your profile right away."
        confirmLabel="Remove"
        isPending={isPending}
        onConfirm={async () => {
          const previousId = employee.photo_document_id;
          if (!previousId) return;

          setIsUploading(true);
          try {
            await updateEmployee.mutateAsync({
              id: employee.id,
              payload: { photo_document_id: null },
            });
            void deleteDocumentRequest(previousId).catch(() => undefined);
          } finally {
            setIsUploading(false);
          }
        }}
      />
    </Dialog>
  );
};

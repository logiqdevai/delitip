"use client";

import { type FC, useState } from "react";
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
import {
  useDeleteDocument,
  useUploadDocument,
} from "@/features/documents/hooks/use-documents";
import { DocumentTypes } from "@/features/documents/interfaces/documents.interfaces";
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
  const deleteDocument = useDeleteDocument();
  const updateEmployee = useUpdateEmployee();
  const [isUploading, setIsUploading] = useState(false);

  const isPending =
    isUploading || deleteDocument.isPending || updateEmployee.isPending;

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
          disabled={deleteDocument.isPending || updateEmployee.isPending}
          onChange={(file) => {
            setIsUploading(true);
            uploadDocument.mutate(
              { file, type: DocumentTypes.IMAGE },
              {
                onSuccess: (document) =>
                  updateEmployee.mutate({
                    id: employee.id,
                    payload: { photo_document_id: document.id },
                  }),
                onSettled: () => setIsUploading(false),
              },
            );
          }}
          onClear={
            employee.photo_document_id
              ? () =>
                  deleteDocument.mutate(employee.photo_document_id!, {
                    onSuccess: () =>
                      updateEmployee.mutate({
                        id: employee.id,
                        payload: { photo_document_id: null },
                      }),
                  })
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
    </Dialog>
  );
};

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createQrCode,
  deleteQrCode,
  getPublicQrCode,
  getQrCode,
  getQrCodeStats,
  listQrCodes,
  updateQrCode,
} from "@/features/qr-codes/services/qr-codes.services";
import type {
  CreateQrCodePayload,
  QrCodesQuery,
  UpdateQrCodePayload,
} from "@/features/qr-codes/interfaces/qr-codes.interfaces";
import { toast } from "@/components/ui/toast";

export const qrCodesQueryKeys = {
  root: ["qr-codes"] as const,
  list: (storeId: string, query?: QrCodesQuery) =>
    ["qr-codes", storeId, query] as const,
  detail: (id: string) => ["qr-code", id] as const,
  stats: (id: string) => ["qr-code-stats", id] as const,
  public: (code: string) => ["public-qr", code] as const,
};

export const useQrCodes = (storeId: string, query?: QrCodesQuery) => {
  return useQuery({
    queryKey: qrCodesQueryKeys.list(storeId, query),
    queryFn: () => listQrCodes(storeId, query),
    enabled: !!storeId,
  });
};

export const useQrCode = (id: string) => {
  return useQuery({
    queryKey: qrCodesQueryKeys.detail(id),
    queryFn: () => getQrCode(id),
    enabled: !!id,
  });
};

export const useQrCodeStats = (id: string) => {
  return useQuery({
    queryKey: qrCodesQueryKeys.stats(id),
    queryFn: () => getQrCodeStats(id),
    enabled: !!id,
  });
};

export const usePublicQrCode = (code: string) => {
  return useQuery({
    queryKey: qrCodesQueryKeys.public(code),
    queryFn: () => getPublicQrCode(code),
    enabled: !!code,
  });
};

export const useCreateQrCode = (storeId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateQrCodePayload) =>
      createQrCode(storeId, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: qrCodesQueryKeys.root });
      toast.add({
        title: "QR code created",
        description: "Print or share the tip link with customers.",
        type: "success",
      });
    },
    onError: (error: Error) => {
      toast.add({
        title: "Could not create QR code",
        description: error.message,
        type: "error",
      });
    },
  });
};

export const useUpdateQrCode = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateQrCodePayload;
    }) => updateQrCode(id, payload),
    onSuccess: (_data, variables) => {
      void queryClient.invalidateQueries({ queryKey: qrCodesQueryKeys.root });
      void queryClient.invalidateQueries({
        queryKey: qrCodesQueryKeys.detail(variables.id),
      });
      toast.add({
        title: "QR code updated",
        description: "Your changes were saved.",
        type: "success",
      });
    },
    onError: (error: Error) => {
      toast.add({
        title: "Could not update QR code",
        description: error.message,
        type: "error",
      });
    },
  });
};

export const useDeleteQrCode = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteQrCode(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: qrCodesQueryKeys.root });
      toast.add({
        title: "QR code deleted",
        type: "success",
      });
    },
    onError: (error: Error) => {
      toast.add({
        title: "Could not delete QR code",
        description: error.message,
        type: "error",
      });
    },
  });
};

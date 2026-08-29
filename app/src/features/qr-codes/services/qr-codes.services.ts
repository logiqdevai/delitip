import axiosInstance from "@/config/api/axios";
import { ApiRoutes } from "@/config/api/routes";
import type { PaginatedResponse } from "@/interfaces/pagination.interfaces";
import type {
  CreateQrCodePayload,
  PublicQrCode,
  QrCode,
  QrCodesQuery,
  UpdateQrCodePayload,
} from "@/features/qr-codes/interfaces/qr-codes.interfaces";

export const listQrCodes = async (
  storeId: string,
  query?: QrCodesQuery,
): Promise<PaginatedResponse<QrCode>> => {
  try {
    const response = await axiosInstance.get<PaginatedResponse<QrCode>>(
      ApiRoutes.stores.qrCodes(storeId),
      { params: query },
    );
    return response.data;
  } catch {
    throw new Error("Failed to load QR codes. Please try again.");
  }
};

export const getQrCode = async (id: string): Promise<QrCode> => {
  try {
    const response = await axiosInstance.get<QrCode>(
      ApiRoutes.qrCodes.byId(id),
    );
    return response.data;
  } catch {
    throw new Error("Failed to load QR code. Please try again.");
  }
};

export const createQrCode = async (
  storeId: string,
  payload: CreateQrCodePayload,
): Promise<QrCode> => {
  try {
    const response = await axiosInstance.post<QrCode>(
      ApiRoutes.stores.qrCodes(storeId),
      payload,
    );
    return response.data;
  } catch {
    throw new Error("Failed to create QR code. Please try again.");
  }
};

export const updateQrCode = async (
  id: string,
  payload: UpdateQrCodePayload,
): Promise<QrCode> => {
  try {
    const response = await axiosInstance.patch<QrCode>(
      ApiRoutes.qrCodes.byId(id),
      payload,
    );
    return response.data;
  } catch {
    throw new Error("Failed to update QR code. Please try again.");
  }
};

export const deleteQrCode = async (id: string): Promise<void> => {
  try {
    await axiosInstance.delete(ApiRoutes.qrCodes.byId(id));
  } catch {
    throw new Error("Failed to delete QR code. Please try again.");
  }
};

export const getQrCodeStats = async (id: string): Promise<unknown> => {
  try {
    const response = await axiosInstance.get(ApiRoutes.qrCodes.stats(id));
    return response.data;
  } catch {
    throw new Error("Failed to load QR code stats. Please try again.");
  }
};

export const getPublicQrCode = async (code: string): Promise<PublicQrCode> => {
  try {
    const response = await axiosInstance.get<PublicQrCode>(
      ApiRoutes.public.qr(code),
    );
    return response.data;
  } catch {
    throw new Error("Failed to resolve QR code. Please try again.");
  }
};

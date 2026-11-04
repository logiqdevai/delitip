import { tr } from "@/lib/i18n-runtime";
import axiosInstance from "@/config/api/axios";
import { ApiRoutes } from "@/config/api/routes";
import type { PaginatedResponse } from "@/interfaces/pagination.interfaces";
import type {
  CreateQrCodePayload,
  PublicQrCode,
  QrCode,
  QrCodesQuery,
  QrCodeStats,
  UpdateQrCodePayload,
} from "@/features/qr-codes/interfaces/qr-codes.interfaces";
import { getErrorMessage } from "@/lib/api-error";

export const listQrCodes = async (
  storeId: string,
  query?: QrCodesQuery,
): Promise<PaginatedResponse<QrCode>> => {
  try {
    const { employee_ids, spot_ids, distribution_rule_ids, ...rest } =
      query ?? {};
    const params = {
      ...rest,
      ...(employee_ids?.length ? { employee_ids: employee_ids.join(",") } : {}),
      ...(spot_ids?.length ? { spot_ids: spot_ids.join(",") } : {}),
      ...(distribution_rule_ids?.length
        ? { distribution_rule_ids: distribution_rule_ids.join(",") }
        : {}),
    };
    const response = await axiosInstance.get<PaginatedResponse<QrCode>>(
      ApiRoutes.stores.qrCodes(storeId),
      { params },
    );
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error, tr("errors.services.loadQRCodes")));
  }
};

export const getQrCode = async (id: string): Promise<QrCode> => {
  try {
    const response = await axiosInstance.get<QrCode>(
      ApiRoutes.qrCodes.byId(id),
    );
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error, tr("errors.services.loadQRCode")));
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
  } catch (error) {
    throw new Error(getErrorMessage(error, tr("errors.services.createQRCode")));
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
  } catch (error) {
    throw new Error(getErrorMessage(error, tr("errors.services.updateQRCode")));
  }
};

export const deleteQrCode = async (id: string): Promise<void> => {
  try {
    await axiosInstance.delete(ApiRoutes.qrCodes.byId(id));
  } catch (error) {
    throw new Error(getErrorMessage(error, tr("errors.services.deleteQRCode")));
  }
};

export const getQrCodeStats = async (id: string): Promise<QrCodeStats> => {
  try {
    const response = await axiosInstance.get<QrCodeStats>(
      ApiRoutes.qrCodes.stats(id),
    );
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error, tr("errors.services.loadQRCodeStats")));
  }
};

export const getPublicQrCode = async (
  code: string,
  lang?: string,
): Promise<PublicQrCode> => {
  try {
    const response = await axiosInstance.get<PublicQrCode>(
      ApiRoutes.public.qr(code),
      { params: lang ? { lang } : undefined },
    );
    return response.data;
  } catch (error) {
    throw new Error(
      getErrorMessage(
        error,
        tr("errors.services.openQrCode"),
      ),
    );
  }
};

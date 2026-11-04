import { tr } from "@/lib/i18n-runtime";
import axiosInstance from "@/config/api/axios";
import { ApiRoutes } from "@/config/api/routes";
import type {
  QrTemplateCustomization,
  UpsertQrTemplateCustomizationPayload,
} from "@/features/qr-templates/interfaces/qr-template-customization.interfaces";
import { getErrorMessage } from "@/lib/api-error";

export const getQrTemplateCustomization = async (
  storeId: string,
  templateId: string,
): Promise<QrTemplateCustomization | null> => {
  try {
    const response = await axiosInstance.get<QrTemplateCustomization | null>(
      ApiRoutes.stores.qrTemplateCustomization(storeId, templateId),
    );
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error, tr("errors.services.loadTheSavedTemplateDesign")));
  }
};

export const saveQrTemplateCustomization = async (
  storeId: string,
  templateId: string,
  payload: UpsertQrTemplateCustomizationPayload,
): Promise<QrTemplateCustomization> => {
  try {
    const response = await axiosInstance.put<QrTemplateCustomization>(
      ApiRoutes.stores.qrTemplateCustomization(storeId, templateId),
      payload,
    );
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error, tr("errors.services.saveTheTemplateDesign")));
  }
};

export const resetQrTemplateCustomization = async (
  storeId: string,
  templateId: string,
): Promise<void> => {
  try {
    await axiosInstance.delete(
      ApiRoutes.stores.qrTemplateCustomization(storeId, templateId),
    );
  } catch (error) {
    throw new Error(getErrorMessage(error, tr("errors.services.resetTheTemplateDesign")));
  }
};

import axiosInstance from "@/config/api/axios";
import { ApiRoutes } from "@/config/api/routes";
import type { PaginatedResponse } from "@/interfaces/pagination.interfaces";
import type {
  CreateSpotPayload,
  Spot,
  SpotsQuery,
  UpdateSpotPayload,
} from "@/features/spots/interfaces/spots.interfaces";

export const listSpots = async (
  storeId: string,
  query?: SpotsQuery,
): Promise<PaginatedResponse<Spot>> => {
  try {
    const response = await axiosInstance.get<PaginatedResponse<Spot>>(
      ApiRoutes.stores.spots(storeId),
      { params: query },
    );
    return response.data;
  } catch {
    throw new Error("Failed to load spots. Please try again.");
  }
};

export const createSpot = async (
  storeId: string,
  payload: CreateSpotPayload,
): Promise<Spot> => {
  try {
    const response = await axiosInstance.post<Spot>(
      ApiRoutes.stores.spots(storeId),
      payload,
    );
    return response.data;
  } catch {
    throw new Error("Failed to create spot. Please try again.");
  }
};

export const updateSpot = async (
  id: string,
  payload: UpdateSpotPayload,
): Promise<Spot> => {
  try {
    const response = await axiosInstance.patch<Spot>(
      ApiRoutes.spots.byId(id),
      payload,
    );
    return response.data;
  } catch {
    throw new Error("Failed to update spot. Please try again.");
  }
};

export const deleteSpot = async (id: string): Promise<void> => {
  try {
    await axiosInstance.delete(ApiRoutes.spots.byId(id));
  } catch {
    throw new Error("Failed to delete spot. Please try again.");
  }
};

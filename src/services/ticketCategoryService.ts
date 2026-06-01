import { axiosClient } from "../infrastructure/api/AxiosClient";
import type { TicketCategoryFormValues, TicketCategoryListResponse, TicketCategoryResponse } from "../types/ticketCategory";

export const getTicketCategoryRequest = async (): Promise<TicketCategoryListResponse> => {
  const { data } = await axiosClient.get("/categorias");
  return data;
};

export const createNewTicketCategoryUseCase = async (
  datos: TicketCategoryFormValues | FormData
): Promise<TicketCategoryListResponse> => {

  const { data } = await axiosClient.post<TicketCategoryListResponse>(
    "/categorias",
    datos
  );
  return data;
};

export const getTicketCategoryByIdUseCase = async (
  id: number | string
): Promise<TicketCategoryResponse> => {
  const { data } = await axiosClient.get<TicketCategoryResponse>(
    `/categorias/${id}`
  );
  return data;
};

export const updateTicketCategoryRequest = async (
  id: number | string,
  datos: TicketCategoryFormValues | FormData
): Promise<TicketCategoryResponse> => {
  
  const { data } = await axiosClient.patch<TicketCategoryResponse>(
    `/categorias/${id}`,
    datos
  );
  
  return data;
};

export const deleteTicketCategoryRequest = async (
  id: number | string,
): Promise<TicketCategoryResponse> => {
  
  const { data } = await axiosClient.delete<TicketCategoryResponse>(
    `/categorias/${id}`,
  );
  
  return data;
};
import { axiosClient } from "../infrastructure/api/AxiosClient";
import type { TicketFormValues, TicketListResponse, TicketResponse,TicketCommentResponse,AddTicketCommentResponse } from "../types/ticket";

// OBTENER TODOS LOS TICKETS
export const getTicketsUseCase = async (): Promise<TicketListResponse> => {
  const { data } = await axiosClient.get("/tickets");
  return data;
};

export const createNewTicketUseCase = async (
  datos: FormData
): Promise<TicketResponse> => {

  const { data } = await axiosClient.post<TicketResponse>(
    "/tickets",
    datos,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  
  return data;
};

// OBTENER TICKER POR ID
export const getTicketByIdUseCase = async (
  id: number | string
): Promise<TicketResponse> => {
  const { data } = await axiosClient.get<TicketResponse>(
    `/tickets/${id}`
  );
  return data;
};

// ACTUALIZAR TICKET
export const updateTicketRequest = async (
  id: number | string,
  datos: TicketFormValues | FormData
): Promise<TicketResponse> => {
  
  const { data } = await axiosClient.patch<TicketResponse>(
    `/tickets/${id}`,
    datos
  );
  
  return data;
};

// ELIMINAR TICKET
export const deleteTicketRequest = async (
  id: number | string,
): Promise<TicketResponse> => {
  
  const { data } = await axiosClient.delete<TicketResponse>(
    `/tickets/${id}`,
  );
  
  return data;
};

// OBTENER COMENTARIOS
export const getCommentsByTicketUseCase = async (
  id: number | string,
): Promise<TicketCommentResponse> => {
  
  const { data } = await axiosClient.get<TicketCommentResponse>(
    `/comentarios/ticket/${id}`,
  );
  
  return data;
};

// CREAR COMENTARIOS
export const addCommentByTicketUseCase = async (
  datos: FormData
): Promise<AddTicketCommentResponse> => {
  const { data } = await axiosClient.post<AddTicketCommentResponse>(
    `/comentarios`,
    datos,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );
  return data;
};
// ACTUALIZAR ESTATUS TICKET
export const updateTicketStatusUseCase = async (
  id: number | string,
  status: string
): Promise<TicketResponse> => {
  
  const { data } = await axiosClient.patch<TicketResponse>(
    `/tickets/${id}/status`,
    { estado: status }
  );
  
  return data;
};

/**
 * Descarga el archivo binario (Blob) de una evidencia por su ID de forma segura
 * @param id ID del registro de la evidencia en la base de datos
 * @returns Promesa con el objeto Blob listo para ser convertido en URL
 */
export const getEvidenciaBlobByIdUseCase = async (
  id: number | string
): Promise<Blob> => {
  const { data } = await axiosClient.get<Blob>(
    `/adjuntos/tickets/${id}`, 
    {
      responseType: "blob", 
    }
  );
  
  return data;
};
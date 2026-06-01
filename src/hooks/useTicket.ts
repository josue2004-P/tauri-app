import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../store";
import Swal from "sweetalert2";
import { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";

import { 
  onLoadTickets,
  onLoadTicket,
  onLoadComments,
  onSetTicketsFilters,
  onSetError,
  onClearTicket,
  onSetIsLoading
 } from "../store/slices/ticketSlice";

import {
  GetTicketByIdUseCase,
  CreateNewTicketUseCase,
  GetTicketsUseCase,
  UpdateTicketUseCase,
  AddCommentByTicketUseCase,
  DeleteTicketUseCase,
  GetCommentsByTicketUseCase,
  UpdateTicketStatusUseCase,
  GetEvidenciaBlobByIdUseCase
} from "../application/ticket"

import type { TicketFormValues, } from "../types/ticket";
import type { TicketCommentFormValue } from '../types/ticket/TicketCommentFormValue';

export const useTicket = () => {
  const dispatch = useDispatch();
    const navigate = useNavigate();

  const { tickets, ticket, comments, isLoadingTickets, filtros, error } = useSelector(
    (state: RootState) => state.ticket
  );

  const handleError = useCallback((err: unknown, defaultMsg: string) => {
    let errorMsg = defaultMsg;
    if (err instanceof AxiosError) {
      errorMsg = err.response?.data?.message || err.response?.data?.error || defaultMsg;
    } else if (err instanceof Error) {
      errorMsg = err.message;
    }
    dispatch(onSetError(errorMsg));
    Swal.fire({ icon: "error", title: "Oops...", text: errorMsg });
  }, [dispatch]);

  // OBTENER TICKETS
  const startLoadTickets = useCallback(async () => {
    try {
      const useCase = new GetTicketsUseCase();
      const response = await useCase.execute();
      dispatch(onLoadTickets(response.data.data));
      dispatch(
        onSetTicketsFilters({
          total: response.data.total,
          page: response.data.page,
          totalPages: response.data.totalPages,
        })
      );
      return response.data.data;
    } catch (err: unknown) {
      handleError(err, "Error cargando categorías");
    }
  }, [dispatch, handleError]);

  // OBTENER TICKET POR ID
  const startLoadTicketById = useCallback(async (id: number | string) => {
    try {
      const useCase = new GetTicketByIdUseCase();
      const response = await useCase.execute(id);
      dispatch(onLoadTicket(response.data)); 
      return response.data;
    } catch (err: unknown) {
      handleError(err, "No se pudo cargar la categoría");
    }
  }, [dispatch, handleError]);

  // OBTENER COMENTARIOS POR TICKET
  const startLoadComments = useCallback(async (id: number | string) => {
    try {
      const response = await new GetCommentsByTicketUseCase().execute(id)
      dispatch(onLoadComments(response.data)); 
      return response.data;
    } catch (err: unknown) {
      handleError(err, "No se pudo cargar los comentarios");
    }
  }, [dispatch, handleError]);

  // GUARDAR TICKET
  const startSaveTicket = async (
    datos: TicketFormValues & { evidencias?: File[] }, 
    id?: number | string
  ) => {
    try {
      dispatch(onSetIsLoading(true));

      const response = id 
        ? await new UpdateTicketUseCase().execute(id, datos)
        : await new CreateNewTicketUseCase().execute(datos); 
      
      await Swal.fire({
        icon: "success",
        title: "¡Hecho!",
        text: response.message,
        timer: 1500,
        showConfirmButton: false
      });
      
      navigate("/tickets");
      return true;
    } catch (err: unknown) {
      handleError(err, id ? "Error al actualizar el ticket" : "Error al crear el ticket");
      return false;
    } finally {
      dispatch(onSetIsLoading(false));
    }
  };

  // ACTUALZIAR ESTATUS
  const startUpdateStatusTicket = async (status:string, id?: number | string) => {
    if (!id) return;
    try {
      const response = await new UpdateTicketStatusUseCase().execute(id,status)
      if (response && response.data) {
        dispatch(onLoadTicket(response.data));
      }
      await Swal.fire({
        icon: "success",
        title: "¡Hecho!",
        text: response.message,
        timer: 1500,
        showConfirmButton: false
      });
      
      navigate(`/tickets/editar/${id}`);
    
    } catch (err: unknown) {
      handleError(err, id ? "Error al actualizar el ticket" : "Error al crear el ticket");
      return false;
    } finally {
      dispatch(onSetIsLoading(false));
    }
  }

  // GUARDAR TICKET
  const startAddComment = async (datos: TicketCommentFormValue) => {
    try {
      dispatch(onSetIsLoading(true));

      const response = await new AddCommentByTicketUseCase().execute(datos);

      const ticketId = datos.ticketId;

      if (ticketId) {
        await startLoadComments(ticketId);
      }
        
      await Swal.fire({
        icon: "success",
        title: "¡Hecho!",
        text: response.message,
        timer: 1500,
        showConfirmButton: false
      });

      if (ticketId) {
        navigate(`/tickets/editar/${ticketId}`);
      }
      
      return true;
    } catch (err: unknown) {
      handleError(err, "Hubo un problema al enviar tu comentario. Inténtalo de nuevo.");
      return false;
    } finally {
      dispatch(onSetIsLoading(false));
    }
  };
  
  // ELIMINAR TICKET
  const startDeleteTicket = async (id: number | string) => {
      try {
        dispatch(onSetIsLoading(true));
        const response   = await new DeleteTicketUseCase().execute(id)
        await Swal.fire({
          icon: "success",
          title: "¡Hecho!",
          text: response.message,
          timer: 1500,
          showConfirmButton: false
        });
        navigate("/tickets");
     } catch (err: unknown) {
        handleError(err, id ? "Error al actualizar el ticket" : "Error al crear el ticket");
        return false;
      } finally {
        dispatch(onSetIsLoading(false));
      }
  }

  // MÉTODO PARA CARGAR EL BLOB DE LA EVIDENCIA
  const startLoadEvidenciaById = useCallback(async (id: number | string): Promise<Blob | undefined> => {
    try {
      const useCase = new GetEvidenciaBlobByIdUseCase();
      const blob = await useCase.execute(id);
      
      return blob;
    } catch (err: unknown) {
      console.error(`Error al cargar la evidencia #${id}:`, err);
      throw err;
    }
  }, []); 

  // MÉTODO PARA CARGAR EL BLOB DE UNA IMAGEN DE COMENTARIO
  const startLoadEvidenciaComentarioById = useCallback(async (id: number | string): Promise<string | undefined> => {
    try {
      const useCase = new GetEvidenciaBlobByIdUseCase();
      const blob = await useCase.execute(id);
      
      if (!blob) return undefined;

      const urlObjeto = URL.createObjectURL(blob);
      
      return urlObjeto;
    } catch (err: unknown) {
      console.error(`Error al cargar la evidencia #${id}:`, err);
      throw err;
    }
  }, []);

  // LIMPIAR FORMULARIO
  const clearSelectedTicket = useCallback(() => {
    dispatch(onClearTicket());
  }, [dispatch]);

  return {
    tickets,
    ticket,
    comments,
    isLoadingTickets,
    filtros,
    error,

    startLoadTickets,
    startLoadComments,
    startSaveTicket,
    startAddComment,
    startUpdateStatusTicket,
    startLoadTicketById,
    startDeleteTicket,
    startLoadEvidenciaById,
    startLoadEvidenciaComentarioById,
    clearSelectedTicket
  };
};

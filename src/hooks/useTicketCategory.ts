import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../store";
import type { TicketCategoryFormValues, } from "../types/ticketCategory";
import { useNavigate } from "react-router-dom";
import { 
  onLoadCategories,
  onLoadCategory,
  onSetCategoryFilters,
  onSetError,
  onClearCategory,
  onSetIsLoading
 } from "../store/slices/ticketCategorySlice";

import {
  GetTicketCategoryUseCase,
  CreateNewTicketCategoryUseCase,
  GetTicketCategoryByIdUseCase,
  UpdateTicketCategoryUseCase,
  DeleteTicketCategoryUseCase
} from "../application/ticketCategory"

import { useCallback } from "react";

import Swal from "sweetalert2";
import { AxiosError } from "axios";

export const useTicketCategory = () => {
  const dispatch = useDispatch();
    const navigate = useNavigate();

  const { categories, category, isLoadingCategories, filtros, error } = useSelector(
    (state: RootState) => state.ticketCategoria
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

  // OBTENER CATEGORIAS
  const startLoadCategories = useCallback(async () => {
    try {
      const useCase = new GetTicketCategoryUseCase();
      const response = await useCase.execute();
      dispatch(onLoadCategories(response.data.data));
      dispatch(
        onSetCategoryFilters({
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

  // OBTENER CATEGORIA POR ID
  const startLoadCategoryById = useCallback(async (id: number | string) => {
    try {
      const useCase = new GetTicketCategoryByIdUseCase();
      const response = await useCase.execute(id);
      dispatch(onLoadCategory(response.data)); 
      return response.data;
    } catch (err: unknown) {
      handleError(err, "No se pudo cargar la categoría");
    }
  }, [dispatch, handleError]);

  // GUARDAR CATEGORIAS
  const startSaveCategory = async (datos: TicketCategoryFormValues | FormData, id?: number | string) => {
    try {
      dispatch(onSetIsLoading(true));

      const response = id 
        ? await new UpdateTicketCategoryUseCase().execute(id, datos as TicketCategoryFormValues)
        : await new CreateNewTicketCategoryUseCase().execute(datos); 
      
      await Swal.fire({
        icon: "success",
        title: "¡Hecho!",
        text: response.message,
        timer: 1500,
        showConfirmButton: false
      });
      
      navigate("/categoria-tickets");
      return true;
    } catch (err: unknown) {
      handleError(err, id ? "Error al actualizar la categoría" : "Error al crear la categoría");
      return false;
    } finally {
      dispatch(onSetIsLoading(false));
    }
  };

  // ELIMINAR CATEGORIA
  const startDeleteCategory = async (id: number | string) => {
    try {
      dispatch(onSetIsLoading(true));
      const response   = await new DeleteTicketCategoryUseCase().execute(id)
      await Swal.fire({
        icon: "success",
        title: "¡Hecho!",
        text: response.message,
        timer: 1500,
        showConfirmButton: false
      });
      navigate("/categoria-tickets");
   } catch (err: unknown) {
      handleError(err, id ? "Error al actualizar la categoría" : "Error al crear la categoría");
      return false;
    } finally {
      dispatch(onSetIsLoading(false));
    }
  }

  // LIMPIAR COMPONENTE DE FORMULARIO CATEGORIA
  const clearSelectedCategory = useCallback(() => {
    dispatch(onClearCategory());
  }, [dispatch]);

  return {
    categories,
    category,
    isLoadingCategories,
    filtros,
    error,

    startLoadCategories,
    startSaveCategory,
    startLoadCategoryById,
    clearSelectedCategory,
    startDeleteCategory
  };
};

import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { TicketCategoryState, TicketCategory, CategoryFilter } from "../../types/ticketCategory";

const initialState: TicketCategoryState = {
  isLoadingCategories: false,
  categories: [],
  category: null,
  filtros: {},
  error: null,
};

export const ticketCategorySlice = createSlice({
  name: "ticketCategory", 
  initialState,
  reducers: {
    // Para cuando inicias cualquier proceso (Guardar, Cargar, Eliminar)
    onSetIsLoading: (state, { payload }: PayloadAction<boolean>) => {
      state.isLoadingCategories = payload;
    },

    // Cargar la lista en el estado
    onLoadCategories: (state, { payload }: PayloadAction<TicketCategory[]>) => {
      state.isLoadingCategories = false;
      state.categories = payload;
    },

    // Cargar una categoría para el formulario de edición
    onLoadCategory: (state, { payload }: PayloadAction<TicketCategory | null>) => {
      state.isLoadingCategories = false;
      state.category = payload;
    },

    // Limpiar la categoría seleccionada (Vital para que 'Crear' no herede datos de 'Editar')
    onClearCategory: (state) => {
      state.category = null;
    },

    onSetCategoryFilters: (state, { payload }: PayloadAction<CategoryFilter>) => {
      state.filtros = payload;
      state.isLoadingCategories = false;
    },

    onSetError: (state, { payload }: PayloadAction<string>) => {
      state.error = payload;
      state.isLoadingCategories = false;
    },

    onClearError: (state) => {
      state.error = null;
    },

    // Reset total al cerrar sesión
    onLogoutCategories: () => {
      return initialState;
    },
  },
});

export const {
  onSetIsLoading,
  onLoadCategories,
  onLoadCategory,
  onClearCategory,
  onSetCategoryFilters,
  onSetError,
  onClearError,
  onLogoutCategories,
} = ticketCategorySlice.actions;

export default ticketCategorySlice.reducer;
import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { TicketState, Ticket, TicketFilter,TicketComment } from "../../types/ticket";

const initialState: TicketState = {
  isLoadingTickets: false,
  tickets: [],
  ticket: null,
  comments: [],
  filtros: {},
  error: null,
};

export const ticketCategorySlice = createSlice({
  name: "ticket", 
  initialState,
  reducers: {
    onSetIsLoading: (state, { payload }: PayloadAction<boolean>) => {
      state.isLoadingTickets = payload;
    },

    onLoadTickets: (state, { payload }: PayloadAction<Ticket[]>) => {
      state.isLoadingTickets = false;
      state.tickets = payload;
    },

    onLoadTicket: (state, { payload }: PayloadAction<Ticket | null>) => {
      state.isLoadingTickets = false;
      state.ticket = payload;
    },

    onLoadComments: (state, { payload }: PayloadAction<TicketComment[]>) => {
      state.isLoadingTickets = false;
      state.comments = payload;
    },

    onClearTicket: (state) => {
      state.ticket = null;
    },

    onSetTicketsFilters: (state, { payload }: PayloadAction<TicketFilter>) => {
      state.filtros = payload;
      state.isLoadingTickets = false;
    },

    onSetError: (state, { payload }: PayloadAction<string>) => {
      state.error = payload;
      state.isLoadingTickets = false;
    },

    onClearError: (state) => {
      state.error = null;
    },

    onLogoutTickets: () => {
      return initialState;
    },
  },
});

export const {
  onSetIsLoading,
  onLogoutTickets,
  onLoadTicket,
  onLoadComments,
  onClearTicket,
  onSetTicketsFilters,
  onSetError,
  onClearError,
  onLoadTickets,
} = ticketCategorySlice.actions;

export default ticketCategorySlice.reducer;
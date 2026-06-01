import type { Ticket } from './Ticket';

export interface TicketListResponse {
  status: string;
  message: string;
  data: {
    total: number;
    page: number;
    totalPages: number;
    data: Ticket[];
  };
}

export interface TicketResponse {
  status: string;
  message: string;
  data: Ticket; 
}
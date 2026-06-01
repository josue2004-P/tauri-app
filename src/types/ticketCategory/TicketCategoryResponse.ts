import type { TicketCategory } from './TicketCategory';

export interface TicketCategoryListResponse {
  status: string;
  message: string;
  data: {
    total: number;
    page: number;
    totalPages: number;
    data: TicketCategory[];
  };
}

export interface TicketCategoryResponse {
  status: string;
  message: string;
  data: TicketCategory; 
}
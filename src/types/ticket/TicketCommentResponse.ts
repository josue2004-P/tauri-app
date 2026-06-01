import {type  TicketComment } from './TicketComment';

export interface TicketCommentResponse {
  status: string;
  message: string;
  data: TicketComment[]; 
}
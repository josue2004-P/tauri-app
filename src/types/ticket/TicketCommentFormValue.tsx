export interface TicketCommentFormValue {
  mensaje: string;
  ticketId: number | string;
  esInterno: boolean; 
  evidencias?: File[];
}
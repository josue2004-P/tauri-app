import type { TicketPriorityType } from "./Ticket";
export interface TicketFormValues {
  asunto: string;
  descripcion: string;
  prioridad: TicketPriorityType;
  categoriaId: number | string; 
  evidencias: File[];
}
import { getCommentsByTicketUseCase } from "../../services/ticketService";
import type { TicketCommentResponse } from "../../types/ticket";

export class GetCommentsByTicketUseCase {
  async execute(id: number | string): Promise<TicketCommentResponse> {
    if (!id) throw new Error("El ID del ticket es obligatorio");
    
    return await getCommentsByTicketUseCase(id); 
  }
}
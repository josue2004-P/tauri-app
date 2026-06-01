import { getTicketByIdUseCase } from "../../services/ticketService";
import type { TicketResponse } from "../../types/ticket";

export class GetTicketByIdUseCase {
  async execute(id: number | string): Promise<TicketResponse> {
    if (!id) throw new Error("El ID del ticket es obligatorio");
    
    return await getTicketByIdUseCase(id); 
  }
}
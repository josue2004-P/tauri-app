import { updateTicketStatusUseCase } from "../../services/ticketService";
import type { 
  TicketResponse 
} from "../../types/ticket";

export class UpdateTicketStatusUseCase {
  async execute(
    id: number | string, 
    status: string
  ): Promise<TicketResponse> {
    
    if (!id) throw new Error("Se requiere el ID para actualizar");

    return await updateTicketStatusUseCase(id, status);
  }
}
import { deleteTicketRequest } from "../../services/ticketService";
import type { 
  TicketResponse 
} from "../../types/ticket";

export class DeleteTicketUseCase {
  async execute(
    id: number | string, 
  ): Promise<TicketResponse> {
    
    if (!id) throw new Error("Se requiere el ID para actualizar");

    return await deleteTicketRequest(id);
  }
}
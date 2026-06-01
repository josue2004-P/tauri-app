import { updateTicketRequest } from "../../services/ticketService";
import type { 
  TicketFormValues, 
  TicketResponse 
} from "../../types/ticket";

export class UpdateTicketUseCase {
  async execute(
    id: number | string, 
    datos: TicketFormValues | FormData
  ): Promise<TicketResponse> {
    
    if (!id) throw new Error("Se requiere el ID para actualizar");

    return await updateTicketRequest(id, datos);
  }
}
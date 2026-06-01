import { updateTicketCategoryRequest } from "../../services/ticketCategoryService";
import type { 
  TicketCategoryFormValues, 
  TicketCategoryResponse 
} from "../../types/ticketCategory";

export class UpdateTicketCategoryUseCase {
  async execute(
    id: number | string, 
    datos: TicketCategoryFormValues | FormData
  ): Promise<TicketCategoryResponse> {
    
    if (!id) throw new Error("Se requiere el ID para actualizar");

    return await updateTicketCategoryRequest(id, datos);
  }
}
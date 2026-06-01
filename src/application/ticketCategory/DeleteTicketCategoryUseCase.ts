import { deleteTicketCategoryRequest } from "../../services/ticketCategoryService";
import type { 
  TicketCategoryResponse 
} from "../../types/ticketCategory";

export class DeleteTicketCategoryUseCase {
  async execute(
    id: number | string, 
  ): Promise<TicketCategoryResponse> {
    
    if (!id) throw new Error("Se requiere el ID para actualizar");

    return await deleteTicketCategoryRequest(id);
  }
}
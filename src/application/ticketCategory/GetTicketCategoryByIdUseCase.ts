import { getTicketCategoryByIdUseCase } from "../../services/ticketCategoryService";
import type { TicketCategoryResponse } from "../../types/ticketCategory";

export class GetTicketCategoryByIdUseCase {
  async execute(id: number | string): Promise<TicketCategoryResponse> {
    if (!id) throw new Error("El ID de la categoría es obligatorio");
    
    return await getTicketCategoryByIdUseCase(id); 
  }
}
import { createNewTicketCategoryUseCase } from "../../services/ticketCategoryService";
import type { TicketCategoryFormValues, TicketCategoryListResponse } from "../../types/ticketCategory";

export class CreateNewTicketCategoryUseCase {
  async execute(datos: TicketCategoryFormValues | FormData): Promise<TicketCategoryListResponse> {
    return await createNewTicketCategoryUseCase(datos);
  }
}

import { getTicketCategoryRequest } from "../../services/ticketCategoryService";
import type { TicketCategoryListResponse } from "../../types/ticketCategory";

export class GetTicketCategoryUseCase {
  async execute(): Promise<TicketCategoryListResponse> {
    return await getTicketCategoryRequest(); 
  }
}

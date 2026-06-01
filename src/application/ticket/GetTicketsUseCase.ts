import { getTicketsUseCase } from "../../services/ticketService";
import type { TicketListResponse } from "../../types/ticket";

export class GetTicketsUseCase {
  async execute(): Promise<TicketListResponse> {
    return await getTicketsUseCase(); 
  }
}

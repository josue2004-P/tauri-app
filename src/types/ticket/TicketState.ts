import type { Ticket } from "./Ticket";
import type { TicketFilter } from "./TicketFilter";
import type { TicketComment } from "./TicketComment";

export interface TicketState {
  isLoadingTickets: boolean;
  tickets: Ticket[];
  ticket: Ticket | null;
  comments: TicketComment[];
  filtros: TicketFilter;
  error: string | null;
}

import type { TicketCategory } from "./TicketCategory";
import type { CategoryFilter } from "./CategoryFilter";

export interface TicketCategoryState {
  isLoadingCategories: boolean;
  categories: TicketCategory[];
  category: TicketCategory | null;
  filtros: CategoryFilter;
  error: string | null;
}

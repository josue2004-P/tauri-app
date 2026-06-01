import ComponentCard from "../../../../components/common/ComponentCard";

interface TicketConversationStatesProps {
  isLoading: boolean;
  hasTicket: boolean;
}

export function TicketConversationStates({ isLoading, hasTicket }: TicketConversationStatesProps) {
  // 1. Estado de Carga (Skeleton Loader)
  if (isLoading) {
    return (
      <ComponentCard title="Cargando ticket..." desc="Por favor espera un momento">
        <div className="animate-pulse space-y-6 py-4">
          <div className="flex gap-4">
            <div className="h-10 w-10 rounded-full bg-slate-200 dark:bg-slate-700 shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/4" />
              <div className="h-20 bg-slate-200 dark:bg-slate-700 rounded-xl" />
            </div>
          </div>
          <div className="h-32 bg-slate-100 dark:bg-slate-800/50 rounded-xl" />
        </div>
      </ComponentCard>
    );
  }

  // 2. Estado de Error / No encontrado
  if (!hasTicket) {
    return (
      <ComponentCard title="Ticket no encontrado" desc="El ticket solicitado no existe o no tienes acceso.">
        <p className="text-sm text-slate-500">No se pudo cargar la información del caso.</p>
      </ComponentCard>
    );
  }

  return null;
}
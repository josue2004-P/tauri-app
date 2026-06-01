import ComponentCard from "../../../../components/common/ComponentCard";
import type { Ticket } from "../../../../types/ticket";
interface TicketSidebarDetailsProps {
  ticket: Ticket | null;
}

// Declaración limpia como función nativa de JavaScript/TypeScript
export function TicketSidebarDetails({ ticket }: TicketSidebarDetailsProps) {
  const priorityStyles: Record<string, string> = {
    baja: "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded-md",
    media: "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 px-2 py-0.5 rounded-md",
    alta: "text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/10 px-2 py-0.5 rounded-md",
    critica: "text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/10 px-2 py-0.5 rounded-md",
  };

  return (
    <ComponentCard title="Detalles del Caso">
      <div className="space-y-4 text-sm font-medium">
        <div className="flex justify-between items-center">
          <span className="text-slate-500 dark:text-slate-400">Categoría</span>
          <span className="text-slate-800 dark:text-white">
            {ticket?.categoria?.nombre || 'General'}
          </span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-slate-500 dark:text-slate-400">Prioridad</span>
          <span className={`text-xs font-bold uppercase tracking-wide ${priorityStyles[ticket?.prioridad || 'media']}`}>
            {ticket?.prioridad || 'media'}
          </span>
        </div>

        <div className="border-t border-slate-100 dark:border-slate-800 pt-4">
          <div className="flex justify-between items-center">
            <span className="text-slate-500 dark:text-slate-400">Sistema</span>
            <span className="text-sm font-bold text-brand-500">
              {ticket?.sistemaOrigen === 'S1' ? 'INDHECA' : 'TIBERNAL'}
            </span>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-slate-500 dark:text-slate-400">Asignado a</span>
          <span className="text-slate-800 dark:text-white">
            Admin Local
          </span>
        </div>
      </div>
    </ComponentCard>
  );
}
import Checkbox from "../../../../components/form/input/Checkbox";
import type { TicketStatusType } from "../../../../types/ticket";

interface TicketStatusSelectorProps {
  statusSelected: TicketStatusType;
  handleStatusChange: (status: TicketStatusType) => void;
  user: {
    id: number | string;
    perfiles?: Array<{ id: number; nombre: string }>;
  } | null;
  ticketUsuarioId: number | string;
}

const STATUS_OPTIONS = [
  { 
    id: 'en_progreso', 
    label: 'En Progreso', 
    elementId: 'status-en-progreso', 
    allowedRoles: ['administrador', 'desarrollador'],
    canTransition: (currentStatus: TicketStatusType, ) => currentStatus !== 'resuelto' && currentStatus !== 'cerrado'
  },
  { 
    id: 'resuelto', 
    label: 'Resuelto', 
    elementId: 'status-resuelto', 
    allowedRoles: ['administrador', 'usuario'],
    canTransition: (currentStatus: TicketStatusType, isOwner: boolean) => currentStatus === 'en_progreso' && isOwner
  },
  { 
    id: 'cerrado', 
    label: 'Cerrado/Completado', 
    elementId: 'status-cerrado', 
    allowedRoles: ['administrador', 'developer'],
    canTransition: (currentStatus: TicketStatusType,) => currentStatus === 'resuelto'
  },
];

export function TicketStatusSelector({ 
  statusSelected, 
  handleStatusChange, 
  user, 
  ticketUsuarioId 
}: TicketStatusSelectorProps) {
  
  const isOwner = String(user?.id) === String(ticketUsuarioId);

  const disponibles = STATUS_OPTIONS.filter(option => {
    if (!user?.perfiles) return false;

    const hasRolePermission = user.perfiles.some(perfil => {
      const nombreEnMinusculas = perfil.nombre?.toLowerCase();
      return option.allowedRoles.includes(nombreEnMinusculas);
    });

    const isAdmin = user.perfiles.some(p => p.nombre?.toLowerCase() === 'adminis');
    if (isAdmin && hasRolePermission) return true;

    if (!hasRolePermission) return false;

    return option.canTransition(statusSelected, isOwner);
  });

  if (statusSelected === 'cerrado' || disponibles.length === 0) {
    const estadoActualLabel = STATUS_OPTIONS.find(opt => opt.id === statusSelected)?.label || statusSelected;
    
    return (
      <div className="flex items-center gap-6 pt-4 border-t border-slate-100 dark:border-slate-800 mt-4">
        <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
          Estado:
        </span>
        <span className="text-sm font-medium text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/50 px-3 py-1 rounded-md">
          {estadoActualLabel}
        </span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-6 pt-4 border-t border-slate-100 dark:border-slate-800 mt-4">
      <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
        Estado:
      </span>
      <div className="flex flex-wrap gap-5">
        {disponibles.map(option => (
          <Checkbox
            key={option.id}
            id={option.elementId}
            label={option.label}
            checked={statusSelected === option.id}
            onChange={(checked) => checked && handleStatusChange(option.id as TicketStatusType)}
          />
        ))}
      </div>
    </div>
  );
}
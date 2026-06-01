import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import type { Column } from "../../../components/tables/ReusableTable";
import type { Ticket } from "../../../types/ticket";
import type { User } from "../../../types/auth/User";

interface ColumnsConfigProps {
  user: User | null; 
  startDeleteTicket: (id: number | string) => Promise<boolean | undefined | unknown>; 
  startLoadTickets: () => Promise<Ticket[] | undefined | unknown>;
}

export const getTicketTableColumns = ({
  user,
  startDeleteTicket,
  startLoadTickets,
}: ColumnsConfigProps): Column<Ticket>[] => [
    {
      header: "ID",
      key: "id",
      render: (item) => (
        <span className="font-semibold text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md text-xs">
          #{item.id}
        </span>
      )
    },
    {
      header: "Asunto",
      key: "asunto",
      render: (item) => (
        <div 
          className="max-w-[220px]  font-medium text-slate-700 dark:text-slate-200" 
          title={item.asunto}
        >
          {item.asunto}
        </div>
      )
    },
    {
      header: "Categoría",
      key: "categoria",
      render: (item) => (
        <span className="text-slate-600 dark:text-slate-400 text-sm font-medium">
          {item.categoria?.nombre || 'Sin categoría'}
        </span>
      )
    },
    {
      header: "Prioridad",
      key: "prioridad",
      render: (item) => {
        const priorityStyles = {
          alta: "bg-rose-100 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400 border border-rose-200 dark:border-rose-500/20",
          media: "bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20",
          baja: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20",
        };
        return (
          <span className={`inline-flex items-center rounded-full py-0.5 px-2.5 text-xs font-semibold capitalize ${priorityStyles[item.prioridad as keyof typeof priorityStyles] || "bg-slate-100 text-slate-700"}`}>
            {item.prioridad}
          </span>
        );
      }
    },
    {
      header: "Estado",
      key: "estado",
      render: (item) => {
        const statusStyles = {
          abierto: "bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20",
          en_progreso: "bg-indigo-100 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/20",
          resuelto: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20",
          cerrado: "bg-slate-100 text-slate-600 dark:bg-slate-500/10 dark:text-slate-400 border border-slate-200 dark:border-slate-500/20",
        };
        return (
          <span className={`inline-flex items-center rounded-md py-0.5 px-2 text-xs font-semibold capitalize ${statusStyles[item.estado as keyof typeof statusStyles] || "bg-slate-100 text-slate-700"}`}>
            {item.estado.replace('_', ' ')}
          </span>
        );
      }
    },
    {
      header: "Fecha",
      key: "fechaCreacion",
      render: (item) => (
        <span className="text-sm text-slate-500 dark:text-slate-400 font-medium whitespace-nowrap">
          {new Date(item.fechaCreacion).toLocaleString('es-MX', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false 
          }).replace('.', '') }
        </span>
      )
    },
    {
      header: "Acciones",
      key: "acciones",
      render: (item) => {
        const handleDelete = async (id: number, asunto: string) => {
          const resultado = await Swal.fire({
            title: '¿Estás seguro?',
            text: `Vas a eliminar el ticket con asunto "${asunto}"`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',    
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar',
            customClass: {
              popup: 'dark:bg-slate-800 dark:text-white' 
            }
          });

          if (resultado.isConfirmed && startDeleteTicket) {
            try {
              await startDeleteTicket(id);
              await startLoadTickets();
            } catch (error) {
              console.error('Error al eliminar:', error);
              Swal.fire({
                title: 'Error',
                text: 'Hubo un problema al intentar eliminar el ticket.',
                icon: 'error'
              });
            }
          }
        };

        return (
          <div className="flex items-center gap-3.5">
            <Link
              to={`/tickets/editar/${item.id}`}
              className="text-sm font-semibold text-brand-500 hover:text-brand-600 transition-colors"
            >
              Editar
            </Link>

            {(() => {
              const isAdmin = user?.perfiles?.some(
                (perfil) => perfil.nombre?.toLowerCase() === 'administrador'
              );

              if (isAdmin) {
                return (
                  <button
                    onClick={() => handleDelete(item.id, item.asunto)}
                    className="text-sm font-semibold text-rose-500 hover:text-rose-600 transition-colors cursor-pointer bg-transparent border-none p-0"
                    title="Eliminar ticket"
                  >
                    Eliminar
                  </button>
                );
              }

              return null;
            })()}
          </div>
        );
      },
    },
  ];
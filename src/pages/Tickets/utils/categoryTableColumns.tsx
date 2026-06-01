import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import type { Column } from "../../../components/tables/ReusableTable";
import type { TicketCategory } from "../../../types/ticketCategory";

interface CategoryColumnsConfigProps {
  startDeleteCategory: (id: number) => Promise<boolean | undefined | unknown>;
  startLoadCategories: () => Promise<TicketCategory[] | undefined | unknown>;
}

export const getCategoryTableColumns = ({
  startDeleteCategory,
  startLoadCategories,
}: CategoryColumnsConfigProps): Column<TicketCategory>[] => [
  { 
    header: "ID", 
    key: "id",
    render: (item) => <span className="font-semibold text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md text-xs">#{item.id}</span>
  },
  { header: "Nombre", key: "nombre" },
  { header: "Descripción", key: "descripcion" },
  { 
    header: "SLA", 
    key: "slaHoras",
    render: (item) => <span className="text-slate-600 dark:text-slate-400 text-sm font-medium">{item.slaHoras}h</span>
  },
  { 
    header: "Estado", 
    key: "activo",
    render: (item) => (
      <span className={`inline-flex rounded-full bg-opacity-10 py-1 px-3 text-sm font-medium ${
        item.activo === 1 ? "bg-success text-success" : "bg-danger text-danger"
      }`}>
        {item.activo === 1 ? "Activo" : "Inactivo"}
      </span>
    )
  },
  {
    header: "Acciones",
    key: "acciones",
    render: (item) => {
      const handleDelete = async (id: number, nombre: string) => {
        const resultado = await Swal.fire({
          title: '¿Estás seguro?',
          text: `Vas a eliminar la categoría "${nombre}"`,
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',    
          confirmButtonText: 'Sí, eliminar',
          cancelButtonText: 'Cancelar',
          customClass: {
            popup: 'dark:bg-gray-800 dark:text-white' 
          }
        });

        if (resultado.isConfirmed) {
          try {
            await startDeleteCategory(id);
            await startLoadCategories();
            
            Swal.fire({
              title: '¡Eliminado!',
              text: 'La categoría ha sido eliminada con éxito.',
              icon: 'success',
              timer: 1500,
              showConfirmButton: false
            });
          } catch (error) {
            console.error('Error al eliminar:', error);
            Swal.fire({
              title: 'Error',
              text: 'Hubo un problema al intentar eliminar la categoría.',
              icon: 'error'
            });
          }
        }
      };

      return (
        <div className="flex items-center gap-4">
          <Link
            to={`/categoria-tickets/editar/${item.id}`}
            className="text-blue-500 hover:text-blue-700 font-medium transition-colors"
          >
            Editar
          </Link>

          <button
            onClick={() => handleDelete(item.id, item.nombre)}
            className="text-red-500 hover:text-red-700 font-medium transition-colors cursor-pointer bg-transparent border-none p-0"
            title="Eliminar categoría"
          >
            Eliminar
          </button>
        </div>
      );
    },
  },
];
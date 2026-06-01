import { useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFolder } from "@fortawesome/free-solid-svg-icons";

import ReusableTable from "../../components/tables/ReusableTable";
import PageMeta from "../../components/common/PageMeta";
import { Breadcrumb } from "../../components/common/Breadcrumb";
import { CategoryTableLoading } from './components/Categories/CategoryTableLoading';

import { useTicketCategory } from "../../hooks/useTicketCategory";

import { getCategoryTableColumns } from "./utils/categoryTableColumns";

export default function CategoriaTicketsPage() {
  const { 
    categories, 
    isLoadingCategories, 
    startLoadCategories, 
    startDeleteCategory,
    filtros 
  } = useTicketCategory();

  useEffect(() => {
    startLoadCategories();
  }, [startLoadCategories]);

  const breadcrumbStructure = [
    { name: "Inicio", path: "/" },
    { name: "Categorías Ticket" }   
  ];

  const columns = getCategoryTableColumns({ startDeleteCategory, startLoadCategories });

  return (
    <>
      <PageMeta
        title="Categorías Tickets"
        description="Administración de Categorías de los tickets"
      />

      <Breadcrumb
        title="Categorías de Tickets"
        description="Gestione los catálogos globales de clasificación de incidencias y sus tiempos de respuesta (SLA)."
        icon={<FontAwesomeIcon icon={faFolder} className="size-5" />}
        routes={breadcrumbStructure}
      />

      {isLoadingCategories ? (
        <CategoryTableLoading />
      ) : (
        <ReusableTable
          title="Listado de Categorías"
          data={categories}
          columns={columns}
          rowKey="id"
          totalResults={filtros.total}
          createRoute="/categoria-tickets/nuevo" 
          createText="Nueva Categoría"
        />
      )}
    </>
  );
}
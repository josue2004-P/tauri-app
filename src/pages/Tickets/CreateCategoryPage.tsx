import { useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFolderPlus } from "@fortawesome/free-solid-svg-icons";

import PageMeta from "../../components/common/PageMeta";
import ComponentCard from "../../components/common/ComponentCard";
import { Breadcrumb } from "../../components/common/Breadcrumb";
import CategoryForm from "./components/CategoryForm";

import { useTicketCategory } from "../../hooks/useTicketCategory";

import type { TicketCategoryFormValues } from "../../types/ticketCategory";


export default function CreateCategoryPage() {
  const { 
    startSaveCategory, 
    isLoadingCategories, 
    clearSelectedCategory 
  } = useTicketCategory();

  useEffect(() => {
    clearSelectedCategory();
  }, [clearSelectedCategory]);

  const handleCreate = async (formData: TicketCategoryFormValues) => {
    await startSaveCategory(formData);
  };

  const breadcrumbStructure = [
    { name: "Inicio", path: "/" },
    { name: "Categorías Ticket", path: "/categoria-tickets" },
    { name: "Crear Categoría" }, 
  ];

  return (
    <>
      <PageMeta
        title="Nueva Categoría | Soporte"
        description="Panel para crear nuevas categorías de tickets"
      />

      <Breadcrumb 
        title="Nueva Categoría" 
        description="Configure los niveles, nombres y tiempos de SLA para la clasificación de tickets de soporte."
        icon={<FontAwesomeIcon icon={faFolderPlus} className="size-5" />}
        routes={breadcrumbStructure} 
      />

      <div className="max-w-2xl">
        <ComponentCard
          title="Crear Nueva Categoría"
          className="shadow-sm" 
        >
          <CategoryForm 
            onSubmit={handleCreate} 
            isLoading={isLoadingCategories} 
          />
        </ComponentCard>
      </div>
    </>
  );
}
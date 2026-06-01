import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilePen } from "@fortawesome/free-solid-svg-icons";

import PageMeta from "../../components/common/PageMeta";
import CategoryForm from "./components/CategoryForm";
import ComponentCard from "../../components/common/ComponentCard";
import { Breadcrumb } from "../../components/common/Breadcrumb";

import { useTicketCategory } from "../../hooks/useTicketCategory";

import type { TicketCategoryFormValues } from "../../types/ticketCategory";

export default function EditCategoryPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const { 
    category, 
    startLoadCategoryById, 
    startSaveCategory, 
    isLoadingCategories,
    clearSelectedCategory 
  } = useTicketCategory();

  useEffect(() => {
    if (id) {
      startLoadCategoryById(id);
    }

    return () => {
      clearSelectedCategory();
    };
  }, [id, startLoadCategoryById, clearSelectedCategory]);

  const handleUpdate = async (formData: TicketCategoryFormValues) => {
    if (id) {
      const success = await startSaveCategory(formData, id);
      if (success) {
        navigate("/categoria-tickets");
      }
    }
  };

  const breadcrumbStructure = [
    { name: "Inicio", path: "/" },
    { name: "Categorías Ticket", path: "/categoria-tickets" },
    { name: "Editar Categoría" }, 
  ];

  return (
    <>
      <PageMeta
        title="Editar Categoría | Soporte"
        description="Panel para editar categorías de tickets existentes"
      />

      <Breadcrumb 
          title="Nueva Categoría" 
          description="Configure los niveles, nombres y tiempos de SLA para la clasificación de tickets de soporte."
          icon={<FontAwesomeIcon icon={faFilePen} className="size-5" />}
          routes={breadcrumbStructure} 
        />

      <div className="max-w-2xl">
        <ComponentCard
          title="Editar Categoría"
          className="shadow-sm" 
        >
          <CategoryForm 
            initialData={category} 
            onSubmit={handleUpdate} 
            isLoading={isLoadingCategories} 
          />
        </ComponentCard>
      </div>
    </>
  );
}
import { useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSquarePlus } from "@fortawesome/free-solid-svg-icons";

import PageMeta from "../../components/common/PageMeta";
import ComponentCard from "../../components/common/ComponentCard";
import { Breadcrumb } from "../../components/common/Breadcrumb";

import TicketForm from "./components/TicketForm";

import { useTicket } from "../../hooks/useTicket";
import { useTicketCategory } from "../../hooks/useTicketCategory";

import type { TicketFormValues } from "../../types/ticket";

export default function CreateTicketPage() {
  const { startSaveTicket, isLoadingTickets } = useTicket();
  
  const { categories, isLoadingCategories, startLoadCategories } = useTicketCategory();

  useEffect(() => {
    startLoadCategories();
  }, [startLoadCategories]);

  const handleFormSubmit = async (values: TicketFormValues & { evidencias?: File[] }) => {
    await startSaveTicket(values);
  };

  const breadcrumbStructure = [
    { name: "Inicio", path: "/" },
    { name: "Tickets", path: "/tickets" }, 
    { name: "Nuevo Ticket" },
  ];

  return (
    <>
      <PageMeta
        title="Crear Nuevo Ticket"
        description="Registro de nuevos requerimientos y fallos técnicos"
      />

      <Breadcrumb 
        title="Crear Nuevo Ticket" 
        description="Registre un nuevo ticket de soporte detallando el asunto, la categoría correspondiente y el nivel de prioridad para su asignación."
        icon={<FontAwesomeIcon icon={faSquarePlus} className="size-5" />}
        routes={breadcrumbStructure} 
      />

      <div className="max-w-2xl">
        <ComponentCard
          title="Crear Nuevo Ticket"
          className="shadow-sm" 
        >
          {isLoadingCategories ? (
            <div className="flex flex-col items-center justify-center py-10">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand-500 border-t-transparent"></div>
              <p className="mt-4 text-gray-500">Cargando configuración...</p>
            </div>
          ) : (
            <TicketForm 
              onSubmit={handleFormSubmit} 
              categories={categories} 
              isLoading={isLoadingTickets} 
            />
          )}
        </ComponentCard>
      </div>
    </>
  );
}
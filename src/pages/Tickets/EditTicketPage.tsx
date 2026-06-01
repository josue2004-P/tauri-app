import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilePen } from "@fortawesome/free-solid-svg-icons";

import PageMeta from "../../components/common/PageMeta";
import { Breadcrumb } from "../../components/common/Breadcrumb";

import { TicketConversation } from "./components/tickets/TicketConversation";
import { TicketSidebarDetails } from "./components/tickets/TicketSidebarDetails";
import { TicketDetailLoading } from "./components/tickets/TicketDetailLoading";

import { useTicket } from "../../hooks/useTicket";

export default function EditTicketPage() {
  const { id } = useParams<{ id: string }>();
  const { ticket, startLoadTicketById, isLoadingTickets } = useTicket();

  useEffect(() => {
    if (id) {
      startLoadTicketById(Number(id));
    }
  }, [id, startLoadTicketById]);

  if (isLoadingTickets) {
    return <TicketDetailLoading />;
  }

  const breadcrumbStructure = [
    { name: "Inicio", path: "/" },
    { name: "Tickets", path: "/tickets" },
    { name: `Ticket #${id}` } 
  ];

  return (
    <>
      <PageMeta
        title={`Ticket #${id}`}
        description="Gestión y actualización de requerimientos técnicos"
      />

      <Breadcrumb 
        title={`Atender Ticket: #${id}`}
        description="Revise los comentarios iniciales del usuario, gestione el estado de atención y añada notas de resolución."
        icon={<FontAwesomeIcon icon={faFilePen} className="size-5" />}
        routes={breadcrumbStructure}
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        
        {/* COLUMNA IZQUIERDA: Conversación e historial (Ocupa 8/12) */}
        <div className="lg:col-span-8">
          <TicketConversation 
            ticket={ticket} 
            isLoading={isLoadingTickets} 
          />
        </div>

        {/* COLUMNA DERECHA: Metadatos y detalles del caso (Ocupa 4/12) */}
        <div className="lg:col-span-4">
          <TicketSidebarDetails 
            ticket={ticket} 
          />
        </div>

      </div>
    </>
  );
}
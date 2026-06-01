import { useEffect } from "react";
import { faTicket } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { Breadcrumb } from "../../components/common/Breadcrumb";
import PageMeta from "../../components/common/PageMeta";
import ReusableTable from "../../components/tables/ReusableTable";
import { TicketTableLoading } from "./components/tickets/TicketTableLoading";

import { useAuth } from "../../hooks/useAuth";
import { useTicket } from "../../hooks/useTicket";

import { getTicketTableColumns } from "./utils/ticketTableColumns";

export default function TicketsPage() {
  const { tickets, isLoadingTickets, startLoadTickets, startDeleteTicket,filtros } = useTicket();
  const { user } = useAuth();

  useEffect(() => {
    startLoadTickets();
  }, [startLoadTickets]);

  const breadcrumbStructure = [
    { name: "Inicio", path: "/" },
    { name: "Categorías Ticket" }   
  ];

  const columns = getTicketTableColumns({ user, startDeleteTicket, startLoadTickets });
  
  return (
    <>
      <PageMeta 
        title="Administración de Tickets" 
        description="Gestión integral de tickets para Indheca y Tibernal" 
      />

      <Breadcrumb 
        title="Gestión de Tickets" 
        description="Monitoree, asigne y resuelva las incidencias reportadas por los usuarios dentro de los tiempos de SLA establecidos."
        icon={<FontAwesomeIcon icon={faTicket} className="size-5" />}
        routes={breadcrumbStructure} 
      />

      {isLoadingTickets ? (
        <TicketTableLoading />
      ) : (
        <ReusableTable
          title="Todos los Tickets"
          data={tickets}
          columns={columns}
          rowKey="id"
          totalResults={filtros.total}
          createRoute="/tickets/nuevo"
          createText="Crear Ticket"
        />
      )}
    </>
  );
}
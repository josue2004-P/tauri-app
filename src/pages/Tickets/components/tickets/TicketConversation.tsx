import { useEffect, useState } from "react";
import Swal from "sweetalert2";

import ComponentCard from "../../../../components/common/ComponentCard";

import { TicketOriginalMessage } from "./TicketOriginalMessage";
import { TicketCommentFeed } from "./TicketCommentFeed";
import { TicketResponseForm } from "./TicketResponseForm";
import { TicketConversationStates } from "./TicketConversationStates";
import { TicketStatusSelector } from "./TicketStatusSelector";

import { useTicket } from "../../../../hooks/useTicket";
import { useAuth } from "../../../../hooks/useAuth"; 

import type { 
  Ticket, 
  TicketStatusType, 
  TicketCommentFormValue 
} from "../../../../types/ticket";

interface TicketConversationProps {
  ticket: Ticket | null;
  isLoading?: boolean;
}

export function TicketConversation({ ticket, isLoading = false }: TicketConversationProps) {
  const { comments, startLoadComments, startUpdateStatusTicket, startAddComment } = useTicket();
  const { user } = useAuth();

  const [statusSelected, setStatusSelected] = useState<TicketStatusType>((ticket?.estado) || 'abierto');

  const ticketId = ticket?.id;

  useEffect(() => {
    if (ticket?.estado) {
      setStatusSelected(ticket.estado);
    }
  }, [ticket?.estado]);

  useEffect(() => {
    if (ticketId) {
      startLoadComments(Number(ticketId));
    }
  }, [ticketId, startLoadComments]);

  const handleStatusChange = (status: TicketStatusType) => {
    startUpdateStatusTicket(status, ticketId);
  }; 

  const handleAddComment = async (textoMensaje: string, archivos: File[]) => {
    if (!ticket?.id) {
      await Swal.fire({
        icon: "warning",
        title: "¡Atención!",
        text: "No se puede enviar el comentario porque el identificador del ticket no es válido o se ha perdido la sesión.",
        confirmButtonColor: "#3085d6",
        confirmButtonText: "Entendido"
      });
      return;
    }

    const datos: TicketCommentFormValue = {
      mensaje: textoMensaje,
      ticketId: ticket.id,
      esInterno: false,
      evidencias: archivos 
    };

    await startAddComment(datos);
  };

 if (isLoading || !ticket) {
    return <TicketConversationStates isLoading={isLoading} hasTicket={!!ticket} />;
  }

  return (
    <ComponentCard 
      title={`Ticket #${ticket.id} - ${ticket.asunto || ""}`}
      desc={`Creado el ${
        ticket.fechaCreacion 
          ? new Date(ticket.fechaCreacion).toLocaleString("es-MX", {
              day: "2-digit",
              month: "short",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
              hour12: false
            }).replace(".", "")
          : "---"
      }`}
    >
      {/* =========================================================================
          MENSAJE ORIGINAL DEL TICKET
          ========================================================================= */}
      <TicketOriginalMessage 
        usuarioId={ticket.usuarioId} 
        descripcion={ticket.descripcion} 
        evidencias={ticket.evidencias}
      />

      {/* =========================================================================
          HILO DE COMENTARIOS / RESPUESTAS (FEED)
          ========================================================================= */}
      <TicketCommentFeed 
        comments={comments} 
        currentUserId={user?.id} 
      />

      {/* =========================================================================
          CAJA DE RESPUESTA RAPIDA
          ========================================================================= */}
      <TicketResponseForm onSubmitComment={handleAddComment} />

      {/* =========================================================================
          SELECTOR DE ESTADOS DINÁMICO
          ========================================================================= */}
      <TicketStatusSelector 
        statusSelected={statusSelected}
        handleStatusChange={handleStatusChange}
        user={user}
        ticketUsuarioId={ticket.usuarioId}
      />

    </ComponentCard>
  );
}
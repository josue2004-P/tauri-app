import { addCommentByTicketUseCase } from "../../services/ticketService";
import type { AddTicketCommentResponse, TicketCommentFormValue } from "../../types/ticket";

export class AddCommentByTicketUseCase {
  async execute(datos: TicketCommentFormValue): Promise<AddTicketCommentResponse> {
    
    const formData = new FormData();
    formData.append('mensaje', datos.mensaje.trim());
    formData.append('ticketId', String(datos.ticketId));
    
    if (datos.esInterno !== undefined) {
      formData.append('esInterno', String(datos.esInterno));
    }

    if (datos.evidencias && datos.evidencias.length > 0) {
      datos.evidencias.forEach((archivo) => {
        formData.append('evidencias', archivo); 
      });
    }
    
    return await addCommentByTicketUseCase(formData); 
  }
}
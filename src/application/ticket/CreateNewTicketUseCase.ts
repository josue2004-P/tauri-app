import { createNewTicketUseCase } from "../../services/ticketService";
import type { TicketFormValues, TicketResponse } from "../../types/ticket";

export class CreateNewTicketUseCase {
  async execute(datos: TicketFormValues & { evidencias?: File[] }): Promise<TicketResponse> {
    
    const formData = new FormData();
    formData.append("asunto", datos.asunto.trim());
    formData.append("descripcion", datos.descripcion.trim());
    formData.append("categoriaId", String(datos.categoriaId));
    formData.append("prioridad", datos.prioridad);

    if (datos.evidencias && datos.evidencias.length > 0) {
      datos.evidencias.forEach((file) => {
        formData.append("evidencias", file); 
      });
    }

    return await createNewTicketUseCase(formData);
  }
}
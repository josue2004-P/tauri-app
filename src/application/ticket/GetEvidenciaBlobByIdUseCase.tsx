import { getEvidenciaBlobByIdUseCase } from "../../services/ticketService";

export class GetEvidenciaBlobByIdUseCase {
  /**
   * Ejecuta la descarga de un archivo adjunto en formato binario puro (Blob)
   * @param id ID del registro de la evidencia en la base de datos
   * @returns El binario (Blob) listo para procesar en la interfaz
   */
  async execute(id: number | string): Promise<Blob> {
    if (!id) {
      throw new Error("El ID de la evidencia es obligatorio para su descarga");
    }
    
    return await getEvidenciaBlobByIdUseCase(id); 
  }
}
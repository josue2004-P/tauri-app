export interface Adjunto {
  id: number;
  nombre_archivo: string;
  url: string;
  mimetype: string;
  usuarioId: number;
  sistemaOrigen: string;
  fecha_subida: string;
  ticketId?: number | null;
  comentarioId?: number | null;
}

export interface TicketComment {
  id: number;
  mensaje: string;
  usuarioId: number;
  sistemaOrigen: string;
  esInterno: boolean; 
  fechaCreacion: string;
  adjuntos: Adjunto[]; 
}
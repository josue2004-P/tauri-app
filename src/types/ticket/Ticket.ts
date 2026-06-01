import type { TicketCategory } from "../ticketCategory";

/**
 * Estados posibles del ticket sincronizados con la DB
 */
export const TicketStatus = {
  ABIERTO: 'abierto',
  EN_PROGRESO: 'en_progreso',
  RESUELTO: 'resuelto',
  CERRADO: 'cerrado',
} as const;

/**
 * Prioridades disponibles para los requerimientos
 */
export const TicketPriority = {
  BAJA: 'baja',
  MEDIA: 'media',
  ALTA: 'alta',
  CRITICA: 'critica',
} as const;

export type TicketStatusType = typeof TicketStatus[keyof typeof TicketStatus];
export type TicketPriorityType = typeof TicketPriority[keyof typeof TicketPriority];

export interface TicketEvidencia {
  id: number;
  nombre_archivo: string;
  url: string;
  mimetype: string;
  usuarioId: number;
  sistemaOrigen: string;
  fechaSubida: string;
}

export interface Ticket {
  id: number;
  asunto: string;
  descripcion: string;
  estado: TicketStatusType; 
  prioridad: TicketPriorityType; 
  usuarioId: number;
  sistemaOrigen: string;
  categoria: TicketCategory;
  evidencias?: TicketEvidencia[];
  fechaCreacion: string;
  fechaActualizacion: string;
}
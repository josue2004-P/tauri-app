export interface AddTicketComment {
  id: number;
  mensaje: string;
  ticketId: number;
  usuario: Usuario;
}

interface Usuario{
  id: number;
  Usuario: string;
}
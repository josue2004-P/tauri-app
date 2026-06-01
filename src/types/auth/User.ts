export interface User {
  id: number;
  nombre: string;
  apellido_paterno: string;
  apellido_materno: string;
  email: string;
  sistema: string;
  perfiles: Perifles[];
}

export interface Perifles{
  id: number;
  nombre: string;
}

export interface User {
  id: number;
  name: string;
  // apellido_paterno: string;
  // apellido_materno: string;
  email: string;
  // sistema: string;
  perfil: Perfil[];
}

export interface Perfil{
  id: number;
  nombre: string;
}

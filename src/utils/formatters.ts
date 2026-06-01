import type { User } from "../types/auth/User";

export const formatFullName = (user: User | null | undefined) => {
  if (!user) return "";

  return [user.nombre, user.apellido_paterno, user.apellido_materno]
    .filter(Boolean)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};
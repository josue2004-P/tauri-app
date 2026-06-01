export const getClientSubdomain = () => {
  if (typeof window === "undefined") return null; // seguridad para SSR
  const host = window.location.hostname; // "admin.localhost"
  const parts = host.split(".");          // ["admin", "localhost"]
  
  // si hay subdominio
  if (parts.length > 1) {
    return parts[0]; // "admin"
  }
  return null;
};
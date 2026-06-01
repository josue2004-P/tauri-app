export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("es-MX", {
    dateStyle: "full",   // "sábado, 23 de agosto de 2025"
    timeStyle: "short",  // "9:00 p. m."
  }).format(date);
}
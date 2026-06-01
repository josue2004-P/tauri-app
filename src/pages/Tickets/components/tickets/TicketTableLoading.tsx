interface TicketTableLoadingProps {
  mensaje?: string; 
}

export function TicketTableLoading({ mensaje = "Cargando tickets del sistema..." }: TicketTableLoadingProps) {
  return (
    <div className="flex h-60 items-center justify-center">
      <div className="flex flex-col items-center gap-2">
        {/* Spinner animado con Tailwind */}
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-500 border-t-transparent" />
        <p className="text-gray-500 text-sm font-medium">{mensaje}</p>
      </div>
    </div>
  );
}
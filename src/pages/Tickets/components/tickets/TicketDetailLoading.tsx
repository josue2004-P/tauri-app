interface TicketDetailLoadingProps {
  mensaje?: string; 
}

export function TicketDetailLoading({ mensaje }: TicketDetailLoadingProps) {
  return (
    <div className="flex h-40 items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        {/* Spinner animado */}
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand-500 border-t-transparent" />
        {mensaje && <p className="text-sm text-gray-500 font-medium">{mensaje}</p>}
      </div>
    </div>
  );
}
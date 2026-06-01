export function CategoryTableLoading() {
  return (
    <div className="flex h-40 items-center justify-center">
      <div className="flex flex-col items-center gap-2">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-500 border-t-transparent" />
        <p className="text-gray-500 text-sm font-medium">Cargando categorías...</p> 
      </div>
    </div>
  );
}
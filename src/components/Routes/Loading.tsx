// Loading.tsx
interface LoadingProps {
  message?: string; // mensaje opcional
}

export default function Loading({ message = "Cargando..." }: LoadingProps) {
  return (
    <div className="flex flex-col items-center justify-center h-screen w-full p-4">
      {/* Spinner */}
      <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-500 mb-4"></div>
      {/* Mensaje */}
      <p className="text-gray-700 text-lg">{message}</p>
    </div>
  );
}

import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTrashCan, faImages } from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";

interface GroupFileInputProps {
  id?: string;
  maxFiles?: number;
  disabled?: boolean;
  onChange: (files: File[]) => void;
}

export default function GroupFileInput({
  id,
  maxFiles = 5,
  disabled = false,
  onChange,
}: GroupFileInputProps) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const newFiles = Array.from(files).filter((file) =>
      file.type.startsWith("image/")
    );

    if (newFiles.length === 0) {
      Swal.fire({
        icon: "warning",
        title: "Formato no válido",
        text: "Por favor, selecciona únicamente archivos de imagen.",
      });
      return;
    }

    if (selectedFiles.length + newFiles.length > maxFiles) {
      Swal.fire({
        icon: "error",
        title: "Límite excedido",
        text: `Solo puedes subir un máximo de ${maxFiles} imágenes como evidencia.`,
      });
      return;
    }

    const updatedFiles = [...selectedFiles, ...newFiles];
    setSelectedFiles(updatedFiles);
    onChange(updatedFiles);

    const newPreviews = newFiles.map((file) => URL.createObjectURL(file));
    setPreviews([...previews, ...newPreviews]);
  };

  const removeFile = (index: number) => {
    URL.revokeObjectURL(previews[index]);

    const updatedFiles = selectedFiles.filter((_, i) => i !== index);
    const updatedPreviews = previews.filter((_, i) => i !== index);

    setSelectedFiles(updatedFiles);
    setPreviews(updatedPreviews);
    onChange(updatedFiles);
  };

  return (
    <div className="space-y-3">
      {/* Cuadrícula de Previsualizaciones + Botón de Agregar */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
        {/* Renderizado de imágenes ya cargadas */}
        {previews.map((preview, index) => (
          <div
            key={preview}
            className="relative aspect-square rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 group shadow-sm animate-fade-in"
          >
            <img
              src={preview}
              alt={`Evidencia ${index + 1}`}
              className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-200"
            />
            {/* Capa oscura superior y botón de eliminar al hacer hover */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <button
                type="button"
                onClick={() => removeFile(index)}
                disabled={disabled}
                className="p-2 rounded-full bg-rose-600 text-white hover:bg-rose-700 transition-colors shadow-lg cursor-pointer"
                title="Eliminar imagen"
              >
                <FontAwesomeIcon icon={faTrashCan} className="size-4" />
              </button>
            </div>
          </div>
        ))}

        {/* Zona Interactiva/Botón para agregar más fotos (Ocultar si llega al máximo) */}
        {selectedFiles.length < maxFiles && (
          <label
            className={`aspect-square rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-2 p-3 transition-colors cursor-pointer group shadow-theme-xs
              ${
                disabled
                  ? "border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 cursor-not-allowed opacity-60"
                  : "border-slate-300 dark:border-slate-700 hover:border-brand-500 hover:bg-brand-500/[0.02] dark:hover:bg-brand-500/[0.01]"
              }
            `}
          >
            <input
              id={id}
              type="file"
              multiple
              accept="image/*"
              disabled={disabled}
              className="hidden"
              onChange={handleFileChange}
            />
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-50 dark:bg-slate-800 group-hover:bg-brand-500/10 text-slate-400 group-hover:text-brand-500 transition-colors">
              <FontAwesomeIcon icon={faPlus} className="size-4" />
            </div>
            <div className="text-center">
              <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 block group-hover:text-brand-500 transition-colors">
                Añadir foto
              </span>
              <span className="text-[10px] text-slate-400 block mt-0.5">
                {selectedFiles.length} de {maxFiles}
              </span>
            </div>
          </label>
        )}
      </div>

      {/* Indicador de estado vacío */}
      {selectedFiles.length === 0 && (
        <div className="flex items-center gap-2 text-xs text-slate-400 mt-1 font-medium">
          <FontAwesomeIcon icon={faImages} className="size-3.5" />
          <span>Puedes arrastrar o seleccionar hasta 5 imágenes de soporte</span>
        </div>
      )}
    </div>
  );
}
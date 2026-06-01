import { useState, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperclip } from "@fortawesome/free-solid-svg-icons";
import Button from "../../../../components/ui/button/Button";
import { TicketAttachmentPreview } from "./TicketAttachmentPreview"; // <-- Importamos la preview

interface TicketResponseFormProps {
  // 🛠️ Actualizamos el contrato para que reciba también la lista de archivos adjuntos
  onSubmitComment: (mensaje: string, archivos: File[]) => Promise<boolean | void>;
}

export function TicketResponseForm({ onSubmitComment }: TicketResponseFormProps) {
  const [mensaje, setMensaje] = useState("");
  const [isSending, setIsSending] = useState(false);
  
  const [archivos, setArchivos] = useState<File[]>([]);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const nuevosArchivos = Array.from(e.target.files);
    setArchivos((prev) => [...prev, ...nuevosArchivos]);
    
    e.target.value = "";
  };

  const handleRemoveFile = (indexToRemove: number) => {
    setArchivos((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!mensaje.trim() || isSending) return;

    setIsSending(true);
    try {
      await onSubmitComment(mensaje.trim(), archivos);
      setMensaje(""); 
      setArchivos([]);
    } catch (error) {
      console.error("Error al enviar comentario desde el formulario:", error);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      className="space-y-4 border-t border-slate-100 dark:border-slate-800 pt-5 mt-6"
    >
      {/* INPUT OCULTO DE TIPO FILE */}
      <input 
        type="file" 
        multiple 
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/*"
      />

      <div className="rounded-xl border border-slate-200 bg-transparent p-4 dark:border-slate-800 focus-within:border-brand-500 transition-colors">
        <textarea
          rows={4}
          value={mensaje}
          onChange={(e) => setMensaje(e.target.value)}
          placeholder="Escriba una respuesta o nota interna..."
          className="w-full resize-none border-none bg-transparent text-sm text-slate-800 outline-none focus:ring-0 dark:text-white/90 placeholder:text-slate-400"
          disabled={isSending}
        />

        {/* 🛠️ CONTENEDOR DE PREVISUALIZACIONES PREVIAS */}
        {archivos.length > 0 && (
          <div className="mt-2 mb-3 flex flex-wrap gap-3 p-2 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-dashed border-slate-200 dark:border-slate-800">
            {archivos.map((archivo, index) => (
              <TicketAttachmentPreview 
                key={`${archivo.name}-${index}`}
                file={archivo}
                onRemove={() => handleRemoveFile(index)}
              />
            ))}
          </div>
        )}
        
        <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3 dark:border-slate-800">
          <button 
            type="button" 
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-brand-500 transition-colors cursor-pointer font-medium disabled:opacity-50"
            disabled={isSending}
          >
            <FontAwesomeIcon icon={faPaperclip} className="size-3.5" />
            Adjuntar archivo
          </button>
          
          <Button 
            type="submit" 
            variant="primary" 
            size="sm" 
            disabled={isSending || !mensaje.trim()}
          >
            {isSending ? "Enviando..." : "Actualizar Ticket"}
          </Button>
        </div>
      </div>
    </form>
  );
}
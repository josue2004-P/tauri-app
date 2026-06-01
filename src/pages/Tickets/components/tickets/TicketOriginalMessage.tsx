import type { TicketEvidencia } from '../../../../types/ticket';
import SeguroImageContainer from './SeguroImageContainer';

interface TicketOriginalMessageProps {
  usuarioId: number | string;
  descripcion: string;
  evidencias?: TicketEvidencia[]; 
}

export function TicketOriginalMessage({ 
  usuarioId, 
  descripcion, 
  evidencias = [] // Valor por defecto vacío
}: TicketOriginalMessageProps) {
  return (
    <div className="flex gap-4">
      {/* Avatar del usuario inicial */}
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-white/90 font-bold text-sm">
        U
      </div>
      
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <h4 className="font-semibold text-sm text-slate-800 dark:text-white/90">
            Usuario #{usuarioId}
          </h4>
          <span className="text-xs text-slate-400 font-medium">Mensaje inicial</span>
        </div>
        
        {/* Contenedor de la descripción */}
        <div className="mt-2 rounded-xl bg-slate-50 p-4 dark:bg-white/[0.03] border border-slate-100 dark:border-transparent">
          <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400 whitespace-pre-line">
            {descripcion}
          </p>

          {/* 🛠️ SECCIÓN DE EVIDENCIAS */}
          {evidencias.length > 0 && (
            <div className="mt-4 pt-3 border-t border-slate-200/60 dark:border-slate-800/60">
              <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 mb-2">
                Archivos adjuntos ({evidencias.length})
              </p>
              
              <div className="flex flex-wrap gap-3">
                {evidencias.map((evidencia) => (
                  <SeguroImageContainer
                    key={evidencia.id}
                    id={evidencia.id} 
                    mimetype={evidencia.mimetype}
                    nombreArchivo={evidencia.nombre_archivo}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
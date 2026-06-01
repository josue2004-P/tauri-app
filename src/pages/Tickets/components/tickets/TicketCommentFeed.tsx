import type { TicketComment } from "../../../../types/ticket"; 
import { EvidenciaComentarioImage } from "./EvidenciaComentarioImage";

interface TicketCommentFeedProps {
  comments: TicketComment[] | null;
  currentUserId: number | string | undefined;
}

export function TicketCommentFeed({ comments, currentUserId }: TicketCommentFeedProps) {
  if (!comments || comments.length === 0) return null;

  return (
    <div className="mt-6 space-y-4 border-t border-slate-100 dark:border-slate-800 pt-6">
      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
        Historial de Respuestas
      </h3>
      
      {comments.map((comment) => {
        const isMe = Number(comment.usuarioId) === Number(currentUserId);

        return (
          <div 
            key={comment.id} 
            className={`flex gap-3 max-w-[85%] ${isMe ? "ml-auto flex-row-reverse" : "mr-auto"}`}
          >
            {/* Avatar dinámico */}
            <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
              isMe 
                ? "bg-brand-500 text-white" 
                : "bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300"
            }`}>
              {isMe ? "Yo" : "A"}
            </div>

            {/* Contenedor de la burbuja de texto */}
            <div className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  {isMe ? "Tú (Soporte)" : `Agente #${comment.usuarioId}`}
                </span>
                <span className="text-[10px] text-slate-400">
                  {new Date(comment.fechaCreacion).toLocaleString("es-MX", {
                    day: "2-digit",
                    month: "short",
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false
                  }).replace(".", "")}
                </span>
              </div>

              {/* Burbuja estilizada condicionalmente */}
              <div className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                isMe 
                  ? "bg-brand-500/10 text-brand-900 dark:text-brand-300 rounded-tr-none border border-brand-500/20" 
                  : "bg-slate-50 text-slate-700 dark:bg-white/[0.03] dark:text-slate-300 rounded-tl-none border border-slate-100 dark:border-transparent"
              }`}>
                <p className="whitespace-pre-line">{comment.mensaje}</p>

                {comment.adjuntos && comment.adjuntos.length > 0 && (
                  <div className={`flex flex-wrap gap-2 mt-3 ${isMe ? "justify-end" : "justify-start"}`}>
                    {comment.adjuntos.map((adjunto) => (
                      <EvidenciaComentarioImage 
                        key={adjunto.id} 
                        adjuntoId={adjunto.id} 
                        nombreArchivo={adjunto.nombre_archivo} 
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
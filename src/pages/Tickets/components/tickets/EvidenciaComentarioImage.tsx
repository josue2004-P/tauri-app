import { useEffect, useState } from 'react';
import { useTicket } from '../../../../hooks/useTicket';
// 🛠️ Importaciones requeridas de tus librerías y componentes UI
import { Eye, ZoomIn, ZoomOut, RotateCcw, Download } from 'lucide-react'; 
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import { Modal } from '../../../../components/ui/modal';

interface EvidenciaComentarioImageProps {
  adjuntoId: number;
  nombreArchivo: string;
}

export const EvidenciaComentarioImage = ({ adjuntoId, nombreArchivo }: EvidenciaComentarioImageProps) => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const { startLoadEvidenciaComentarioById } = useTicket(); 

  // 🛠️ CONTROL DE SCROLL DEL BODY (Evita dobles scrolls molestos)
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isModalOpen]);

  // 🛠️ CARGA DEL BLOB SEGURO AUTENTICADO
  useEffect(() => {
    let urlTemporal: string | undefined;

    const cargarImagen = async () => {
      try {
        setLoading(true);
        urlTemporal = await startLoadEvidenciaComentarioById(adjuntoId);
        if (urlTemporal) {
          setImageSrc(urlTemporal);
        }
      } catch (error) {
        console.error("Error cargando la imagen en el componente", error);
      } finally {
        setLoading(false);
      }
    };

    cargarImagen();

    return () => {
      if (urlTemporal) {
        URL.revokeObjectURL(urlTemporal);
      }
    };
  }, [adjuntoId, startLoadEvidenciaComentarioById]);

  if (loading) return <div className="text-xs text-slate-400 animate-pulse">Cargando evidencia...</div>;
  if (!imageSrc) return <div className="text-xs text-red-400">Error al mostrar miniatura</div>;

  return (
    <>
      {/* Miniatura en el mensaje o ticket */}
      <div className="group relative h-24 w-32 overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 shadow-sm">
        <img
          src={imageSrc}
          alt={nombreArchivo}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div 
          onClick={() => setIsModalOpen(true)}
          className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer"
        >
          <Eye className="h-5 w-5 text-white" />
        </div>
      </div>

      {/* 🖥️ Modal personalizado integrado con controles de Zoom interactivos */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        className="max-w-4xl p-6 md:p-8" 
      >
        <TransformWrapper
          initialScale={1}
          minScale={0.5}
          maxScale={4}
          centerOnInit={true}
        >
          {({ zoomIn, zoomOut, resetTransform }) => (
            <div className="flex flex-col items-center justify-center mt-4 w-full relative">
              
              {/* BARRA DE HERRAMIENTAS FLOTANTE CON BOTÓN DE DESCARGA ADICIONAL */}
              <div className="absolute top-2 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-full shadow-lg border border-white/10 text-white">
                <button 
                  onClick={() => zoomIn()} 
                  title="Acercar"
                  className="p-1 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <ZoomIn className="h-4 w-4" />
                </button>
                <button 
                  onClick={() => zoomOut()} 
                  title="Alejar"
                  className="p-1 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <ZoomOut className="h-4 w-4" />
                </button>
                <button 
                  onClick={() => resetTransform()} 
                  title="Restaurar tamaño"
                  className="p-1 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <RotateCcw className="h-4 w-4" />
                </button>
                
                <div className="h-4 w-[1px] bg-white/20 mx-0.5" />

                {/* 💾 Descarga directa usando el Blob local que ya tenemos cargado */}
                <a 
                  href={imageSrc} 
                  download={nombreArchivo}
                  title="Descargar archivo original"
                  className="p-1 hover:bg-white/10 rounded-lg transition-colors flex items-center justify-center"
                >
                  <Download className="h-4 w-4" />
                </a>
              </div>

              {/* CONTENEDOR DE LA IMAGEN ZOOMABLE Y ARRASTRABLE */}
              <div className="overflow-hidden rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 shadow-inner w-full flex justify-center items-center">
                <TransformComponent
                  wrapperClass="!w-full !h-auto flex justify-center items-center"
                  contentClass="flex justify-center items-center"
                >
                  <img
                    src={imageSrc}
                    alt={nombreArchivo}
                    className="max-h-[65vh] w-auto max-w-full object-contain cursor-grab active:cursor-grabbing select-none"
                    draggable={false}
                  />
                </TransformComponent>
              </div>

              {/* Nombre del archivo */}
              <p className="mt-4 text-xs font-semibold text-slate-500 dark:text-slate-400 truncate max-w-md bg-slate-100 dark:bg-slate-800/60 px-3 py-1.5 rounded-full">
                {nombreArchivo}
              </p>
            </div>
          )}
        </TransformWrapper>
      </Modal>
    </>
  );
};
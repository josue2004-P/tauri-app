import { useState } from 'react';
import { Eye, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react'; 
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import { Modal } from '../../../../components/ui/modal';

interface SeguroImagePreviewProps {
  src: string;
  nombreArchivo: string;
}

export function SeguroImagePreview({ src, nombreArchivo }: SeguroImagePreviewProps) {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  return (
    <>
      {/* Miniatura en el mensaje o ticket */}
      <div className="group relative h-24 w-32 overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 shadow-sm">
        <img
          src={src}
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

      {/* Modal con controles interactivos de Zoom */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        className="max-w-4xl p-6 md:p-8" 
      >
        {/*  Envolvemos el contenido en el Wrapper de control */}
        <TransformWrapper
          initialScale={1}
          minScale={0.5}
          maxScale={4}
          centerOnInit={true}
        >
          {/* Usamos una función render-prop para renderizar los botones y el canvas */}
          {({ zoomIn, zoomOut, resetTransform }) => (
            <div className="flex flex-col items-center justify-center mt-4 w-full relative">
              
              {/* BARRA DE HERRAMIENTAS FLOTANTE */}
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
              </div>

              {/* CONTENEDOR DE LA IMAGEN ZOOMABLE */}
              <div className="overflow-hidden rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 shadow-inner w-full flex justify-center items-center">
                <TransformComponent
                  wrapperClass="!w-full !h-auto flex justify-center items-center"
                  contentClass="flex justify-center items-center"
                >
                  <img
                    src={src}
                    alt={nombreArchivo}
                    // cursor-grab le avisa al usuario que puede arrastrar la imagen
                    className="max-h-[65vh] w-auto max-w-full object-contain cursor-grab active:cursor-grabbing select-none"
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
}
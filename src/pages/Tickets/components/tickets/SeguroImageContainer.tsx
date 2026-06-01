import { useEffect, useState } from 'react';
import { useTicket } from '../../../../hooks/useTicket';
import { SeguroImagePreview } from './SeguroImagePreview';
import { SeguroFileDownloadRow } from './SeguroFileDownloadRow';

interface SeguroImageProps {
  id: number;
  mimetype: string;
  nombreArchivo: string;
}

export default function SeguroImageContainer({ id, mimetype, nombreArchivo }: SeguroImageProps) {
  const [src, setSrc] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);
  
  const { startLoadEvidenciaById } = useTicket();
  const isImage = mimetype.startsWith('image/');

  useEffect(() => {
    let urlBlob = '';

    const cargarArchivoSeguro = async () => {
      try {
        setLoading(true);
        const blob = await startLoadEvidenciaById(id);
        
        if (blob) {
          urlBlob = URL.createObjectURL(blob);
          setSrc(urlBlob);
        }
      } catch (err) {
        console.error(`Error al cargar el adjunto #${id}:`, err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    cargarArchivoSeguro();

    return () => {
      if (urlBlob) URL.revokeObjectURL(urlBlob);
    };
  }, [id, startLoadEvidenciaById]);

  // --- RENDEREAR SKELETON DE CARGA ---
  if (loading) {
    return (
      <div className="h-24 w-32 animate-pulse rounded-xl bg-slate-200 dark:bg-slate-800" />
    );
  }

  // --- RENDEREAR RECUADRO DE ERROR ---
  if (error) {
    return (
      <div className="flex h-24 w-32 items-center justify-center rounded-xl border border-red-200 bg-red-50 text-center text-[10px] font-medium text-red-500 dark:bg-red-950/20 dark:border-red-900/50">
        Error al cargar evidencia
      </div>
    );
  }

  // --- DECISIÓN DE INTERFAZ SEPARADA ---
  if (!isImage) {
    return <SeguroFileDownloadRow src={src} nombreArchivo={nombreArchivo} />;
  }

  return <SeguroImagePreview src={src} nombreArchivo={nombreArchivo} />;
}
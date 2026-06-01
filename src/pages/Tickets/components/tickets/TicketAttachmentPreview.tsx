import { useEffect, useState } from 'react';
import { FileText, X } from 'lucide-react';

interface TicketAttachmentPreviewProps {
  file: File;
  onRemove: () => void;
}

export function TicketAttachmentPreview({ file, onRemove }: TicketAttachmentPreviewProps) {
  const [previewSrc, setPreviewSrc] = useState<string>('');
  const isImage = file.type.startsWith('image/');

  useEffect(() => {
    if (!isImage) return;

    const urlTemporal = URL.createObjectURL(file);
    setPreviewSrc(urlTemporal);

    return () => {
      if (urlTemporal) {
        URL.revokeObjectURL(urlTemporal);
      }
    };
  }, [file, isImage]);

  return (
    <div className="relative group h-16 w-20 flex-shrink-0">
      
      <div className="h-full w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 overflow-hidden shadow-sm">
        {isImage && previewSrc ? (
          <img 
            src={previewSrc} 
            alt={file.name} 
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex flex-col h-full w-full items-center justify-center p-1 text-red-500">
            <FileText className="h-5 w-5" />
            <span className="text-[9px] text-slate-400 font-medium truncate w-full text-center px-1">
              {file.name.split('.').pop()?.toUpperCase()}
            </span>
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={onRemove}
        className="absolute -top-1.5 -right-1.5 z-50 flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-white shadow-md hover:bg-rose-600 transition-colors cursor-pointer border border-white dark:border-slate-900"
      >
        <X className="h-3 w-3" />
      </button>
    </div>
  );
}
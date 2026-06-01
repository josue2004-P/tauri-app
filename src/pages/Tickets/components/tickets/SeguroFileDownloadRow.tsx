import { FileText, Download } from 'lucide-react';

interface SeguroFileDownloadRowProps {
  src: string;
  nombreArchivo: string;
}

export function SeguroFileDownloadRow({ src, nombreArchivo }: SeguroFileDownloadRowProps) {
  return (
    <a
      href={src}
      download={nombreArchivo} 
      className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-all duration-200 group max-w-xs shadow-sm"
    >
      <div className="p-2 rounded-lg bg-red-50 dark:bg-red-950/30 text-red-500">
        <FileText className="h-6 w-6" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 truncate group-hover:text-blue-500 transition-colors">
          {nombreArchivo}
        </p>
        <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">
          Documento PDF
        </p>
      </div>
      <Download className="h-4 w-4 text-slate-400 group-hover:text-slate-600 transition-colors shrink-0 ml-1" />
    </a>
  );
}
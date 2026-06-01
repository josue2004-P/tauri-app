/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";

import { Link } from "react-router-dom";

interface GenericTableProps<T> {
  columns: Column<T>[];
  data: T[];
  rowKey: keyof T; 
  title?: string;
  createRoute?: string;
  createText?: string;
  totalResults?: number;
  onNextPage?: () => void;
  onPrevPage?: () => void;
  disableNext?: boolean;
  disablePrev?: boolean;
}

export interface Column<T> {
  header: string;
  key: keyof T | string;
  render?: (item: T) => React.ReactNode;
}

export default function ReusableTable<T extends { id: number | string }>({
  columns,
  data,
  rowKey,
  title,
  createRoute,
  createText = "Agregar",
  totalResults = 0,
  onNextPage,
  onPrevPage,
  disableNext,
  disablePrev,
}: GenericTableProps<T>) {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      {/* 1. Header Dinámico de la Tabla */}
      {(title || createRoute) && (
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-white/[0.05]">
          {title && (
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
              {title}
            </h3>
          )}
          {createRoute && (
            <Link
              to={createRoute}
              className="px-4 py-2 text-sm font-medium text-black transition border border-black rounded-md dark:text-white dark:border-white/20 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black"
            >
              + {createText}
            </Link>
          )}
        </div>
      )}
      <div className="max-w-full overflow-x-auto">
        <Table>
          <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
            <TableRow>
              {columns.map((col, index) => (
                <TableCell
                  key={index}
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  {col.header}
                </TableCell>
              ))}
            </TableRow>
          </TableHeader>

          <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
          {data.map((item) => (
            <TableRow key={String(item[rowKey])}>
                {columns.map((col, index) => (
                  <TableCell key={index} className="px-5 py-4 text-gray-700 dark:text-gray-300 text-start text-theme-sm">
                    {/* Si existe un render personalizado lo usamos, si no, pintamos el texto plano */}
                    {col.render ? col.render(item) : (item as any)[col.key]}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {/* Footer con Paginación */}
      <div className="flex items-center justify-between px-5 py-4 border-t border-gray-100 dark:border-white/[0.05] text-sm text-gray-600 dark:text-gray-400">
        <div>
          <span className="font-medium text-gray-800 dark:text-white/90">{totalResults}</span> resultados
        </div>
        
        {(onNextPage || onPrevPage) && (
          <div className="flex items-center gap-3">
            <button
              onClick={onPrevPage}
              disabled={disablePrev}
              className="px-3 py-1 border border-gray-200 dark:border-white/10 rounded-md hover:bg-gray-50 dark:hover:bg-white/5 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              Anterior
            </button>
            <button
              onClick={onNextPage}
              disabled={disableNext}
              className="px-3 py-1 border border-gray-200 dark:border-white/10 rounded-md hover:bg-gray-50 dark:hover:bg-white/5 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              Siguiente
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
import { Link } from "react-router";

interface BreadcrumbRoute {
  name: string;
  path?: string;
}

interface BreadcrumbProps {
  title: string;         
  description?: string;   // <-- Agregamos la descripción como propiedad opcional
  routes: BreadcrumbRoute[];
  icon?: React.ReactNode; 
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ 
  title, 
  description, 
  routes, 
  icon 
}) => {
  return (
    <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-start md:justify-between border-b border-gray-100 dark:border-gray-800 pb-5">
      
      {/* Sección Izquierda: Ícono + (Título y Descripción) */}
      <div className="flex items-start gap-4">
        {icon && (
          // Ajustamos el padding a p-3 para darle más presencia al contenedor del ícono
          <div className="flex p-3 items-center justify-center rounded-xl bg-slate-950 text-white dark:bg-slate-800 shadow-sm mt-0.5">
            {icon}
          </div>
        )}
        {/* Contenedor vertical para apilar Título y Descripción */}
        <div className="flex flex-col gap-0.5">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white leading-none">
            {title}
          </h2>
          {description && (
            <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 font-medium max-w-xl">
              {description}
            </p>
          )}
        </div>
      </div>

      {/* Sección Derecha: Listado de rutas navegables (Breadcrumbs) */}
      <nav aria-label="Breadcrumb" className="md:text-right ">
        <ol className="flex items-center gap-1.5 text-xs md:text-sm font-medium text-slate-500 dark:text-slate-400 md:justify-end">
          {routes.map((route, index) => {
            const isLast = index === routes.length - 1;

            return (
              <li key={route.name} className="flex items-center gap-1.5">
                {index > 0 && (
                  // Cambiamos el "/" por un "›" más sutil e industrial como el de tu diseño original
                  <span className="text-slate-400 dark:text-slate-600 font-light">
                    ›
                  </span>
                )}

                {isLast || !route.path ? (
                  <span className="text-slate-900 dark:text-white font-semibold">
                    {route.name}
                  </span>
                ) : (
                  <Link
                    to={route.path}
                    className="hover:text-brand-500 dark:hover:text-brand-400 transition-colors"
                  >
                    {route.name}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </div>
  );
};
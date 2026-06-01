import { Link } from "react-router-dom";

interface BreadcrumbLink {
  label: string;
  path?: string; 
}

interface PageBreadcrumbProps {
  pageTitle: string;
  description?: string; 
  links: BreadcrumbLink[]; 
}

const PageBreadcrumb: React.FC<PageBreadcrumbProps> = ({ 
  pageTitle, 
  description, 
  links 
}) => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
      {/* Título y Descripción */}
      <div>
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90">
          {pageTitle}
        </h2>
        {description && (
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {description}
          </p>
        )}
      </div>

      <nav>
        <ol className="flex items-center gap-1.5">
          {links.map((link, index) => {
            const isLast = index === links.length - 1;

            return (
              <li key={index} className="flex items-center gap-1.5">
                {/* Si tiene path y no es el último, es un Link (Ruta 1) */}
                {link.path && !isLast ? (
                  <Link
                    className="text-sm text-gray-500 hover:text-primary dark:text-gray-400 dark:hover:text-white transition-colors"
                    to={link.path}
                  >
                    {link.label}
                  </Link>
                ) : (
                  /* Si es el último, es texto plano (Ruta 2 / Actual) */
                  <span className="text-sm font-medium text-gray-800 dark:text-white/90">
                    {link.label}
                  </span>
                )}
                
                {/* Mostrar el separador solo si no es el último elemento */}
                {!isLast && <ChevronIcon />}
              </li>
            );
          })}
        </ol>
      </nav>
    </div>
  );
};

const ChevronIcon = () => (
  <svg
    className="stroke-current text-gray-400"
    width="17"
    height="16"
    viewBox="0 0 17 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M6.0765 12.667L10.2432 8.50033L6.0765 4.33366"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default PageBreadcrumb;
import type { ReactNode } from "react";
import { Link } from "react-router-dom"; // Importante para la navegación SPA

interface LinkButtonProps {
  to: string; // La ruta de destino
  children: ReactNode;
  size?: "sm" | "md";
  variant?: "primary" | "outline";
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  className?: string;
}

const LinkButton: React.FC<LinkButtonProps> = ({
  to,
  children,
  size = "md",
  variant = "primary",
  startIcon,
  endIcon,
  className = "",
}) => {
  // Reutilizamos tus clases exactas de Button.tsx
  const sizeClasses = {
    sm: "px-4 py-2 text-sm",
    md: "px-5 py-3.5 text-sm",
  };

  const variantClasses = {
    primary:
      "bg-brand-500 text-white shadow-theme-xs hover:bg-brand-600",
    outline:
      " text-gray-700 dark:text-gray-400   dark:hover:text-gray-300",
  };

  return (
    <Link
      to={to}
      className={`inline-flex items-center justify-center gap-2 rounded-lg transition font-medium ${className} ${
        sizeClasses[size]
      } ${variantClasses[variant]}`}
    >
      {startIcon && <span className="flex items-centera">{startIcon}</span>}
      {children}
      {endIcon && <span className="flex items-center">{endIcon}</span>}
    </Link>
  );
};

export default LinkButton;
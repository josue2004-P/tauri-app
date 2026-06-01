import { useAuth } from "../../hooks/useAuth"
import { Navigate,Outlet } from "react-router-dom"

interface RoleGuardProps {
  allowedRoles: string[];
}

export const RoleGuard: React.FC<RoleGuardProps> = ({ allowedRoles }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/signin" replace />;
  }

  const userRoles = user.perfiles?.map(p => p.nombre.toLowerCase()) || [];

  const hasAccess = allowedRoles.some(role => userRoles.includes(role.toLowerCase()));

  return hasAccess ? <Outlet /> : <Navigate to="/" replace />;
};
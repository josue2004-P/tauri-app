import { useCallback, useEffect, useRef, useState, useMemo } from "react";
import { Link, useLocation } from "react-router";

// Importamos los iconos necesarios de Font Awesome
import { 
  faGauge, 
  faTicketAlt, 
  faChevronDown, 
  faEllipsisH 
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { IconProp } from "@fortawesome/fontawesome-svg-core";

import { useSidebar } from "../context/SidebarContext";
import { useAuth } from "../hooks/useAuth";

type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  perfil?: string[];
  subItems?: { 
    name: string; 
    path: string; 
    pro?: boolean; 
    new?: boolean; 
    perfil?: string[];
  }[];
};

const navItems: NavItem[] = [
  {
    icon: (
      <FontAwesomeIcon 
        icon={faGauge as IconProp} 
        className="text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors w-5 h-5" 
      />
    ),
    name: "Dashboard",
    path: "/",
    perfil: ["usuario", "administrador"],
  },
  {
    name: "Tickets",
    perfil: ["usuario", "administrador"],
    icon: (
      <FontAwesomeIcon 
        icon={faTicketAlt as IconProp} 
        className="text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors w-5 h-5" 
      />
    ),
    subItems: [
      { 
        name: "Tickets", 
        path: "/tickets", 
        pro: false,
        perfil: ["administrador", "usuario"]
      },    
      { 
        name: "Categorias", 
        path: "/categoria-tickets", 
        pro: false, 
        perfil: ["administrador"]
      }
    ],
  },
];

const othersItems: NavItem[] = [];

const AppSidebar: React.FC = () => {
  const { user } = useAuth();
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const location = useLocation();

  const userRoles = useMemo(() => {
    if (!user || !user.perfil) return [];

    if (Array.isArray(user.perfil)) {
      return user.perfil
        .map((p) => (p?.nombre ? String(p.nombre).toLowerCase().trim() : ""))
        .filter(Boolean);
    }

    const perfilObjeto = user.perfil as { nombre?: string };
    if (perfilObjeto?.nombre) {
      return [String(perfilObjeto.nombre).toLowerCase().trim()];
    }

    return [];
  }, [user]);

  const hasPermission = (allowedRoles?: string[]) => {
    if (!allowedRoles) return true;
    return allowedRoles.some(role => userRoles.includes(role.toLowerCase()));
  };

  const filteredNavItems = useMemo(() => {
    return navItems
      .filter(item => hasPermission(item.perfil)) 
      .map(item => {
        if (item.subItems) {
          return {
            ...item,
            subItems: item.subItems.filter(sub => hasPermission(sub.perfil))
          };
        }
        return item;
      });
  }, [userRoles]);

  const [openSubmenu, setOpenSubmenu] = useState<{
    type: "main" | "others";
    index: number;
  } | null>(null);
  
  const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>({});
  const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const isActive = useCallback(
    (path: string) => location.pathname === path,
    [location.pathname]
  );

  // Sincronizar submenús según la ruta actual sin provocar bucles
  useEffect(() => {
    let nextSubmenu: { type: "main" | "others"; index: number } | null = null;

    ["main", "others"].forEach((menuType) => {
      const items = menuType === "main" ? filteredNavItems : othersItems;
      items.forEach((nav, index) => {
        if (nav.subItems) {
          nav.subItems.forEach((subItem) => {
            if (isActive(subItem.path)) {
              nextSubmenu = {
                type: menuType as "main" | "others",
                index,
              };
            }
          });
        }
      });
    });

    setOpenSubmenu((current) => {
      if (!current && !nextSubmenu) return null;
      if (current && nextSubmenu && current.type === nextSubmenu.type && current.index === nextSubmenu.index) {
        return current;
      }
      return nextSubmenu; 
    });
  }, [location.pathname, isActive, filteredNavItems]);
  
  // Calcular altura real de los submenús para la animación fluida
  useEffect(() => {
    if (openSubmenu !== null) {
      const key = `${openSubmenu.type}-${openSubmenu.index}`;
      if (subMenuRefs.current[key]) {
        setSubMenuHeight((prevHeights) => ({
          ...prevHeights,
          [key]: subMenuRefs.current[key]?.scrollHeight || 0,
        }));
      }
    }
  }, [openSubmenu]);

  const handleSubmenuToggle = (index: number, menuType: "main" | "others") => {
    setOpenSubmenu((prevOpenSubmenu) => {
      if (
        prevOpenSubmenu &&
        prevOpenSubmenu.type === menuType &&
        prevOpenSubmenu.index === index
      ) {
        return null;
      }
      return { type: menuType, index };
    });
  };

  const renderMenuItems = (items: NavItem[], menuType: "main" | "others") => (
    <ul className="flex flex-col gap-2">
      {items.map((nav, index) => {
        const isSubmenuOpen = openSubmenu?.type === menuType && openSubmenu?.index === index;
        
        return (
          <li key={nav.name}>
            {nav.subItems ? (
              <button
                onClick={() => handleSubmenuToggle(index, menuType)}
                className={`w-full flex items-center gap-3 p-3 rounded-lg text-left cursor-pointer transition-all duration-200 group ${
                  isSubmenuOpen 
                    ? "bg-gray-100 dark:bg-gray-800 text-blue-600 dark:text-blue-400 font-medium" 
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                }`}
              >
                <span className="flex-shrink-0">{nav.icon}</span>
                {(isExpanded || isHovered || isMobileOpen) && (
                  <span className="text-sm">{nav.name}</span>
                )}
                
                {(isExpanded || isHovered || isMobileOpen) && (
                  <FontAwesomeIcon 
                    icon={faChevronDown as IconProp} 
                    className={`ml-auto w-3 h-3 text-gray-400 transition-transform duration-200 ${
                      isSubmenuOpen ? "rotate-180 text-blue-600 dark:text-blue-400" : ""
                    }`}
                  />
                )}
              </button>
            ) : (
              nav.path && (
                <Link
                  to={nav.path}
                  className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-200 group ${
                    isActive(nav.path)
                      ? "bg-gray-100 dark:bg-gray-800 text-blue-600 dark:text-blue-400 font-medium"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                  }`}
                >
                  <span className="flex-shrink-0">{nav.icon}</span>
                  {(isExpanded || isHovered || isMobileOpen) && (
                    <span className="text-sm">{nav.name}</span>
                  )}
                </Link>
              )
            )}
            
            {/* Contenedor del Submenú animado */}
            {nav.subItems && (
              <div
                ref={(el) => {
                  subMenuRefs.current[`${menuType}-${index}`] = el;
                }}
                className="overflow-hidden transition-all duration-300 ease-in-out"
                style={{
                  height: isSubmenuOpen && (isExpanded || isHovered || isMobileOpen)
                    ? `${subMenuHeight[`${menuType}-${index}`] || 0}px`
                    : "0px",
                }}
              >
                <ul className="mt-1 pl-11 space-y-1 border-l border-gray-100 dark:border-gray-800 ml-5">
                  {nav.subItems.map((subItem) => (
                    <li key={subItem.name}>
                      <Link 
                        to={subItem.path} 
                        className={`text-sm block py-2 px-3 rounded-md transition-colors ${
                          isActive(subItem.path)
                            ? "text-blue-600 dark:text-blue-400 font-medium bg-gray-50 dark:bg-gray-800/30"
                            : "text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
                        }`}
                      >
                        {subItem.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );

  return (
    <aside
      className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-4 left-0 h-screen transition-all duration-300 ease-in-out z-50 border-r 
        bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 border-gray-200 dark:border-gray-800
        ${
          isExpanded || isMobileOpen
            ? "w-[290px]"
            : isHovered
            ? "w-[290px]"
            : "w-[90px]"
        }
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Sección del Logo */}
      <div
        className={`py-8 flex ${
          !isExpanded && !isHovered ? "lg:justify-center" : "justify-start pl-3"
        }`}
      >
        <Link to="/">
          {isExpanded || isHovered || isMobileOpen ? (
            <span className="font-bold text-xl tracking-tight text-blue-600 dark:text-blue-500 transition-colors">
              INDHECA
            </span>
          ) : (
            <span className="font-bold text-xl text-blue-600 dark:text-blue-500 transition-colors">
              I
            </span>
          )}
        </Link>
      </div>

      {/* Menú de Navegación */}
      <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar flex-1">
        <nav className="mb-6">
          <div className="flex flex-col gap-4">
            <div>
              <h2
                className={`mb-4 text-xs font-semibold uppercase flex leading-[20px] text-gray-400 dark:text-gray-500 ${
                  !isExpanded && !isHovered ? "lg:justify-center" : "justify-start pl-3"
                }`}
              >
                {isExpanded || isHovered || isMobileOpen ? (
                  "Menu"
                ) : (
                  <FontAwesomeIcon icon={faEllipsisH as IconProp} className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                )}
              </h2>
              {renderMenuItems(filteredNavItems, "main")}
            </div>
          </div>
        </nav>
      </div>
    </aside>
  );
};

export default AppSidebar;
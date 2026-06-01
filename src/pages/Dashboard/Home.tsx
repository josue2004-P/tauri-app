import PageMeta from "../../components/common/PageMeta";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faTicketAlt, 
  faCheckCircle, 
  faClock, 
  faExclamationTriangle,
  faUsers, 
  faCogs, 
  faCode, 
  faTerminal, 
  faPlus, 
  faUser,
  faDatabase
} from "@fortawesome/free-solid-svg-icons";

export default function Home() {
  return (
    <>
      <PageMeta
        title="Dashboard de Tickets"
        description="Panel de control y gestión de soporte técnico."
      />

      {/* 🌟 Removimos min-h-screen y bg-gray-50 redundantes para un acople perfecto de color */}
      <div className="w-full animate-fade-in">
        
        {/* ENCABEZADO */}
        <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white sm:text-3xl">
              Panel de Control
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Bienvenido al sistema centralizado de tickets.
            </p>
          </div>
          <div>
            <button className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 shadow-sm cursor-pointer">
              <FontAwesomeIcon icon={faPlus} />
              Nuevo Ticket
            </button>
          </div>
        </div>

        {/* METRICAS GENERALES */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-800 transition-colors duration-200">
            <div className="rounded-lg bg-blue-100 p-3 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400">
              <FontAwesomeIcon icon={faTicketAlt} className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Asignados</p>
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white">124</h3>
            </div>
          </div>

          <div className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-800 transition-colors duration-200">
            <div className="rounded-lg bg-yellow-100 p-3 text-yellow-600 dark:bg-yellow-900/50 dark:text-yellow-400">
              <FontAwesomeIcon icon={faClock} className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">En Espera</p>
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white">18</h3>
            </div>
          </div>

          <div className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-800 transition-colors duration-200">
            <div className="rounded-lg bg-green-100 p-3 text-green-600 dark:bg-green-900/50 dark:text-green-400">
              <FontAwesomeIcon icon={faCheckCircle} className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Resueltos Hoy</p>
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white">32</h3>
            </div>
          </div>

          <div className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-800 transition-colors duration-200">
            <div className="rounded-lg bg-red-100 p-3 text-red-600 dark:bg-red-900/50 dark:text-red-400">
              <FontAwesomeIcon icon={faExclamationTriangle} className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Críticos (SLA)</p>
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white">4</h3>
            </div>
          </div>
        </div>

        {/* GRID PRINCIPAL DE ROLES */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          
          {/* SECCIÓN 1: VISTA DE ADMINISTRACIÓN */}
          <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-800 transition-colors duration-200">
            <div className="mb-4 flex items-center gap-2 border-b border-gray-100 pb-3 dark:border-gray-700">
              <FontAwesomeIcon icon={faCogs} className="text-purple-500" />
              <h2 className="text-lg font-bold text-gray-800 dark:text-white">Gestión de Administración</h2>
            </div>
            <p className="mb-4 text-xs text-gray-400 dark:text-gray-500">Monitoreo de SLAs, Tenants y carga de trabajo del equipo.</p>
            
            <div className="space-y-3">
              <button className="flex w-full items-center justify-between rounded-lg bg-gray-50 p-3 text-left transition-colors hover:bg-gray-100 dark:bg-gray-900/40 dark:hover:bg-gray-900 cursor-pointer">
                <span className="flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300">
                  <FontAwesomeIcon icon={faUsers} className="w-4 text-gray-400 dark:text-gray-500" />
                  Asignar Agentes / Carga de Trabajo
                </span>
                <span className="rounded bg-purple-100 px-2 py-0.5 text-xs font-semibold text-purple-700 dark:bg-purple-900/30 dark:text-purple-400">Ver</span>
              </button>
              
              <button className="flex w-full items-center justify-between rounded-lg bg-gray-50 p-3 text-left transition-colors hover:bg-gray-100 dark:bg-gray-900/40 dark:hover:bg-gray-900 cursor-pointer">
                <span className="flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300">
                  <FontAwesomeIcon icon={faDatabase} className="w-4 text-gray-400 dark:text-gray-500" />
                  Organizaciones y Tenants
                </span>
                <span className="text-xs text-gray-400 dark:text-gray-500">12 Activos</span>
              </button>

              <div className="rounded-lg bg-amber-50 p-3 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/30">
                <h4 className="text-xs font-bold text-amber-800 dark:text-amber-400 uppercase tracking-wider">Alerta Global de SLA</h4>
                <p className="text-xs text-amber-700 dark:text-amber-500 mt-1">3 tickets están a punto de vencer el tiempo límite de respuesta.</p>
              </div>
            </div>
          </div>

          {/* SECCIÓN 2: ESPACIO DE DESARROLLADORES */}
          <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-800 transition-colors duration-200">
            <div className="mb-4 flex items-center gap-2 border-b border-gray-100 pb-3 dark:border-gray-700">
              <FontAwesomeIcon icon={faCode} className="text-indigo-500" />
              <h2 className="text-lg font-bold text-gray-800 dark:text-white">Mesa de Desarrolladores</h2>
            </div>
            <p className="mb-4 text-xs text-gray-400 dark:text-gray-500">Bugs del sistema, microservicios y logs técnicos.</p>
            
            <div className="space-y-3">
              <div className="rounded-lg border border-gray-100 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-900/30">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-indigo-600 dark:text-indigo-400 font-semibold">[BUG-404] Error TypeORM</span>
                  <span className="rounded bg-red-100 px-2 py-0.5 text-[10px] font-bold text-red-700 dark:bg-red-900/40 dark:text-red-400">CRÍTICO</span>
                </div>
                <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">Fallo en la conexión dinámica del tenant ID: tibernal_db.</p>
              </div>

              <div className="rounded-lg border border-gray-100 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-900/30">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-gray-600 dark:text-gray-400">[FEAT-102] Webhooks Facturapi</span>
                  <span className="rounded bg-blue-100 px-2 py-0.5 text-[10px] font-bold text-blue-700 dark:bg-blue-900/40 dark:text-blue-400">PROGRESO</span>
                </div>
                <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">Sincronización automática de CFDI de respaldo.</p>
              </div>

              <button className="flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-gray-300 py-2 text-xs font-medium text-gray-500 transition-colors hover:bg-gray-50 hover:text-gray-700 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-900 dark:hover:text-gray-200 cursor-pointer">
                <FontAwesomeIcon icon={faTerminal} />
                Ver Logs de Microservicios
              </button>
            </div>
          </div>

          {/* SECCIÓN 3: MIS TICKETS (VISTA DE USUARIO) */}
          <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-800 transition-colors duration-200">
            <div className="mb-4 flex items-center gap-2 border-b border-gray-100 pb-3 dark:border-gray-700">
              <FontAwesomeIcon icon={faUser} className="text-emerald-500" />
              <h2 className="text-lg font-bold text-gray-800 dark:text-white">Mis Tickets Abiertos</h2>
            </div>
            <p className="mb-4 text-xs text-gray-400 dark:text-gray-500">Seguimiento de tus solicitudes personales de soporte.</p>

            <div className="space-y-3">
              <div className="flex flex-col gap-2 rounded-lg border border-gray-100 p-3 dark:border-gray-700 dark:bg-gray-900/20">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium text-gray-800 dark:text-white truncate max-w-[180px]">Fallo de Login en App móvil</h4>
                  <span className="rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">Revisión</span>
                </div>
                <span className="text-[11px] text-gray-400 dark:text-gray-500">Actualizado hace 20 min</span>
              </div>

              <div className="flex flex-col gap-2 rounded-lg border border-gray-100 p-3 dark:border-gray-700 dark:bg-gray-900/20">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium text-gray-800 dark:text-white truncate max-w-[180px]">Error al exportar reporte PDF</h4>
                  <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">Asignado</span>
                </div>
                <span className="text-[11px] text-gray-400 dark:text-gray-500">Actualizado ayer</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
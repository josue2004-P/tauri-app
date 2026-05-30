import { useEffect, useState } from "react";
import Database from "@tauri-apps/plugin-sql";
import "./index.css";

interface Usuario {
  id: number;
  nombre: string;
  rol: string;
  estado: "Activo" | "Inactivo";
}

function App() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [nuevoNombre, setNuevoNombre] = useState("");
  const [nuevoRol, setNuevoRol] = useState("Fullstack Developer");

  // Cargar datos desde SQLite de forma segura esperando al núcleo nativo
  const cargarDatos = async () => {
    // Si los internos de Tauri no están listos, reintentamos en 100ms
    if (typeof window === "undefined" || !("__TAURI_INTERNALS__" in window)) {
      setTimeout(cargarDatos, 100);
      return;
    }

    try {
      const db = await Database.load("sqlite:datos.db");
      
      // Crear tabla si no existe
      await db.execute(`
        CREATE TABLE IF NOT EXISTS usuarios_dash (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          nombre TEXT NOT NULL,
          rol TEXT NOT NULL,
          estado TEXT NOT NULL
        );
      `);

      const resultado = await db.select<Usuario[]>("SELECT * FROM usuarios_dash");
      setUsuarios(resultado || []);
    } catch (error) {
      console.error("Error al acceder a SQLite:", error);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  // Insertar usuario
  const guardarUsuario = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nuevoNombre.trim()) return;
    if (typeof window === "undefined" || !("__TAURI_INTERNALS__" in window)) return;

    try {
      const db = await Database.load("sqlite:datos.db");
      await db.execute(
        "INSERT INTO usuarios_dash (nombre, rol, estado) VALUES ($1, $2, $3)",
        [nuevoNombre.trim(), nuevoRol, "Activo"]
      );
      
      setNuevoNombre("");
      await cargarDatos(); // Esperamos a que recargue antes de seguir
    } catch (error) {
      console.error("Error al insertar en SQLite:", error);
    }
  };

  // Eliminar usuario
  const eliminarUsuario = async (id: number) => {
    if (typeof window === "undefined" || !("__TAURI_INTERNALS__" in window)) return;

    try {
      const db = await Database.load("sqlite:datos.db");
      await db.execute("DELETE FROM usuarios_dash WHERE id = $1", [id]);
      await cargarDatos();
    } catch (error) {
      console.error("Error al eliminar de SQLite:", error);
    }
  };

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 font-sans overflow-hidden">
      
      {/* 1. SIDEBAR (Barra Lateral) */}
      <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between p-6">
        <div>
          <div className="flex items-center gap-3 mb-8 px-2">
            <div className="h-8 w-8 rounded-lg bg-sky-500 flex items-center justify-center font-bold text-slate-950">
              T
            </div>
            <span className="text-lg font-bold tracking-wider text-white">TAURI DASH</span>
          </div>
          
          <nav className="space-y-2">
            <a href="#" className="flex items-center gap-3 px-4 py-2.5 rounded-lg bg-slate-800 text-sky-400 font-medium transition-colors">
              <span>📊</span> Dashboard
            </a>
            <a href="#" className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-slate-400 hover:bg-slate-800/50 hover:text-slate-200 transition-colors">
              <span>👥</span> Usuarios
            </a>
            <a href="#" className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-slate-400 hover:bg-slate-800/50 hover:text-slate-200 transition-colors">
              <span>⚙️</span> Configuración
            </a>
          </nav>
        </div>
        
        <div className="border-t border-slate-800 pt-4 px-2 text-xs text-slate-500">
          Entorno: <span className="text-emerald-400 font-mono">Bun + Tauri v2</span>
        </div>
      </aside>

      {/* 2. CONTENIDO PRINCIPAL */}
      <main className="flex-1 overflow-y-auto p-8">
        
        {/* Encabezado */}
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white">Panel de Control</h1>
            <p className="text-slate-400 text-sm mt-1">Monitoreo de persistencia local mediante SQLite nativo.</p>
          </div>
          <div className="flex items-center gap-3 bg-slate-900 px-4 py-2 rounded-xl border border-slate-800">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-xs font-medium text-slate-300">Base de datos conectada</span>
          </div>
        </header>

        {/* 3. TARJETAS DE ESTADÍSTICAS */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-sm">
            <div className="text-slate-400 text-sm font-medium">Total de Usuarios</div>
            <div className="text-4xl font-bold mt-2 text-white">{usuarios.length}</div>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-sm">
            <div className="text-slate-400 text-sm font-medium">Roles Activos</div>
            <div className="text-4xl font-bold mt-2 text-sky-400">
              {new Set(usuarios.map(u => u.rol)).size}
            </div>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-sm">
            <div className="text-slate-400 text-sm font-medium">Motor de BD</div>
            <div className="text-2xl font-bold mt-3 text-emerald-400 font-mono">SQLite 3</div>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 4. FORMULARIO */}
          <section className="bg-slate-900 border border-slate-800 p-6 rounded-2xl h-fit">
            <h2 className="text-xl font-semibold text-white mb-4">Registrar Miembro</h2>
            <form onSubmit={guardarUsuario} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">Nombre Completo</label>
                <input
                  type="text"
                  value={nuevoNombre}
                  onChange={(e) => setNuevoNombre(e.target.value)}
                  placeholder="Ej. Josué Dev"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all"
                />
              </div>
              
              <div>
                <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">Rol del Sistema</label>
                <select
                  value={nuevoRol}
                  onChange={(e) => setNuevoRol(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all cursor-pointer appearance-none"
                  style={{
                    backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><polyline points='6 9 12 15 18 9'></polyline></svg>")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 12px center',
                    backgroundSize: '16px'
                  }}
                >
                  <option value="Fullstack Developer" className="bg-slate-900 text-slate-200">Fullstack Developer</option>
                  <option value="Backend Developer" className="bg-slate-900 text-slate-200">Backend Developer</option>
                  <option value="UI/UX Designer" className="bg-slate-900 text-slate-200">UI/UX Designer</option>
                  <option value="QA Engineer" className="bg-slate-900 text-slate-200">QA Engineer</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full bg-sky-500 hover:bg-sky-600 active:bg-sky-700 text-slate-950 font-semibold py-2.5 rounded-xl transition-colors text-sm shadow-lg shadow-sky-500/10 mt-2"
              >
                Agregar a SQLite
              </button>
            </form>
          </section>

          {/* 5. TABLA DE REGISTROS */}
          <section className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
            <div className="p-6 border-b border-slate-800">
              <h2 className="text-xl font-semibold text-white">Registros Locales</h2>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-950/40 text-slate-400 text-xs uppercase tracking-wider border-b border-slate-800">
                    <th className="py-3 px-6 font-medium">ID</th>
                    <th className="py-3 px-6 font-medium">Usuario</th>
                    <th className="py-3 px-6 font-medium">Rol</th>
                    <th className="py-3 px-6 font-medium">Estado</th>
                    <th className="py-3 px-6 text-right font-medium">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50 text-sm">
                  {usuarios.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-slate-500 italic">
                        No hay usuarios guardados en la base de datos.
                      </td>
                    </tr>
                  ) : (
                    usuarios.map((u) => (
                      <tr key={u.id} className="hover:bg-slate-800/20 transition-colors">
                        <td className="py-3.5 px-6 font-mono text-slate-500">#{u.id}</td>
                        <td className="py-3.5 px-6 font-semibold text-white">{u.nombre}</td>
                        <td className="py-3.5 px-6 text-slate-300">{u.rol}</td>
                        <td className="py-3.5 px-6">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            {u.estado}
                          </span>
                        </td>
                        <td className="py-3.5 px-6 text-right">
                          <button
                            onClick={() => eliminarUsuario(u.id)}
                            className="text-slate-500 hover:text-rose-400 p-1 rounded transition-colors cursor-pointer"
                            title="Eliminar"
                          >
                            🗑️
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </div>

      </main>
    </div>
  );
}

export default App;
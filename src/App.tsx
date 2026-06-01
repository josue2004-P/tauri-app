import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import PrivateRoute from "./components/Routes/PrivateRoute";; 
import PublicRoute from "./components/Routes/PublicRoute"; 
import { RoleGuard } from "./components/Routes/RoleGuard";
import AuthLoader from "./components/Routes/AuthLoader";

import { ScrollToTop } from "./components/common/ScrollToTop";

import AppLayout from "./layout/AppLayout";

import Home from "./pages/Dashboard/Home";
import SignIn from "./pages/AuthPages/SignIn";
import SignUp from "./pages/AuthPages/SignUp";
import NotFound from "./pages/OtherPage/NotFound";

import CategoriaTicketsPage from "./pages/Tickets/CategoriaTicketsPage";
import CreateCategoryPage from "./pages/Tickets/CreateCategoryPage";
import EditCategoryPage from "./pages/Tickets/EditCategoryPage";

import TicketsPage from "./pages/Tickets/TicketsPage";
import CreateTicketPage from "./pages/Tickets/CreateTicketPage";
import EditTicketPage from "./pages/Tickets/EditTicketPage";


export default function App() {
  return (
     <Router>
      <ScrollToTop />

      <AuthLoader />

      <Routes>
        {/* --- RUTAS PRIVADAS --- */}
        <Route
          path="/"
          element = {
            <PrivateRoute>
              <AppLayout />
            </PrivateRoute>
          }
        >
          {/* 1. Rutas accesibles por CUALQUIER usuario autenticado */}
          <Route index element={<Home />} />
          <Route path="tickets" element={<TicketsPage />} />
          <Route path="tickets/nuevo" element={<CreateTicketPage />} />
          <Route path="tickets/editar/:id" element={<EditTicketPage />} />

          {/* 2. Sub-bloque protegido: Solo para ADMINISTRADORES */}
          <Route element={<RoleGuard allowedRoles={["administrador"]} />}>
            <Route path="categoria-tickets" element={<CategoriaTicketsPage />} />
            <Route path="categoria-tickets/nuevo" element={<CreateCategoryPage />} />
            <Route path="categoria-tickets/editar/:id" element={<EditCategoryPage />} />
          </Route>
          
        </Route>

        {/* --- RUTAS PÚBLICAS --- */}
        <Route
          path="/signin"
          element={
            <PublicRoute>
              <SignIn />
            </PublicRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <PublicRoute>
              <SignUp />
            </PublicRoute>
          }
        />

        {/* Página 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  )
}

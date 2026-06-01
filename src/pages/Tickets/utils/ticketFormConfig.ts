import * as Yup from "yup";
import type { Ticket, TicketPriorityType, TicketFormValues } from "../../../types/ticket";

// 1. Esquema de Validación de Yup
export const TicketSchema = Yup.object().shape({
  asunto: Yup.string()
    .min(5, "El asunto debe tener al menos 5 caracteres")
    .required("El asunto es requerido"),
  descripcion: Yup.string()
    .required("La descripción es requerida"),
  prioridad: Yup.string()
    .oneOf(['baja', 'media', 'alta'], "Prioridad no válida")
    .required("La prioridad es requerida"),
  categoriaId: Yup.number()
    .required("La categoría es requerida"),
});

// 2. Función para obtener los valores iniciales limpios
export const getInitialValues = (initialData: Ticket | null | undefined): TicketFormValues => ({
  asunto: initialData?.asunto || "",
  descripcion: initialData?.descripcion || "",
  prioridad: (initialData?.prioridad as TicketPriorityType) || "media",
  categoriaId: initialData?.categoria?.id ? Number(initialData.categoria.id) : "",
  evidencias: [],
});

// 3. Opciones estáticas de Prioridad
export const priorityOptions = [
  { value: "baja", label: "Baja" },
  { value: "media", label: "Media" },
  { value: "alta", label: "Alta" },
];

// 4. Transformador para las opciones de Categoría
export const formatCategoryOptions = (categories: { id: number; nombre: string }[]) => 
  categories.map(cat => ({
    value: String(cat.id),
    label: cat.nombre
  }));
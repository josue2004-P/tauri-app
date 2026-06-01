import * as Yup from "yup";
import type { TicketCategory, TicketCategoryFormValues } from "../../../types/ticketCategory";

export const CategorySchema = Yup.object().shape({
  nombre: Yup.string()
    .min(3, "Mínimo 3 caracteres")
    .required("El nombre es requerido"),
  descripcion: Yup.string()
    .min(10, "Descripción demasiado corta")
    .required("La descripción es requerida"),
  slaHoras: Yup.number()
    .min(1, "Mínimo 1 hora")
    .required("El SLA es requerido"),
  activo: Yup.number().required(),
});

export const getCategoryInitialValues = (initialData: TicketCategory | null | undefined): TicketCategoryFormValues => ({
  nombre: initialData?.nombre || "",
  descripcion: initialData?.descripcion || "",
  slaHoras: initialData?.slaHoras || 24,
  activo: initialData?.activo ?? 1,
});

export const statusOptions = [
  { value: "1", label: "Activa" },
  { value: "0", label: "Inactiva" },
];
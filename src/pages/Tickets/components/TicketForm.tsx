import type { FC } from "react";
import { Formik, Form } from "formik";
import { useNavigate } from "react-router-dom";

import Button from "../../../components/ui/button/Button";
import Input from "../../../components/form/input/InputField";
import Label from "../../../components/form/Label";
import Select from "../../../components/form/Select";
import TextArea from "../../../components/form/input/TextArea";
import GroupFileInput from "../../../components/form/input/GroupFileInput";

import type { 
  Ticket, 
  TicketFormValues
} from "../../../types/ticket";

import { 
  TicketSchema, 
  getInitialValues, 
  priorityOptions, 
  formatCategoryOptions 
} from "../utils/ticketFormConfig";


interface TicketFormProps {
  initialData?: Ticket | null;
  categories: { id: number; nombre: string }[];
  onSubmit: (values: TicketFormValues & { evidencias: File[] }) => void;
  isLoading?: boolean;
}

const TicketForm: FC<TicketFormProps> = ({ initialData, categories, onSubmit, isLoading }) => {
  
  const initialValues = getInitialValues(initialData);
  const categoryOptions = formatCategoryOptions(categories);
  const navigate = useNavigate();
  
  return (
    <Formik
      initialValues={{ ...initialValues, evidencia: [] }}
      validationSchema={TicketSchema}
      enableReinitialize
      onSubmit={(values) => onSubmit(values)}
    >
      {({ values, errors, touched, handleChange, setFieldValue }) => (
        <Form className="space-y-5">
          <div>
            <Label htmlFor="asunto">Asunto del Requerimiento</Label>
            <Input
              id="asunto"
              name="asunto"
              placeholder="Ej: Fallo en conexión de red"
              value={values.asunto}
              onChange={handleChange}
              error={touched.asunto && !!errors.asunto}
              hint={touched.asunto && errors.asunto ? errors.asunto : ""}
              disabled={isLoading}
            />
          </div>

          <div>
            <Label htmlFor="descripcion">Descripción Detallada</Label>
            <TextArea
              id="descripcion"
              placeholder="Describe el problema o solicitud..."
              value={values.descripcion}
              onChange={(val) => setFieldValue("descripcion", val)}
              error={touched.descripcion && !!errors.descripcion}
              hint={touched.descripcion && errors.descripcion ? errors.descripcion : ""}
              disabled={isLoading}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="categoriaId">Categoría</Label>
              <Select
                options={categoryOptions}
                placeholder="Seleccione categoría"
                defaultValue={String(values.categoriaId)}
                onChange={(val) => setFieldValue("categoriaId", Number(val))}
              />
              {touched.categoriaId && errors.categoriaId && (
                <span className="text-xs text-error-500">{errors.categoriaId}</span>
              )}
            </div>

            <div>
              <Label htmlFor="prioridad">Prioridad</Label>
              <Select
                options={priorityOptions}
                defaultValue={values.prioridad}
                onChange={(val) => setFieldValue("prioridad", val)}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="evidencias">Imágenes de Evidencia (Máx. 5)</Label>
            <GroupFileInput
              id="evidencias"
              maxFiles={5}
              disabled={isLoading}
              onChange={(files) => {
                setFieldValue("evidencias", files);
              }}
            />
            {touched.evidencias && errors.evidencias && (
              <span className="text-xs text-rose-500 mt-1 block">{String(errors.evidencias)}</span>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4">
              {/* Botón Cancelar */}
              <Button
                type="button"
                variant="outline"
                size="sm" 
                onClick={() => navigate("/tickets")} 
              >
                Cancelar
              </Button>

              {/* Botón Guardar / Actualizar */}
              <Button
                type="submit"
                variant="primary"
                size="sm"
                disabled={isLoading}
              >
                {isLoading ? "Cargando..." : initialData ? "Actualizar" : "Guardar"}
              </Button>
            </div>
        </Form>
      )}
    </Formik>
  );
};

export default TicketForm;
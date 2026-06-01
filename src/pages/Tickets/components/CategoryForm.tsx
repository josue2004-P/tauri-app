import type { FC } from "react";
import { useNavigate } from "react-router";
import { Formik, Form } from "formik";

import Label from "../../../components/form/Label";
import Input from "../../../components/form/input/InputField";
import TextArea from "../../../components/form/input/TextArea";
import Select from "../../../components/form/Select";
import Button from "../../../components/ui/button/Button";

import type { TicketCategory,TicketCategoryFormValues } from "../../../types/ticketCategory";

import { 
  CategorySchema, 
  getCategoryInitialValues, 
  statusOptions 
} from "../utils/categoryFormConfig";

interface CategoryFormProps {
  initialData?: TicketCategory | null;
  onSubmit: (data: TicketCategoryFormValues) => void; 
  isLoading?: boolean;
}

const CategoryForm: FC<CategoryFormProps> = ({ initialData, onSubmit, isLoading }) => {

 const initialValues = getCategoryInitialValues(initialData);

    const navigate = useNavigate();
    return (
    <Formik
      initialValues={initialValues}
      validationSchema={CategorySchema}
      enableReinitialize
      onSubmit={(values) => onSubmit(values)}
    >
      {({ values, errors, touched, handleChange, setFieldValue }) => (
        <Form className="space-y-5">
          <div>
            <Label htmlFor="nombre">Nombre</Label>
            <Input
              id="nombre"
              name="nombre"
              value={values.nombre}
              onChange={handleChange}
              error={touched.nombre && !!errors.nombre}
              hint={touched.nombre && errors.nombre ? errors.nombre : ""}
              disabled={isLoading}
            />
          </div>

          <div>
            <Label htmlFor="descripcion">Descripción</Label>
            <TextArea
              id="descripcion"
              placeholder="Ingresa la descripción"
              value={values.descripcion}
              onChange={(val) => setFieldValue("descripcion", val)}
              error={touched.descripcion && !!errors.descripcion}
              hint={touched.descripcion && errors.descripcion ? errors.descripcion : ""}
              disabled={isLoading}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="slaHoras">SLA (Horas)</Label>
              <Input
                type="number"
                id="slaHoras"
                name="slaHoras"
                value={values.slaHoras}
                onChange={handleChange}
                error={touched.slaHoras && !!errors.slaHoras}
                hint={touched.slaHoras && errors.slaHoras ? errors.slaHoras : ""}
                disabled={isLoading}
              />
            </div>

            <div>
              <Label htmlFor="activo">Estado</Label>
              <Select
                options={statusOptions}
                defaultValue={String(values.activo)}
                onChange={(val) => setFieldValue("activo", Number(val))}
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
              {/* Botón Cancelar */}
              <Button
                type="button"
                variant="outline"
                size="sm" 
                onClick={() => navigate("/categoria-tickets")} 
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

export default CategoryForm;
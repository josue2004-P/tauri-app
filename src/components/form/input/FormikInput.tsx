import { useField } from "formik";
import Input from "./InputField";

interface FormikInputsProps {
  name: string;
  type?: string;
  placeholder?: string;
  [key: string]: any;
}

export const FormikInput: React.FC<FormikInputsProps> = ({
  ...props
}) => {
  const [field, meta] = useField(props.name);
  const hasError = meta.touched && Boolean(meta.error);
  const isSuccess = meta.touched && !meta.error;

  return (
    <Input
      {...field}
      {...props}
      error={hasError}
      success={isSuccess}
      hint={hasError ? meta.error : props.hint}
    />
  );
};

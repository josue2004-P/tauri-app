import { useField } from "formik";
import Select from "./Select";

interface Option {
  value: string;
  label: string;
}

interface FormikSelectProps {
  name: string;
  options: Option[];
  placeholder?: string;
  className?: string;
  hint?: string;
}

export const FormikSelect: React.FC<FormikSelectProps> = ({
  options,
  placeholder,
  className,
  hint,
  ...props
}) => {
  const [field, meta, helpers] = useField(props.name);
  const hasError = meta.touched && Boolean(meta.error);

  return (
    <>
      <Select
        {...props}
        options={options}
        placeholder={placeholder}
        defaultValue={field.value}
        onChange={(value) => helpers.setValue(value)}
        className={`${className} ${hasError ? "border-error-500 focus:border-error-500 focus:ring-error-500/20" : ""}`}
      />

      {(hasError || hint) && (
        <p
          className={`mt-1.5 text-xs ${hasError ? "text-error-500" : "text-gray-500"}`}
        >
          {hasError ? meta.error : hint}
        </p>
      )}
    </>
  );
};

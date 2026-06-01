import Swal from "sweetalert2";

export const showAlert = (
  title: string,
  text: string,
  type: "success" | "error" | "warning" = "success"
) => {
  if (typeof window !== "undefined") {
    Swal.fire({
      title,
      text,
      icon: type,
      confirmButtonText: "Aceptar",
      confirmButtonColor:
        type === "success"
          ? "#2563EB" // azul
          : type === "error"
          ? "#DC2626" // rojo
          : "#FBBF24", // amarillo para warning
    });
  }
};

// Funciones helper para cada tipo
export const showSuccess = (title: string, text: string) =>
  showAlert(title, text, "success");

export const showError = (title: string, text: string) =>
  showAlert(title, text, "error");

export const showWarning = (title: string, text: string) =>
  showAlert(title, text, "warning");

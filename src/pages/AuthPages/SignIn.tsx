import PageMeta from "../../components/common/PageMeta";
import AuthLayout from "./AuthPageLayout";
import SignInForm from "../../components/auth/SignInForm";

export default function SignIn() {
  return (
    <>
      <PageMeta
        title="Iniciar Sesión | Sistema de Tickets"
        description="Panel de acceso para la gestión de tickets de Indheca y Tibernal"
      />
      <AuthLayout>
        <SignInForm />
      </AuthLayout>
    </>
  );
}
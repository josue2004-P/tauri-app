import { render, screen, fireEvent, waitFor } from "@testing-library/react/pure";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { MemoryRouter } from "react-router";
import SignInForm from "./SignInForm";
import { useAuth } from "../../hooks/useAuth";

// 1. Mockeamos el hook useAuth
vi.mock("../../hooks/useAuth", () => ({
  useAuth: vi.fn(),
}));

const mockedUseAuth = vi.mocked(useAuth);

describe("SignInForm Component", () => {
  const mockStartLogin = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    
    mockedUseAuth.mockImplementation(() => ({
      id: undefined,
      token: undefined,
      profiles: [],
      error: null,
      isLoggedIn: false,
      checking: false,
      startLogin: mockStartLogin,
      startRenewToken: vi.fn(() => Promise.resolve()),
      startLogout: vi.fn(),
    }));
  });


  const renderComponent = () =>
    render(
      <MemoryRouter>
        <SignInForm />
      </MemoryRouter>
    );
    it("debe renderizar correctamente todos los campos del formulario", () => {
    renderComponent();

    expect(screen.getByPlaceholderText(/Usuario/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Enter your password/i)).toBeInTheDocument();

    expect(screen.getByText(/Selecciona una empresa/i)).toBeInTheDocument();

    const submitButton = screen.getByRole("button", { name: /^Sign in$/i });
    expect(submitButton).toBeInTheDocument();
    });

  it("debe actualizar los valores de los inputs cuando el usuario escribe", () => {
    renderComponent();

    const usuarioInput = screen.getByPlaceholderText(/Usuario/i) as HTMLInputElement;
    const passwordInput = screen.getByPlaceholderText(/Enter your password/i) as HTMLInputElement;

    fireEvent.change(usuarioInput, { target: { value: "JOSUE" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });

    expect(usuarioInput.value).toBe("JOSUE");
    expect(passwordInput.value).toBe("password123");
  });

    it("debe alternar la visibilidad de la contraseña al hacer clic en el icono del ojo", () => {
        renderComponent();
        
        const passwordInput = screen.getByPlaceholderText(/Enter your password/i) as HTMLInputElement;
        const toggleButton = screen.getByTestId("password-toggle");

        expect(passwordInput.type).toBe("password");

        fireEvent.click(toggleButton);
        expect(passwordInput.type).toBe("text");

        fireEvent.click(toggleButton);
        expect(passwordInput.type).toBe("password");
    });

    it("debe llamar a startLogin con los datos correctos al enviar el formulario", async () => {
        renderComponent();

        fireEvent.change(screen.getByPlaceholderText(/Usuario/i), {
        target: { value: "josue_perez" },
        });
        fireEvent.change(screen.getByPlaceholderText(/Enter your password/i), {
        target: { value: "admin123" },
        });

        const submitButton = screen.getByRole("button", { name: /^Sign in$/i });
        fireEvent.click(submitButton);

        await waitFor(() => {
        expect(mockStartLogin).toHaveBeenCalledWith(expect.objectContaining({
            usuario: "josue_perez",
            contrasena: "admin123",
        }));
        });
    });

    it("debe mostrar el estado de carga y deshabilitar el botón al enviar", async () => {
        mockStartLogin.mockReturnValue(new Promise(() => {}));

        renderComponent();

        // Ajuste para el botón principal
        const submitButton = screen.getByRole("button", { name: /^Sign in$/i });
        fireEvent.click(submitButton);

        expect(submitButton).toBeDisabled();
        expect(screen.getByText(/Signing in.../i)).toBeInTheDocument();
    });
});
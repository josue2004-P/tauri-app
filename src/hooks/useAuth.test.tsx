import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { MemoryRouter } from 'react-router-dom';
import { useAuth } from './useAuth';
import authReducer from '../store/slices/authSlice';
import { LoginUseCase } from '../application/auth';
import Cookies from 'js-cookie';
import Swal from 'sweetalert2';

// 1. Mocks de dependencias externas
vi.mock('../application/auth');
vi.mock('js-cookie');
vi.mock('sweetalert2', () => ({
  default: {
    fire: vi.fn(),
  },
}));

// Mock de navegación
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('useAuth Hook - Integration Test', () => {
  let store: any;

  // Wrapper para proveer el contexto de Redux y Router al hook
  const createWrapper = () => {
    store = configureStore({ 
      reducer: { auth: authReducer } 
    });
    return ({ children }: { children: React.ReactNode }) => (
      <Provider store={store}>
        <MemoryRouter>
          {children}
        </MemoryRouter>
      </Provider>
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('debe completar el flujo de login: ejecutar caso de uso, guardar cookie, actualizar store y navegar', async () => {
    const mockResponse = {
      access_token: 'valid-token',
      user: { id: 10, usuario: 'JOSUE' }
    };

    // Simulamos éxito en el caso de uso
    (LoginUseCase.prototype.execute as any).mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useAuth(), { wrapper: createWrapper() });

    // Ejecutamos la acción del hook
    await act(async () => {
      await result.current.startLogin({ usuario: 'JOSUE', contrasena: '123', empresaId: '1' });
    });

    // Verificaciones de integración:
    // 1. ¿Se guardó la cookie?
    expect(Cookies.set).toHaveBeenCalledWith('access_token', 'valid-token', expect.any(Object));
    
    // 2. ¿Se actualizó el estado de Redux?
    expect(result.current.isLoggedIn).toBe(true);
    expect(result.current.token).toBe('valid-token');
    expect(result.current.id).toBe("10");

    // 3. ¿Navegó al dashboard?
    expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
  });

  it('debe manejar errores: actualizar store con el error y mostrar SweetAlert2', async () => {
    const errorMsg = 'Error de credenciales';
    (LoginUseCase.prototype.execute as any).mockRejectedValue(new Error(errorMsg));

    const { result } = renderHook(() => useAuth(), { wrapper: createWrapper() });

    await act(async () => {
      await result.current.startLogin({ usuario: 'error', contrasena: '123', empresaId: '1' });
    });

    // Verificaciones de error:
    expect(result.current.error).toBe(errorMsg);
    expect(result.current.isLoggedIn).toBe(false);
    expect(Swal.fire).toHaveBeenCalledWith(expect.objectContaining({
      icon: 'error',
      text: errorMsg
    }));
  });

  it('debe limpiar todo al ejecutar startLogout', () => {
    const { result } = renderHook(() => useAuth(), { wrapper: createWrapper() });

    act(() => {
      result.current.startLogout();
    });

    expect(Cookies.remove).toHaveBeenCalledWith('access_token');
    expect(result.current.isLoggedIn).toBe(false);
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });
});

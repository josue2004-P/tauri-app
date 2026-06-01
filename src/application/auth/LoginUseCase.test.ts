import { describe, it, expect, vi, beforeEach } from 'vitest';
import { LoginUseCase } from './LoginUseCase';
import { loginRequest } from '../../services/authService';
import type { LoginDto, LoginResponse } from '../../types/auth';

// 1. Mockeamos el servicio de infraestructura (el archivo que hace la petición axios)
vi.mock('../../services/authService', () => ({
  loginRequest: vi.fn(),
}));

describe('LoginUseCase', () => {
  let loginUseCase: LoginUseCase;

  // Datos de prueba (Fixtures)
  const mockLoginDto: LoginDto = {
    usuario: 'JOSUE',
    contrasena: '123456',
    empresaId: '1',
  };

  const mockResponse: LoginResponse = {
    access_token: 'fake-jwt-token',
    user: {
      id: 1,
      nombre: 'Josué Pérez',
      sistema: 'S1',
    },
  };

  beforeEach(() => {
    loginUseCase = new LoginUseCase();
    vi.clearAllMocks(); // Limpia el historial de llamadas de los mocks entre tests
  });

  it('debe ejecutar loginRequest con los parámetros correctos y devolver la respuesta exitosa', async () => {
    // 2. Simulamos que el servicio de infraestructura responde con éxito
    (loginRequest as any).mockResolvedValue(mockResponse);

    // 3. Ejecutamos el caso de uso
    const result = await loginUseCase.execute(mockLoginDto);

    // 4. Verificaciones (Assertions)
    // Comprobamos que el servicio fue llamado con los datos exactos del DTO
    expect(loginRequest).toHaveBeenCalledWith(mockLoginDto);
    expect(loginRequest).toHaveBeenCalledTimes(1);

    // Comprobamos que el resultado del caso de uso es el que devolvió el servicio
    expect(result).toEqual(mockResponse);
    expect(result.access_token).toBe('fake-jwt-token');
  });

  it('debe propagar el error si el servicio loginRequest falla', async () => {
    // Simulamos un error de red o de credenciales
    const errorMessage = 'Credenciales inválidas';
    (loginRequest as any).mockRejectedValue(new Error(errorMessage));

    // Verificamos que el error se lance correctamente hacia el hook
    await expect(loginUseCase.execute(mockLoginDto)).rejects.toThrow(errorMessage);
  });
});
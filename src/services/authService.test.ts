import { describe, it, expect, vi, beforeEach } from 'vitest';
import { loginRequest, renewTokenRequest } from './authService';
import { axiosClient } from '../infrastructure/api/AxiosClient';
import Cookies from 'js-cookie';

// 1. Mockeamos el cliente de Axios
vi.mock('../infrastructure/api/AxiosClient', () => ({
  axiosClient: {
    post: vi.fn(),
    get: vi.fn(),
  },
}));

// 2. Mockeamos js-cookie de forma simple y dejamos que TypeScript use los tipos de @types/js-cookie
vi.mock('js-cookie', () => ({
  default: {
    get: vi.fn(),
  },
}));

const mockedGetCookie = Cookies.get as unknown as {
  mockImplementation: (fn: (name: string) => string | undefined) => unknown;
};

describe('authService - Infrastructure Layer', () => {
  
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('loginRequest', () => {
    it('debe realizar una petición POST a /auth/login con los datos del DTO', async () => {
      const mockDto = { usuario: 'JOSUE', contrasena: '123', empresaId: '1' };
      const mockResponse = { data: { access_token: 'abc-123', user: { id: 1 } } };
      
      vi.mocked(axiosClient.post).mockResolvedValue(mockResponse);

      const result = await loginRequest(mockDto);

      expect(axiosClient.post).toHaveBeenCalledWith('/auth/login', mockDto);
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('renewTokenRequest', () => {
    it('debe obtener el token de las cookies y enviarlo en los headers', async () => {
      const mockToken = 'token-guardado-en-cookies';
      const mockResponse = { data: { access_token: 'nuevo-token', user: { id: 1 } } };
      
      mockedGetCookie.mockImplementation(() => mockToken);
      vi.mocked(axiosClient.get).mockResolvedValue(mockResponse);

      const result = await renewTokenRequest();

      expect(Cookies.get).toHaveBeenCalledWith('access_token');

      expect(axiosClient.get).toHaveBeenCalledWith('/auth/renew-token', {
        headers: {
          'Authorization': `Bearer ${mockToken}`
        }
      });

      expect(result).toEqual(mockResponse.data);
    });

    it('debe enviar un string vacío si la cookie access_token no existe', async () => {
      mockedGetCookie.mockImplementation(() => undefined);
      vi.mocked(axiosClient.get).mockResolvedValue({ data: {} });

      await renewTokenRequest();

      expect(axiosClient.get).toHaveBeenCalledWith('/auth/renew-token', {
        headers: {
          'Authorization': 'Bearer '
        }
      });
    });
  });
});
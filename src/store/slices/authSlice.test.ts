import { describe, it, expect } from 'vitest';
import authReducer, { onLogin, onLogout, onSetError } from './authSlice';

describe('authSlice Unit Tests', () => {
  
  const initialState = {
    id: undefined, 
    token: undefined, 
    profiles: [],
    isLoggedIn: false,
    error: null,
    checking: true,
  };

  it('debe retornar el estado inicial por defecto', () => {
    const state = authReducer(undefined, { type: '@@INIT' });
    expect(state).toEqual(initialState);
  });

  it('debe manejar onLogin correctamente y establecer la sesión', () => {
    const loginPayload = {
      id: '1',
      token: 'fake-jwt-token-123',
      profiles: [],
    };

    const state = authReducer(initialState, onLogin(loginPayload));

    expect(state.isLoggedIn).toBe(true);
    expect(state.checking).toBe(false);
    expect(state.token).toBe(loginPayload.token);
    expect(state.id).toBe(loginPayload.id);
    expect(state.error).toBeNull();
  });

  it('debe manejar onLogout y limpiar el estado de autenticación', () => {
    const authenticatedState = {
      id: '1',
      token: 'some-token',
      profiles: [],
      isLoggedIn: true,
      checking: false,
      error: null,
    };

    const state = authReducer(authenticatedState, onLogout());

    expect(state.isLoggedIn).toBe(false);
    expect(state.checking).toBe(false); 
    expect(state.token).toBeUndefined(); 
    expect(state.id).toBeUndefined();   
    expect(state.profiles).toEqual([]);
  });

  it('debe manejar onSetError y guardar el mensaje de error', () => {
    const errorMsg = 'Credenciales incorrectas';
    const state = authReducer(initialState, onSetError(errorMsg));

    expect(state.error).toBe(errorMsg);
    expect(state.isLoggedIn).toBe(false);
    expect(state.checking).toBe(false);
  });
});
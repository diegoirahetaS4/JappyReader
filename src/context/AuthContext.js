import React, { createContext, useState, useContext, useEffect } from 'react';
import authService from '../services/authService';

/**
 * Contexto de autenticación
 * Proporciona el estado de autenticación y funciones relacionadas a toda la app
 */
const AuthContext = createContext({});

/**
 * Hook personalizado para acceder al contexto de autenticación
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

/**
 * Provider del contexto de autenticación
 * Envuelve la aplicación para proporcionar estado de autenticación global
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  /**
   * Verifica si hay una sesión activa al iniciar la app
   */
  useEffect(() => {
    checkAuthStatus();
  }, []);

  /**
   * Verifica el estado de autenticación actual
   */
  const checkAuthStatus = async () => {
    try {
      const isAuth = await authService.isAuthenticated();

      if (isAuth) {
        const userData = await authService.getUserData();
        setUser(userData);
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Error verificando estado de autenticación:', error);
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Inicia sesión del usuario
   * @param {string} email
   * @param {string} password
   */
  const login = async (email, password) => {
    const result = await authService.login(email, password);

    if (result.success) {
      setUser(result.user);
      setIsAuthenticated(true);
      // Re-verificar el estado para actualizar la UI
      await checkAuthStatus();
    }

    return result;
  };

  /**
   * Cierra la sesión del usuario
   */
  const logout = async () => {
    const result = await authService.logout();

    if (result.success) {
      setUser(null);
      setIsAuthenticated(false);
    }

    return result;
  };

  /**
   * Obtiene el token de autenticación actual
   */
  const getToken = async () => {
    return await authService.getToken();
  };

  /**
   * Obtiene el header de autorización para peticiones HTTP
   */
  const getAuthHeader = async () => {
    return await authService.getAuthHeader();
  };

  // Valor del contexto que se provee a los componentes hijos
  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    logout,
    getToken,
    getAuthHeader,
    checkAuthStatus
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;

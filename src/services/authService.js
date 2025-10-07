import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CONFIG } from '../config/environment';

/**
 * Servicio de autenticación con Firebase
 * Maneja login, logout y persistencia de sesión
 */
class AuthService {
  constructor() {
    // Clave para almacenar el token en AsyncStorage
    this.TOKEN_KEY = '@jappy_auth_token';
    this.USER_KEY = '@jappy_user_data';
  }

  /**
   * Realiza el login con Firebase Authentication
   * @param {string} email - Email del usuario
   * @param {string} password - Contraseña del usuario
   * @returns {Promise<{success: boolean, user?: object, error?: string}>}
   */
  async login(email, password) {
    try {
      const response = await axios.post(CONFIG.authUrl, {
        email,
        password,
        returnSecureToken: true
      });

      // Extraer datos de la respuesta de Firebase
      const {
        kind,
        localId,
        email: userEmail,
        displayName,
        idToken,
        registered,
        refreshToken,
        expiresIn
      } = response.data;

      // Crear objeto de usuario con los datos relevantes
      const userData = {
        kind,
        localId,
        email: userEmail,
        displayName: displayName || userEmail.split('@')[0],
        registered
      };

      // Guardar token y datos de usuario en AsyncStorage
      await AsyncStorage.setItem(this.TOKEN_KEY, idToken);
      await AsyncStorage.setItem(this.USER_KEY, JSON.stringify(userData));
      await AsyncStorage.setItem('@jappy_refresh_token', refreshToken);
      await AsyncStorage.setItem('@jappy_token_expires', (Date.now() + (expiresIn * 1000)).toString());

      return {
        success: true,
        user: userData,
        token: idToken
      };
    } catch (error) {
      console.error('Error en login:', error);

      // Manejar errores de Firebase
      let errorMessage = 'Error al iniciar sesión';

      if (error.response?.data?.error?.message) {
        const firebaseError = error.response.data.error.message;

        switch (firebaseError) {
          case 'EMAIL_NOT_FOUND':
            errorMessage = 'Email no registrado';
            break;
          case 'INVALID_PASSWORD':
            errorMessage = 'Contraseña incorrecta';
            break;
          case 'USER_DISABLED':
            errorMessage = 'Usuario deshabilitado';
            break;
          case 'INVALID_LOGIN_CREDENTIALS':
            errorMessage = 'Credenciales inválidas';
            break;
          default:
            errorMessage = firebaseError;
        }
      }

      return {
        success: false,
        error: errorMessage
      };
    }
  }

  /**
   * Cierra la sesión del usuario
   * Elimina el token y datos del usuario del almacenamiento
   */
  async logout() {
    try {
      await AsyncStorage.removeItem(this.TOKEN_KEY);
      await AsyncStorage.removeItem(this.USER_KEY);
      await AsyncStorage.removeItem('@jappy_refresh_token');
      await AsyncStorage.removeItem('@jappy_token_expires');
      return { success: true };
    } catch (error) {
      console.error('Error en logout:', error);
      return { success: false, error: 'Error al cerrar sesión' };
    }
  }

  /**
   * Obtiene el token almacenado
   * @returns {Promise<string|null>}
   */
  async getToken() {
    try {
      return await AsyncStorage.getItem(this.TOKEN_KEY);
    } catch (error) {
      console.error('Error obteniendo token:', error);
      return null;
    }
  }

  /**
   * Obtiene los datos del usuario almacenados
   * @returns {Promise<object|null>}
   */
  async getUserData() {
    try {
      const userData = await AsyncStorage.getItem(this.USER_KEY);
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error obteniendo datos de usuario:', error);
      return null;
    }
  }

  /**
   * Verifica si hay una sesión activa válida
   * @returns {Promise<boolean>}
   */
  async isAuthenticated() {
    try {
      const token = await this.getToken();
      const expiresAt = await AsyncStorage.getItem('@jappy_token_expires');

      if (!token || !expiresAt) {
        return false;
      }

      // Verificar si el token ha expirado
      const now = Date.now();
      if (now >= parseInt(expiresAt)) {
        // Token expirado, limpiar datos
        await this.logout();
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error verificando autenticación:', error);
      return false;
    }
  }

  /**
   * Obtiene el token de autorización para las peticiones HTTP
   * @returns {Promise<string|null>}
   */
  async getAuthHeader() {
    const token = await this.getToken();
    return token ? `Bearer ${token}` : null;
  }
}

export default new AuthService();

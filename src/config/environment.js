/**
 * Configuración de ambientes para la aplicación
 * Aquí se definen las URLs de los servicios según el ambiente
 */

// Definición de ambientes disponibles
const ENV = {
  DEV: 'development',
  QA: 'qa',
  UAT: 'uat',
  PRD: 'production'
};

// Configuración actual del ambiente (cambiar según corresponda)
const CURRENT_ENV = ENV.DEV;

// Configuración de URLs por ambiente
const ENV_CONFIG = {
  [ENV.DEV]: {
    authUrl: 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyCyMOz_PUWanNzXaVpL-11HpmcQsArUbhY',
    apiBaseUrl: 'https://jappygiftcards-api-617831826756.us-central1.run.app/api/v1'
  },
  [ENV.QA]: {
    // Configurar URL de autenticación para QA cuando esté disponible
    authUrl: 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=YOUR_QA_KEY',
    apiBaseUrl: 'https://jappygiftcards-api-qa.us-central1.run.app/api/v1'
  },
  [ENV.UAT]: {
    // Configurar URL de autenticación para UAT cuando esté disponible
    authUrl: 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=YOUR_UAT_KEY',
    apiBaseUrl: 'https://jappygiftcards-api-uat.us-central1.run.app/api/v1'
  },
  [ENV.PRD]: {
    // Configurar URL de autenticación para PRD cuando esté disponible
    authUrl: 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=YOUR_PRD_KEY',
    apiBaseUrl: 'https://jappygiftcards-api.us-central1.run.app/api/v1'
  }
};

// Exportar configuración del ambiente actual
export const CONFIG = ENV_CONFIG[CURRENT_ENV];

// Exportar enumeración de ambientes para facilitar cambios
export const ENVIRONMENTS = ENV;

// Exportar función para cambiar de ambiente (útil para testing)
export const setEnvironment = (env) => {
  if (ENV_CONFIG[env]) {
    return ENV_CONFIG[env];
  }
  throw new Error(`Ambiente ${env} no existe`);
};

// Exportar ambiente actual
export const CURRENT_ENVIRONMENT = CURRENT_ENV;

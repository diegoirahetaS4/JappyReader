// Configuración del merchant - personaliza estos valores según tu negocio
export const MERCHANT_CONFIG = {
  merchantId: "12121jkqhskja",
  locationId: "salkshq63", 
  posId: "asasuas",
  
  // Configuración adicional
  businessName: "Tu Negocio",
  locationName: "Ubicación Principal",
  
  // Configuración de la API
  apiBaseUrl: "https://jappygiftcards-api-617831826756.us-central1.run.app/api/v1",
  
  // Configuración de la app
  appName: "Giftcard Reader",
  version: "1.0.0"
};

// Función para generar números de recibo únicos
export const generateReceiptNumber = () => {
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `${timestamp}${random}`;
};

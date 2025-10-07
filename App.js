import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import LoginScreen from './src/screens/LoginScreen';
import RedeemScreen from './src/screens/RedeemScreen';

/**
 * Componente principal de navegación
 * Decide qué pantalla mostrar basándose en el estado de autenticación
 */
function AppNavigator() {
  const { isAuthenticated, loading } = useAuth();

  // Mostrar loading mientras se verifica la autenticación
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  // Mostrar LoginScreen si no está autenticado, de lo contrario RedeemScreen
  return (
    <>
      <StatusBar style="auto" />
      {!isAuthenticated ? <LoginScreen /> : <RedeemScreen />}
    </>
  );
}

/**
 * Componente raíz de la aplicación
 * Envuelve toda la app con el AuthProvider
 */
export default function App() {
  return (
    <AuthProvider>
      <AppNavigator />
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
});

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  StatusBar
} from 'react-native';
import AmountInput from '../components/AmountInput';
import QRScanner from '../components/QRScanner';
import GiftCardAPI from '../services/api';
import { MERCHANT_CONFIG, generateReceiptNumber } from '../config/merchant';

const RedeemScreen = () => {
  const [amount, setAmount] = useState(null);
  const [showScanner, setShowScanner] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentGiftCardId, setCurrentGiftCardId] = useState(null);

  const handleAmountSubmit = (amountMinor) => {
    setAmount(amountMinor);
    setShowScanner(true);
  };

  const handleQRScanned = async (giftCardId) => {
    setCurrentGiftCardId(giftCardId);
    setShowScanner(false);
    
    // Usar configuración del merchant
    const merchantData = {
      merchantId: MERCHANT_CONFIG.merchantId,
      locationId: MERCHANT_CONFIG.locationId,
      posId: MERCHANT_CONFIG.posId,
      receiptNumber: generateReceiptNumber()
    };

    await processRedemption(giftCardId, amount, merchantData);
  };

  const processRedemption = async (giftCardId, amountMinor, merchantData) => {
    setIsProcessing(true);
    
    try {
      const result = await GiftCardAPI.redeemGiftCard(
        giftCardId,
        amountMinor,
        0, // taxMinor
        merchantData.merchantId,
        merchantData.locationId,
        merchantData.posId,
        merchantData.receiptNumber.toString()
      );

      if (result.success) {
        Alert.alert(
          '¡Éxito!',
          `Giftcard redimido exitosamente por $${(amountMinor / 100).toFixed(2)}`,
          [
            {
              text: 'OK',
              onPress: () => resetForm()
            }
          ]
        );
      } else {
        Alert.alert(
          'Error',
          `Error al redimir el giftcard: ${result.error}`,
          [
            {
              text: 'Reintentar',
              onPress: () => setShowScanner(true)
            },
            {
              text: 'Cancelar',
              onPress: () => resetForm(),
              style: 'cancel'
            }
          ]
        );
      }
    } catch (error) {
      Alert.alert(
        'Error',
        'Error inesperado al procesar la redención',
        [
          {
            text: 'Reintentar',
            onPress: () => setShowScanner(true)
          },
          {
            text: 'Cancelar',
            onPress: () => resetForm(),
            style: 'cancel'
          }
        ]
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const resetForm = () => {
    setAmount(null);
    setShowScanner(false);
    setCurrentGiftCardId(null);
    setIsProcessing(false);
  };

  const handleCloseScanner = () => {
    setShowScanner(false);
  };

  if (showScanner) {
    return <QRScanner onQRScanned={handleQRScanned} onClose={handleCloseScanner} />;
  }

  if (isProcessing) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Procesando redención...</Text>
          <Text style={styles.loadingSubtext}>
            Giftcard: {currentGiftCardId}
          </Text>
          <Text style={styles.loadingSubtext}>
            Monto: ${(amount / 100).toFixed(2)}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      <View style={styles.header}>
        <Text style={styles.title}>Giftcard Reader</Text>
        <Text style={styles.subtitle}>Redención de Giftcards</Text>
      </View>

      <AmountInput onAmountSubmit={handleAmountSubmit} />

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Ingresa el monto y escanea el QR del giftcard
        </Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  loadingText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginTop: 20,
    textAlign: 'center',
  },
  loadingSubtext: {
    fontSize: 16,
    color: '#666',
    marginTop: 10,
    textAlign: 'center',
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default RedeemScreen;

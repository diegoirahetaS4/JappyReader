import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const AmountInput = ({ onAmountSubmit }) => {
  const [amount, setAmount] = useState('');
  const [isValid, setIsValid] = useState(true);

  const handleAmountChange = (text) => {
    // Solo permitir números y punto decimal
    const cleanText = text.replace(/[^0-9.]/g, '');
    setAmount(cleanText);

    // Validar que sea un número válido
    const numAmount = parseFloat(cleanText);
    setIsValid(!isNaN(numAmount) && numAmount > 0);
  };

  const handleSubmit = () => {
    const numAmount = parseFloat(amount);

    if (isNaN(numAmount) || numAmount <= 0) {
      Alert.alert('Error', 'Por favor ingresa un monto válido mayor a 0');
      return;
    }

    // Convertir a centavos (amountMinor)
    const amountMinor = Math.round(numAmount * 100);
    onAmountSubmit(amountMinor);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <View style={styles.inputContainer}>
        <Text style={styles.label}>Monto a descontar</Text>

        <View style={styles.amountInputWrapper}>
          <Text style={styles.currencySymbol}>$</Text>
          <TextInput
            style={[styles.input, !isValid && styles.inputError]}
            value={amount}
            onChangeText={handleAmountChange}
            placeholder="0.00"
            placeholderTextColor="#999"
            keyboardType="decimal-pad"
            autoFocus={true}
            onSubmitEditing={handleSubmit}
            returnKeyType="done"
          />
        </View>

        {!isValid && (
          <Text style={styles.errorText}>Ingresa un monto válido</Text>
        )}

            <TouchableOpacity
              style={styles.buttonWrapper}
              onPress={handleSubmit}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={['#ED203C', '#F9D421']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.continueButton}
              >
                <Text style={styles.continueButtonText}>Continuar</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  inputContainer: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 30,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  label: {
    fontSize: 22,
    fontWeight: '700',
    color: '#ED203C',
    marginBottom: 24,
    textAlign: 'center',
  },
  amountInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  currencySymbol: {
    fontSize: 48,
    fontWeight: '700',
    color: '#ED203C',
    marginRight: 8,
  },
  input: {
    fontSize: 48,
    fontWeight: '700',
    textAlign: 'center',
    padding: 12,
    borderBottomWidth: 3,
    borderBottomColor: '#F9D421',
    color: '#333',
    minWidth: 150,
  },
  inputError: {
    borderBottomColor: '#dc3545',
  },
  errorText: {
    color: '#dc3545',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 12,
  },
  buttonWrapper: {
    marginTop: 20,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#ED203C',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  continueButton: {
    paddingVertical: 18,
    paddingHorizontal: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  continueButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
});

export default AmountInput;

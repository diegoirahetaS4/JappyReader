import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform
} from 'react-native';

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
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Monto a descontar ($)</Text>
        <TextInput
          style={[styles.input, !isValid && styles.inputError]}
          value={amount}
          onChangeText={handleAmountChange}
          placeholder="0.00"
          keyboardType="decimal-pad"
          autoFocus={true}
          onSubmitEditing={handleSubmit}
          returnKeyType="done"
        />
        {!isValid && (
          <Text style={styles.errorText}>Ingresa un monto válido</Text>
        )}
      </View>
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
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  label: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
    textAlign: 'center',
  },
  input: {
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    padding: 16,
    borderWidth: 2,
    borderColor: '#e1e5e9',
    borderRadius: 8,
    backgroundColor: '#f8f9fa',
    color: '#333',
  },
  inputError: {
    borderColor: '#dc3545',
    backgroundColor: '#fff5f5',
  },
  errorText: {
    color: '#dc3545',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
  },
});

export default AmountInput;

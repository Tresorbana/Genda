import React, { useState } from 'react';
import { StyleSheet, View, Text, SafeAreaView, TextInput, Alert, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { Button } from '@/components/Button';
import { useProfileStore } from '@/store/profileStore';
import colors from '@/constants/colors';
import { Feather } from '@expo/vector-icons';

export default function AddPaymentScreen() {
  const router = useRouter();
  const { addPaymentMethod } = useProfileStore();
  
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [loading, setLoading] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [useWallet, setUseWallet] = useState(false);

  const formatCardNumber = (text: string) => {
    const cleaned = text.replace(/\s/g, '');
    const formatted = cleaned.replace(/(.{4})/g, '$1 ').trim();
    return formatted.substring(0, 19);
  };

  const formatExpiryDate = (text: string) => {
    const cleaned = text.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      return cleaned.substring(0, 2) + '/' + cleaned.substring(2, 4);
    }
    return cleaned;
  };

  const getCardType = (number: string) => {
    const cleaned = number.replace(/\s/g, '');
    if (cleaned.startsWith('4')) return 'Visa';
    if (cleaned.startsWith('5')) return 'Mastercard';
    if (cleaned.startsWith('3')) return 'American Express';
    return 'Visa';
  };

  const handleSave = async () => {
    if (!cardName.trim() || !cardNumber.trim() || !expiryDate.trim() || !cvv.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (cardNumber.replace(/\s/g, '').length < 16) {
      Alert.alert('Error', 'Please enter a valid card number');
      return;
    }

    if (expiryDate.length < 5) {
      Alert.alert('Error', 'Please enter a valid expiry date');
      return;
    }

    if (cvv.length < 3) {
      Alert.alert('Error', 'Please enter a valid CVV');
      return;
    }

    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const cleanedNumber = cardNumber.replace(/\s/g, '');
      const lastFour = cleanedNumber.slice(-4);
      const cardType = getCardType(cardNumber);
      
      addPaymentMethod({
        name: cardName,
        type: cardType as any,
        lastFour,
        expiryDate,
        isDefault: false,
      });
      
      setLoading(false);
      Alert.alert('Success', 'Payment method added successfully', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    }, 1000);
  };

  const handleApplyPromo = () => {
    setPromoCode('');
    Alert.alert('Promo code applied!');
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen 
        options={{ 
          title: 'Add Payment Method',
          headerStyle: { backgroundColor: colors.dark.background },
          headerTintColor: colors.dark.text,
          headerTitleStyle: { color: colors.dark.text },
        }} 
      />
      
      <ScrollView style={styles.content}>
        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Cardholder Name</Text>
            <TextInput
              style={styles.input}
              value={cardName}
              onChangeText={setCardName}
              placeholder="Enter cardholder name"
              placeholderTextColor={colors.dark.subtext}
              autoCapitalize="words"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Card Number</Text>
            <TextInput
              style={styles.input}
              value={cardNumber}
              onChangeText={(text) => setCardNumber(formatCardNumber(text))}
              placeholder="1234 5678 9012 3456"
              placeholderTextColor={colors.dark.subtext}
              keyboardType="numeric"
              maxLength={19}
            />
          </View>

          <View style={styles.row}>
            <View style={[styles.inputGroup, styles.halfWidth]}>
              <Text style={styles.label}>Expiry Date</Text>
              <TextInput
                style={styles.input}
                value={expiryDate}
                onChangeText={(text) => setExpiryDate(formatExpiryDate(text))}
                placeholder="MM/YY"
                placeholderTextColor={colors.dark.subtext}
                keyboardType="numeric"
                maxLength={5}
              />
            </View>

            <View style={[styles.inputGroup, styles.halfWidth]}>
              <Text style={styles.label}>CVV</Text>
              <TextInput
                style={styles.input}
                value={cvv}
                onChangeText={setCvv}
                placeholder="123"
                placeholderTextColor={colors.dark.subtext}
                keyboardType="numeric"
                maxLength={4}
                secureTextEntry
              />
            </View>
          </View>

          <View style={{ marginVertical: 16 }}>
            <Text style={{ color: '#fff', fontSize: 16, marginBottom: 8 }}>Promo Code</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <TextInput
                style={{ backgroundColor: '#fff', borderRadius: 8, padding: 8, width: 120, marginRight: 8 }}
                placeholder="Promo code"
                value={promoCode}
                onChangeText={setPromoCode}
              />
              <TouchableOpacity onPress={handleApplyPromo} style={{ backgroundColor: '#fff', borderRadius: 8, padding: 8 }}>
                <Text style={{ color: '#276EF1', fontWeight: 'bold' }}>Apply</Text>
              </TouchableOpacity>
            </View>
          </View>
          <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }} onPress={() => setUseWallet(!useWallet)}>
            <Feather name={useWallet ? 'check-square' : 'square'} size={20} color="#fff" style={{ marginRight: 8 }} />
            <Text style={{ color: '#fff' }}>Use Wallet Balance</Text>
          </TouchableOpacity>

          <View style={styles.infoBox}>
            <Text style={styles.infoText}>
              Your payment information is encrypted and secure. We never store your full card details.
            </Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          title="Add Payment Method"
          onPress={handleSave}
          loading={loading}
          style={styles.saveButton}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.dark.background,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  form: {
    flex: 1,
  },
  inputGroup: {
    marginBottom: 24,
  },
  halfWidth: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    gap: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.dark.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: colors.dark.card,
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    color: colors.dark.text,
    borderWidth: 1,
    borderColor: colors.dark.border,
  },
  infoBox: {
    backgroundColor: colors.dark.card,
    borderRadius: 8,
    padding: 16,
    marginTop: 16,
  },
  infoText: {
    fontSize: 14,
    color: colors.dark.subtext,
    textAlign: 'center',
    lineHeight: 20,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: colors.dark.border,
  },
  saveButton: {
    width: '100%',
  },
});
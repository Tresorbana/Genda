import React, { useState } from 'react';
import { StyleSheet, View, Text, SafeAreaView, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Button } from '@/components/Button';
import colors from '@/constants/colors';

export default function OtpScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState('');
  const target = params.email || params.phone;

  const handleVerify = async () => {
    if (code.length !== 6) {
      setError('Enter the 6-digit code');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const response = await fetch('http://localhost:4000/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: params.email, phone: params.phone, code }),
      });
      const data = await response.json();
      if (data.success) {
        Alert.alert('Verified!', 'OTP verified successfully', [
          { text: 'OK', onPress: () => router.back() }
        ]);
      } else {
        setError(data.error || 'Invalid code');
      }
    } catch (err: any) {
      setError(err.message || 'Network error');
    }
    setLoading(false);
  };

  const handleResend = async () => {
    setResending(true);
    setError('');
    try {
      const response = await fetch('http://localhost:4000/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: params.email, phone: params.phone }),
      });
      const data = await response.json();
      if (data.success) {
        Alert.alert('OTP Sent', 'A new code has been sent.');
      } else {
        setError(data.error || 'Failed to resend OTP');
      }
    } catch (err: any) {
      setError(err.message || 'Network error');
    }
    setResending(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Enter OTP</Text>
        <Text style={styles.subtitle}>
          Enter the 6-digit code sent to {params.email || params.phone}
        </Text>
        <TextInput
          style={styles.input}
          placeholder="123456"
          placeholderTextColor={colors.dark.subtext}
          value={code}
          onChangeText={setCode}
          keyboardType="number-pad"
          maxLength={6}
        />
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <Button title="Verify" onPress={handleVerify} loading={loading} style={styles.button} />
        <TouchableOpacity onPress={handleResend} disabled={resending} style={styles.resendBtn}>
          <Text style={styles.resendText}>{resending ? 'Resending...' : 'Resend Code'}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.dark.background,
    justifyContent: 'center',
  },
  content: {
    padding: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.dark.text,
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    color: colors.dark.subtext,
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    width: 180,
    height: 56,
    fontSize: 24,
    color: colors.dark.text,
    backgroundColor: colors.dark.card,
    borderRadius: 12,
    textAlign: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.dark.border,
  },
  button: {
    marginBottom: 16,
    width: 180,
  },
  resendBtn: {
    marginTop: 8,
  },
  resendText: {
    color: colors.primary,
    fontWeight: 'bold',
    fontSize: 16,
  },
  error: {
    color: 'red',
    marginBottom: 8,
    fontSize: 14,
  },
}); 
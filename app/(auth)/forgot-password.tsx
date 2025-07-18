import React, { useState } from 'react';
import { StyleSheet, View, Text, SafeAreaView, TextInput, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Button } from '@/components/Button';
import colors from '@/constants/colors';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSend = async () => {
    if (!email && !phone) {
      setError('Enter your email or phone number');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const response = await fetch('http://localhost:4000/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, phone }),
      });
      const data = await response.json();
      if (data.success) {
        Alert.alert('Reset Code Sent', 'Check your email or SMS for the code.', [
          { text: 'OK', onPress: () => router.replace({ pathname: '/(auth)/reset-password', params: { email, phone } }) }
        ]);
      } else {
        setError(data.error || 'Failed to send reset code');
      }
    } catch (err: any) {
      setError(err.message || 'Network error');
    }
    setLoading(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Forgot Password</Text>
        <Text style={styles.subtitle}>Enter your email or phone to receive a reset code.</Text>
        <TextInput
          style={styles.input}
          placeholder="Email address"
          placeholderTextColor={colors.dark.subtext}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
        />
        <Text style={{ color: colors.dark.subtext, marginVertical: 8 }}>or</Text>
        <TextInput
          style={styles.input}
          placeholder="Phone number"
          placeholderTextColor={colors.dark.subtext}
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
          autoCapitalize="none"
          autoComplete="tel"
        />
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <Button title="Send Reset Code" onPress={handleSend} loading={loading} style={styles.button} />
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
    width: 240,
    height: 56,
    fontSize: 18,
    color: colors.dark.text,
    backgroundColor: colors.dark.card,
    borderRadius: 12,
    textAlign: 'left',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colors.dark.border,
    paddingHorizontal: 16,
  },
  button: {
    marginTop: 16,
    width: 240,
  },
  error: {
    color: 'red',
    marginBottom: 8,
    fontSize: 14,
  },
}); 
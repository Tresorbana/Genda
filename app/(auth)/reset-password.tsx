import React, { useState } from 'react';
import { StyleSheet, View, Text, SafeAreaView, TextInput, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Button } from '@/components/Button';
import colors from '@/constants/colors';

export default function ResetPasswordScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleReset = async () => {
    if (code.length !== 6) {
      setError('Enter the 6-digit code');
      return;
    }
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const response = await fetch('http://localhost:4000/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: params.email, phone: params.phone, code, newPassword }),
      });
      const data = await response.json();
      if (data.success) {
        Alert.alert('Password Reset', 'Your password has been updated.', [
          { text: 'OK', onPress: () => router.replace('/(auth)/login') }
        ]);
      } else {
        setError(data.error || 'Failed to reset password');
      }
    } catch (err: any) {
      setError(err.message || 'Network error');
    }
    setLoading(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Reset Password</Text>
        <Text style={styles.subtitle}>Enter the code sent to your email or phone and set a new password.</Text>
        <TextInput
          style={styles.input}
          placeholder="Reset code"
          placeholderTextColor={colors.dark.subtext}
          value={code}
          onChangeText={setCode}
          keyboardType="number-pad"
          maxLength={6}
        />
        <TextInput
          style={styles.input}
          placeholder="New password"
          placeholderTextColor={colors.dark.subtext}
          value={newPassword}
          onChangeText={setNewPassword}
          secureTextEntry
        />
        <TextInput
          style={styles.input}
          placeholder="Confirm new password"
          placeholderTextColor={colors.dark.subtext}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
        />
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <Button title="Reset Password" onPress={handleReset} loading={loading} style={styles.button} />
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
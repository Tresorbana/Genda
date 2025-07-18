import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/store/authStore';
import colors from '@/constants/colors';
import { Button } from '@/components/Button';

export default function IndexScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome!</Text>
      <Text style={styles.subtitle}>Get started by registering or logging in:</Text>
      <Button
        title="Register"
        style={styles.roleButton}
        onPress={() => router.replace('./register-choice')}
      />
      <Button
        title="Login"
        style={styles.roleButton}
        onPress={() => router.replace('./login')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.dark.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: colors.dark.text,
    fontSize: 16,
    marginTop: 16,
  },
  driverButton: {
    marginTop: 32,
    width: 200,
    alignSelf: 'center',
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
    marginBottom: 32,
    textAlign: 'center',
  },
  roleButton: {
    marginTop: 16,
    width: 220,
    alignSelf: 'center',
  },
});
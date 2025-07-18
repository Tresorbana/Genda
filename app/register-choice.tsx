import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Button } from '@/components/Button';
import colors from '@/constants/colors';

export default function RegisterChoiceScreen() {
  const router = useRouter();
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register as:</Text>
      <Button
        title="I'm a Customer"
        style={styles.roleButton}
        onPress={() => router.replace('./(auth)/signup')}
      />
      <Button
        title="I'm a Driver"
        style={styles.roleButton}
        onPress={() => router.replace('./driver-signup')}
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
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.dark.text,
    marginBottom: 32,
  },
  roleButton: {
    marginTop: 16,
    width: 220,
    alignSelf: 'center',
  },
}); 
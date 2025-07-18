import React, { useState } from 'react';
import { StyleSheet, View, Text, SafeAreaView, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Button } from '@/components/Button';
import colors from '@/constants/colors';

export default function DriverEditProfileScreen() {
  // Placeholder initial values
  const [name, setName] = useState('John Doe');
  const [email, setEmail] = useState('john.driver@example.com');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSave = async () => {
    setLoading(true);
    // TODO: Save to backend
    setTimeout(() => {
      setLoading(false);
      Alert.alert('Profile Updated', 'Your profile has been updated.');
      router.back();
    }, 1000);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Edit Profile</Text>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Name</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Full Name"
            placeholderTextColor={colors.dark.subtext}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="Email"
            placeholderTextColor={colors.dark.subtext}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>
        <Button title="Save" onPress={handleSave} loading={loading} style={styles.saveButton} />
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
    padding: 24,
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.dark.text,
    marginBottom: 32,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 24,
  },
  label: {
    color: colors.dark.text,
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    backgroundColor: colors.dark.card,
    color: colors.dark.text,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: colors.dark.border,
  },
  saveButton: {
    marginTop: 16,
  },
}); 
import React, { useState } from 'react';
import { StyleSheet, View, Text, SafeAreaView, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { Image } from 'expo-image';
import { Camera, Save } from 'lucide-react-native';
import { Button } from '@/components/Button';
import { useAuthStore } from '@/store/authStore';
import colors from '@/constants/colors';

export default function PersonalInfoScreen() {
  const router = useRouter();
  const { user, updateUser } = useAuthStore();
  
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!name.trim() || !email.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      updateUser({ name, email });
      setLoading(false);
      Alert.alert('Success', 'Profile updated successfully', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    }, 1000);
  };

  const handleChangePhoto = () => {
    Alert.alert(
      'Change Photo',
      'Choose an option',
      [
        { text: 'Camera', onPress: () => console.log('Camera selected') },
        { text: 'Photo Library', onPress: () => console.log('Library selected') },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <Stack.Screen 
          options={{ 
            title: 'Personal Information',
            headerStyle: { backgroundColor: colors.dark.background },
            headerTintColor: colors.dark.text,
            headerTitleStyle: { color: colors.dark.text },
          }} 
        />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Please log in to edit your profile</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen 
        options={{ 
          title: 'Personal Information',
          headerStyle: { backgroundColor: colors.dark.background },
          headerTintColor: colors.dark.text,
          headerTitleStyle: { color: colors.dark.text },
        }} 
      />
      
      <ScrollView style={styles.content}>
        <View style={styles.photoSection}>
          <View style={styles.avatarContainer}>
            <Image 
              source={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}`} 
              style={styles.avatar} 
            />
            <TouchableOpacity style={styles.cameraButton} onPress={handleChangePhoto}>
              <Camera size={16} color={colors.common.white} />
            </TouchableOpacity>
          </View>
          <Text style={styles.photoText}>Tap to change photo</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Full Name</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Enter your full name"
              placeholderTextColor={colors.dark.subtext}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="Enter your email"
              placeholderTextColor={colors.dark.subtext}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.providerInfo}>
            <Text style={styles.providerLabel}>Account Type</Text>
            <Text style={styles.providerText}>
              {user.provider === 'google' ? 'Google Account' : 'Email Account'}
            </Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          title="Save Changes"
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
  photoSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  avatarContainer: {
    position: 'relative',
    width: 100,
    height: 100,
    borderRadius: 50,
    overflow: 'hidden',
    backgroundColor: colors.dark.card,
    marginBottom: 12,
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoText: {
    fontSize: 14,
    color: colors.dark.subtext,
  },
  form: {
    flex: 1,
  },
  inputGroup: {
    marginBottom: 24,
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
  providerInfo: {
    marginTop: 16,
    padding: 16,
    backgroundColor: colors.dark.card,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.dark.border,
  },
  providerLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.dark.text,
    marginBottom: 4,
  },
  providerText: {
    fontSize: 14,
    color: colors.primary,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: colors.dark.border,
  },
  saveButton: {
    width: '100%',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  errorText: {
    fontSize: 16,
    color: colors.dark.text,
    textAlign: 'center',
  },
});
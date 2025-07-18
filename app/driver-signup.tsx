import React, { useState } from 'react';
import { StyleSheet, View, Text, SafeAreaView, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter, Link } from 'expo-router';
import { User, Mail, Lock, Eye, EyeOff } from 'lucide-react-native';
import { Button } from '@/components/Button';
import { GoogleSignInButton } from '@/components/GoogleSignInButton';
import { useAuthStore } from '@/store/authStore';
import { AuthService } from '../services/authServices';
import colors from '@/constants/colors';
import * as ImagePicker from 'expo-image-picker';
import type { ImagePickerAsset } from 'expo-image-picker';

export default function DriverSignupScreen() {
  const router = useRouter();
  const { login, setLoading } = useAuthStore();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLocalLoading] = useState(false);
  const [carMake, setCarMake] = useState('');
  const [carModel, setCarModel] = useState('');
  const [carLicensePlate, setCarLicensePlate] = useState('');
  const [carPicture, setCarPicture] = useState('');
  const [calculatedPricePerKm, setCalculatedPricePerKm] = useState('');
  const [phone, setPhone] = useState('');
  const [profilePhoto, setProfilePhoto] = useState<ImagePickerAsset | null>(null);

  const validateForm = () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter your name');
      return false;
    }
    if (!email.trim()) {
      Alert.alert('Error', 'Please enter your email');
      return false;
    }
    if (!email.includes('@')) {
      Alert.alert('Error', 'Please enter a valid email address');
      return false;
    }
    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return false;
    }
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return false;
    }
    if (!carMake.trim() || !carModel.trim() || !carLicensePlate.trim() || !carPicture.trim()) {
      Alert.alert('Error', 'Please fill in all car details');
      return false;
    }
    return true;
  };

  React.useEffect(() => {
    // Example formula: base + model length * 0.2
    if (carMake && carModel) {
      const base = 1.5;
      const modelFactor = carModel.length * 0.2;
      setCalculatedPricePerKm((base + modelFactor).toFixed(2));
    } else {
      setCalculatedPricePerKm('');
    }
  }, [carMake, carModel]);

  const pickProfilePhoto = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      setProfilePhoto(result.assets[0]);
    }
  };

  const handleEmailSignup = async () => {
    if (!validateForm()) return;
    setLocalLoading(true);
    setLoading(true);
    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('phone', phone);
    formData.append('password', password);
    formData.append('role', 'driver');
    if (profilePhoto) {
      formData.append('profilePhoto', {
        uri: profilePhoto.uri,
        name: 'profile.jpg',
        type: 'image/jpeg',
      } as any);
    }
    const car = {
      make: carMake,
      model: carModel,
      licensePlate: carLicensePlate,
      picture: carPicture,
      pricePerKm: Number(calculatedPricePerKm),
    };
    formData.append('car', JSON.stringify(car));
    try {
      const response = await fetch('http://localhost:4000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'multipart/form-data' },
        body: formData,
      });
      const data = await response.json();
      if (data.success && data.user) {
        // Send OTP
        await fetch('http://localhost:4000/api/auth/send-otp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, phone }),
        });
        router.replace({ pathname: '/(auth)/otp', params: { email, phone } });
      } else {
        Alert.alert('Sign Up Failed', data.error || 'Please try again');
      }
    } catch (error: any) {
      Alert.alert('Sign Up Failed', error.message || 'Please try again');
    }
    setLocalLoading(false);
    setLoading(false);
  };

  const handleGoogleSignup = async () => {
    setLoading(true);
    
    const result = await AuthService.signInWithGoogle();
    
    if (result.success && result.user) {
      login({
        ...result.user,
        provider: 'google',
        avatar: result.user.picture || `https://ui-avatars.com/api/?name=${encodeURIComponent(result.user.name)}&background=276EF1&color=fff`,
      });
      router.replace('./driver-home');
    } else {
      Alert.alert('Sign Up Failed', result.error || 'Please try again');
    }

    setLoading(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        style={styles.content} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <Text style={styles.title}>Driver Registration</Text>
            <Text style={styles.subtitle}>Sign up to drive with us</Text>
          </View>

          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <User size={20} color={colors.dark.subtext} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Full name"
                placeholderTextColor={colors.dark.subtext}
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
                autoComplete="name"
              />
            </View>

            <View style={styles.inputContainer}>
              <Mail size={20} color={colors.dark.subtext} style={styles.inputIcon} />
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
            </View>

            <View style={styles.inputContainer}>
              <Lock size={20} color={colors.dark.subtext} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor={colors.dark.subtext}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoComplete="new-password"
              />
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff size={20} color={colors.dark.subtext} />
                ) : (
                  <Eye size={20} color={colors.dark.subtext} />
                )}
              </TouchableOpacity>
            </View>

            <View style={styles.inputContainer}>
              <Lock size={20} color={colors.dark.subtext} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Confirm password"
                placeholderTextColor={colors.dark.subtext}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showConfirmPassword}
                autoComplete="new-password"
              />
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <EyeOff size={20} color={colors.dark.subtext} />
                ) : (
                  <Eye size={20} color={colors.dark.subtext} />
                )}
              </TouchableOpacity>
            </View>

            <View style={styles.inputContainer}>
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
            </View>
            <TouchableOpacity style={[styles.inputContainer, { justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }]}
              onPress={pickProfilePhoto}>
              <Text style={{ color: colors.primary, fontWeight: 'bold', flex: 1 }}>
                {profilePhoto ? 'Change Profile Photo' : 'Add Profile Photo'}
              </Text>
              {profilePhoto && (
                <View style={{ marginLeft: 12 }}>
                  <Text style={{ color: colors.dark.text }}>✓</Text>
                </View>
              )}
            </TouchableOpacity>

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Car Make"
                placeholderTextColor={colors.dark.subtext}
                value={carMake}
                onChangeText={setCarMake}
                autoCapitalize="words"
              />
            </View>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Car Model"
                placeholderTextColor={colors.dark.subtext}
                value={carModel}
                onChangeText={setCarModel}
                autoCapitalize="words"
              />
            </View>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="License Plate"
                placeholderTextColor={colors.dark.subtext}
                value={carLicensePlate}
                onChangeText={setCarLicensePlate}
                autoCapitalize="characters"
              />
            </View>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Car Picture URL"
                placeholderTextColor={colors.dark.subtext}
                value={carPicture}
                onChangeText={setCarPicture}
                autoCapitalize="none"
              />
            </View>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Price per km (auto-calculated)"
                placeholderTextColor={colors.dark.subtext}
                value={calculatedPricePerKm}
                editable={false}
                keyboardType="decimal-pad"
              />
            </View>

            <View style={styles.termsContainer}>
              <Text style={styles.termsText}>
                By signing up, you agree to our{' '}
                <Text style={styles.termsLink}>Terms of Service</Text>
                {' '}and{' '}
                <Text style={styles.termsLink}>Privacy Policy</Text>
              </Text>
            </View>

            <Button
              title="Sign Up as Driver"
              onPress={handleEmailSignup}
              loading={loading}
              style={styles.signupButton}
            />

            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>or</Text>
              <View style={styles.dividerLine} />
            </View>

            <GoogleSignInButton onPress={handleGoogleSignup} />

            <View style={styles.footer}>
              <Text style={styles.footerText}>
                Already have a driver account?{' '}
                <Link href="./driver-login" style={styles.footerLink}>
                  Sign in
                </Link>
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
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
  },
  header: {
    marginTop: 40,
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.dark.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.dark.subtext,
  },
  form: {
    flex: 1,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.dark.card,
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.dark.border,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    height: 56,
    fontSize: 16,
    color: colors.dark.text,
  },
  eyeIcon: {
    padding: 4,
  },
  termsContainer: {
    marginBottom: 24,
  },
  termsText: {
    fontSize: 14,
    color: colors.dark.subtext,
    textAlign: 'center',
    lineHeight: 20,
  },
  termsLink: {
    color: colors.primary,
  },
  signupButton: {
    marginBottom: 24,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.dark.border,
  },
  dividerText: {
    marginHorizontal: 16,
    fontSize: 14,
    color: colors.dark.subtext,
  },
  footer: {
    marginTop: 24,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: colors.dark.subtext,
  },
  footerLink: {
    color: colors.primary,
    fontWeight: '500',
  },
}); 
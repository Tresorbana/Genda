import React, { useState } from 'react';
import { StyleSheet, View, Text, SafeAreaView, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter, Link } from 'expo-router';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react-native';
import { Button } from '@/components/Button';
import { GoogleSignInButton } from '@/components/GoogleSignInButton';
import { useAuthStore } from '@/store/authStore';
import { AuthService } from '../../services/authServices';
import colors from '@/constants/colors';
import { useAuthRequest } from 'expo-auth-session/providers/google';
import { makeRedirectUri, ResponseType } from 'expo-auth-session';

export default function LoginScreen() {
  const router = useRouter();
  const { login, setLoading } = useAuthStore();
  
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLocalLoading] = useState(false);

  const [request, response, promptAsync] = useAuthRequest({
    clientId: 'YOUR_GOOGLE_CLIENT_ID', // TODO: Replace with your actual Google OAuth client ID
    responseType: ResponseType.IdToken,
    redirectUri: makeRedirectUri({ native: 'your.app://redirect' }),
  });

  React.useEffect(() => {
    if (response?.type === 'success') {
      const { id_token } = response.params;
      // Send id_token to backend for verification and user creation/login
      (async () => {
        setLoading(true);
        try {
          const res = await fetch('http://localhost:4000/api/auth/google/callback', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ idToken: id_token }),
          });
          const data = await res.json();
          if (data.success && data.user) {
            login({
              ...data.user,
              provider: 'google',
              avatar: data.user.picture || `https://ui-avatars.com/api/?name=${encodeURIComponent(data.user.name)}&background=276EF1&color=fff`,
            });
            router.replace('/(tabs)');
          } else {
            Alert.alert('Login Failed', data.error || 'Please try again');
          }
        } catch (err: any) {
          Alert.alert('Login Failed', err.message || 'Please try again');
        }
        setLoading(false);
      })();
    }
  }, [response]);

  const handleEmailLogin = async () => {
    if (!identifier.trim() || !password.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLocalLoading(true);
    setLoading(true);

    const result = await AuthService.signInWithEmailOrPhone(identifier, password);
    
    if (result.success && result.user) {
      login({
        ...result.user,
        provider: 'email',
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(result.user.name)}&background=276EF1&color=fff`,
      });
      router.replace('/(tabs)');
    } else {
      Alert.alert('Login Failed', result.error || 'Please try again');
    }

    setLocalLoading(false);
    setLoading(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        style={styles.content} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Welcome back</Text>
          <Text style={styles.subtitle}>Sign in to your account</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Mail size={20} color={colors.dark.subtext} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Email or phone"
              placeholderTextColor={colors.dark.subtext}
              value={identifier}
              onChangeText={setIdentifier}
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
              autoComplete="password"
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

          <TouchableOpacity style={styles.forgotPassword} onPress={() => router.push('/(auth)/forgot-password')}>
            <Text style={styles.forgotPasswordText}>Forgot password?</Text>
          </TouchableOpacity>

          <Button
            title="Sign In"
            onPress={handleEmailLogin}
            loading={loading}
            style={styles.loginButton}
          />

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.dividerLine} />
          </View>

          <GoogleSignInButton onPress={() => promptAsync()} />

          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Don't have an account?{' '}
              <Link href="/(auth)/signup" style={styles.footerLink}>
                Sign up
              </Link>
            </Text>
          </View>

          <View style={styles.demoInfo}>
            <Text style={styles.demoText}>Demo credentials:</Text>
            <Text style={styles.demoCredentials}>Email: demo@example.com</Text>
            <Text style={styles.demoCredentials}>Password: password</Text>
          </View>
        </View>
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
    marginTop: 60,
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
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 24,
  },
  forgotPasswordText: {
    fontSize: 14,
    color: colors.primary,
  },
  loginButton: {
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
  demoInfo: {
    marginTop: 32,
    padding: 16,
    backgroundColor: colors.dark.card,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.dark.border,
  },
  demoText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.dark.text,
    marginBottom: 8,
  },
  demoCredentials: {
    fontSize: 12,
    color: colors.dark.subtext,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
});
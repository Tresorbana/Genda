// Mock AuthService for local authentication (no Firebase)
import * as AuthSession from 'expo-auth-session';
import * as AppleAuthentication from 'expo-apple-authentication';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: 'customer' | 'driver';
  picture?: string;
  balance?: number;
  rating?: number;
  car?: {
    make: string;
    model: string;
    licensePlate: string;
    picture: string;
    pricePerKm: number;
  };
}

export interface AuthResult {
  success: boolean;
  user?: UserProfile;
  error?: string;
}

export class AuthService {
  static async signUpWithEmail(name: string, email: string, password: string, role: 'customer' | 'driver', car?: UserProfile['car']): Promise<AuthResult> {
    try {
      const response = await fetch('http://localhost:4000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role, car })
      });
      const data = await response.json();
      if (data.success && data.user) {
        return { success: true, user: data.user };
      } else {
        return { success: false, error: data.error || 'Registration failed' };
      }
    } catch (error: any) {
      return { success: false, error: error.message || 'Network error' };
    }
  }

  static async signInWithEmailOrPhone(identifier: string, password: string): Promise<AuthResult> {
    try {
      const response = await fetch('http://localhost:4000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: identifier, phone: identifier, password })
      });
      const data = await response.json();
      if (data.success && data.user) {
        return { success: true, user: data.user };
      } else {
        return { success: false, error: data.error || 'Login failed' };
      }
    } catch (error: any) {
      return { success: false, error: error.message || 'Network error' };
    }
  }

  static async signInWithApple(): Promise<AuthResult> {
    try {
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });
      // Send credential to backend for verification and user creation/login
      const response = await fetch('http://localhost:4000/api/auth/apple/callback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          idToken: credential.identityToken,
          email: credential.email,
          name: credential.fullName,
        }),
      });
      const data = await response.json();
      if (data.success && data.user) {
        return { success: true, user: data.user };
      } else {
        return { success: false, error: data.error || 'Apple login failed.' };
      }
    } catch (error: any) {
      return { success: false, error: error.message || 'Apple login error' };
    }
  }

  static async updateProfile(userId: string, updates: Partial<UserProfile>): Promise<AuthResult> {
    // This method is no longer needed as profile updates are handled by the backend
    return { success: false, error: 'Profile updates are not available in this mock.' };
  }

  static async logout() {
    // No-op in mock
  }
}
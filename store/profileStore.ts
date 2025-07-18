import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { persist, createJSONStorage } from 'zustand/middleware';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  rating: number;
  totalRides: number;
}

interface PaymentMethod {
  id: string;
  name: string;
  type: 'Visa' | 'Mastercard' | 'American Express' | 'Cash';
  lastFour: string;
  isDefault: boolean;
  expiryDate?: string;
}

interface SavedPlace {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  type: 'home' | 'work' | 'other';
}

interface ProfileSettings {
  notifications: boolean;
  locationSharing: boolean;
  rideSharing: boolean;
  promotionalEmails: boolean;
  pushNotifications: boolean;
  smsNotifications: boolean;
}

interface ProfileState {
  user: UserProfile;
  paymentMethods: PaymentMethod[];
  savedPlaces: SavedPlace[];
  settings: ProfileSettings;
  
  // User actions
  updateUser: (updates: Partial<UserProfile>) => void;
  
  // Payment methods
  addPaymentMethod: (method: Omit<PaymentMethod, 'id'>) => void;
  removePaymentMethod: (id: string) => void;
  setDefaultPaymentMethod: (id: string) => void;
  
  // Saved places
  addSavedPlace: (place: Omit<SavedPlace, 'id'>) => void;
  removeSavedPlace: (id: string) => void;
  updateSavedPlace: (id: string, updates: Partial<SavedPlace>) => void;
  
  // Settings
  updateSettings: (updates: Partial<ProfileSettings>) => void;
  
  // Auth
  logout: () => void;
}

export const useProfileStore = create<ProfileState>()(
  persist(
    (set, get) => ({
      user: {
        id: '1',
        name: 'John Doe',
        email: 'john.doe@example.com',
        phone: '+1 (555) 123-4567',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
        rating: 4.85,
        totalRides: 127,
      },
      
      paymentMethods: [
        {
          id: '1',
          name: 'Personal',
          type: 'Visa',
          lastFour: '4242',
          isDefault: true,
          expiryDate: '12/26',
        },
        {
          id: '2',
          name: 'Business',
          type: 'Mastercard',
          lastFour: '5555',
          isDefault: false,
          expiryDate: '08/25',
        },
      ],
      
      savedPlaces: [
        {
          id: '1',
          name: 'Home',
          address: '123 Main Street, San Francisco, CA',
          latitude: 37.7749,
          longitude: -122.4194,
          type: 'home',
        },
        {
          id: '2',
          name: 'Work',
          address: '456 Market Street, San Francisco, CA',
          latitude: 37.7899,
          longitude: -122.4009,
          type: 'work',
        },
      ],
      
      settings: {
        notifications: true,
        locationSharing: true,
        rideSharing: false,
        promotionalEmails: true,
        pushNotifications: true,
        smsNotifications: false,
      },
      
      updateUser: (updates) =>
        set((state) => ({
          user: { ...state.user, ...updates },
        })),
      
      addPaymentMethod: (method) =>
        set((state) => ({
          paymentMethods: [
            ...state.paymentMethods,
            { ...method, id: Date.now().toString() },
          ],
        })),
      
      removePaymentMethod: (id) =>
        set((state) => ({
          paymentMethods: state.paymentMethods.filter((method) => method.id !== id),
        })),
      
      setDefaultPaymentMethod: (id) =>
        set((state) => ({
          paymentMethods: state.paymentMethods.map((method) => ({
            ...method,
            isDefault: method.id === id,
          })),
        })),
      
      addSavedPlace: (place) =>
        set((state) => ({
          savedPlaces: [
            ...state.savedPlaces,
            { ...place, id: Date.now().toString() },
          ],
        })),
      
      removeSavedPlace: (id) =>
        set((state) => ({
          savedPlaces: state.savedPlaces.filter((place) => place.id !== id),
        })),
      
      updateSavedPlace: (id, updates) =>
        set((state) => ({
          savedPlaces: state.savedPlaces.map((place) =>
            place.id === id ? { ...place, ...updates } : place
          ),
        })),
      
      updateSettings: (updates) =>
        set((state) => ({
          settings: { ...state.settings, ...updates },
        })),
      
      logout: () =>
        set({
          user: {
            id: '',
            name: '',
            email: '',
            phone: '',
            avatar: '',
            rating: 0,
            totalRides: 0,
          },
          paymentMethods: [],
          savedPlaces: [],
          settings: {
            notifications: true,
            locationSharing: true,
            rideSharing: false,
            promotionalEmails: true,
            pushNotifications: true,
            smsNotifications: false,
          },
        }),
    }),
    {
      name: 'profile-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
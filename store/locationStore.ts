import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { persist, createJSONStorage } from 'zustand/middleware';

interface Location {
  name: string;
  address: string;
  latitude: number;
  longitude: number;
}

interface LocationState {
  origin: Location | null;
  destination: Location | null;
  recentLocations: Location[];
  savedLocations: Location[];
  setOrigin: (location: Location | null) => void;
  setDestination: (location: Location | null) => void;
  addRecentLocation: (location: Location) => void;
  addSavedLocation: (location: Location) => void;
  removeSavedLocation: (address: string) => void;
  clearLocations: () => void;
}

export const useLocationStore = create<LocationState>()(
  persist(
    (set) => ({
      origin: null,
      destination: null,
      recentLocations: [],
      savedLocations: [],
      setOrigin: (location) => set({ origin: location }),
      setDestination: (location) => set({ destination: location }),
      addRecentLocation: (location) =>
        set((state) => {
          // Remove duplicates
          const filteredLocations = state.recentLocations.filter(
            (loc) => loc.address !== location.address
          );
          // Add to the beginning and limit to 5
          return {
            recentLocations: [location, ...filteredLocations].slice(0, 5),
          };
        }),
      addSavedLocation: (location) =>
        set((state) => {
          // Check if already saved
          if (state.savedLocations.some((loc) => loc.address === location.address)) {
            return state;
          }
          return {
            savedLocations: [...state.savedLocations, location],
          };
        }),
      removeSavedLocation: (address) =>
        set((state) => ({
          savedLocations: state.savedLocations.filter(
            (location) => location.address !== address
          ),
        })),
      clearLocations: () =>
        set({
          origin: null,
          destination: null,
        }),
    }),
    {
      name: 'location-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StyleSheet, Platform } from "react-native";
import colors from "@/constants/colors";
import { GoogleMapsLoader } from "@/components/GoogleMapsLoader";
import { useAuthStore } from "@/store/authStore";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

function RootLayoutNav() {
  return (
    <Stack 
      screenOptions={{ 
        headerShown: false,
        contentStyle: { backgroundColor: colors.dark.background },
      }}
    >
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="search" options={{ presentation: 'modal' }} />
      <Stack.Screen name="ride" options={{ presentation: 'modal' }} />
      <Stack.Screen name="profile" options={{ headerShown: false }} />
      <Stack.Screen name="splash" options={{ headerShown: false }} />
      <Stack.Screen name="onboarding" options={{ headerShown: false }} />
      <Stack.Screen name="notification-center" options={{ headerShown: false }} />
      <Stack.Screen name="referral" options={{ headerShown: false }} />
    </Stack>
  );
}

export default function RootLayout() {
  const [mapsLoaded, setMapsLoaded] = React.useState(false);
  const { isInitialized, initialize } = useAuthStore();

  useEffect(() => {
    // Initialize auth store if not already initialized
    if (!isInitialized) {
      initialize();
    }
    
    // Hide splash screen after a short delay
    const timer = setTimeout(() => {
      SplashScreen.hideAsync();
    }, 500);

    return () => clearTimeout(timer);
  }, [isInitialized, initialize]);

  const handleMapsLoad = () => {
    setMapsLoaded(true);
  };

  const handleMapsError = (error: Error) => {
    console.warn('Google Maps failed to load:', error);
    setMapsLoaded(true); // Continue anyway
  };

  return (
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView style={styles.container}>
        <StatusBar style="light" />
        {Platform.OS === 'web' && (
          <GoogleMapsLoader 
            onLoad={handleMapsLoad}
            onError={handleMapsError}
          />
        )}
        <RootLayoutNav />
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.dark.background,
  },
});
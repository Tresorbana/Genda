import { useState, useEffect } from 'react';
import { Platform } from 'react-native';

interface LocationCoords {
  latitude: number;
  longitude: number;
}

interface UseLocationReturn {
  location: LocationCoords | null;
  error: string | null;
  loading: boolean;
  requestLocation: () => Promise<void>;
}

export const useLocation = (): UseLocationReturn => {
  const [location, setLocation] = useState<LocationCoords | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const requestLocation = async () => {
    if (Platform.OS === 'web') {
      // Use web geolocation API
      if (!navigator.geolocation) {
        setError('Geolocation is not supported by this browser');
        return;
      }

      setLoading(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          setError(null);
          setLoading(false);
        },
        (err) => {
          setError(err.message);
          setLoading(false);
        },
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 10000,
        }
      );
    } else {
      // For mobile, we'll use a mock location for now
      // In a real app, you would use expo-location here
      setLoading(true);
      
      // Simulate API call
      setTimeout(() => {
        setLocation({
          latitude: 37.7749, // San Francisco
          longitude: -122.4194,
        });
        setError(null);
        setLoading(false);
      }, 1000);
    }
  };

  useEffect(() => {
    requestLocation();
  }, []);

  return {
    location,
    error,
    loading,
    requestLocation,
  };
};
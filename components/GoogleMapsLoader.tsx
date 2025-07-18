import { useEffect } from 'react';
import { Platform } from 'react-native';

interface GoogleMapsLoaderProps {
  apiKey?: string;
  onLoad?: () => void;
  onError?: (error: Error) => void;
}

export const GoogleMapsLoader = ({ 
  apiKey = 'YOUR_GOOGLE_MAPS_API_KEY', 
  onLoad, 
  onError 
}: GoogleMapsLoaderProps) => {
  useEffect(() => {
    if (Platform.OS !== 'web') return;

    // Check if Google Maps is already loaded
    if (typeof window !== 'undefined' && window.google && window.google.maps) {
      onLoad?.();
      return;
    }

    // Check if script is already being loaded
    const existingScript = document.querySelector('script[src*="maps.googleapis.com"]');
    if (existingScript) {
      existingScript.addEventListener('load', () => onLoad?.());
      existingScript.addEventListener('error', (e) => onError?.(new Error('Failed to load Google Maps')));
      return;
    }

    // Load Google Maps script
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places,geometry`;
    script.async = true;
    script.defer = true;
    
    script.onload = () => {
      onLoad?.();
    };
    
    script.onerror = () => {
      onError?.(new Error('Failed to load Google Maps API'));
    };

    document.head.appendChild(script);

    return () => {
      // Cleanup if component unmounts
      const scriptToRemove = document.querySelector('script[src*="maps.googleapis.com"]');
      if (scriptToRemove && scriptToRemove.parentNode) {
        scriptToRemove.parentNode.removeChild(scriptToRemove);
      }
    };
  }, [apiKey, onLoad, onError]);

  return null;
};
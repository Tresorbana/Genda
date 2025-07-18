import { Platform } from 'react-native';

interface GeocodeResult {
  latitude: number;
  longitude: number;
  address: string;
}

interface ReverseGeocodeResult {
  address: string;
  city: string;
  country: string;
}

export class GeocodingService {
  private static apiKey = 'YOUR_GOOGLE_MAPS_API_KEY';

  static async geocodeAddress(address: string): Promise<GeocodeResult | null> {
    if (Platform.OS === 'web' && window.google && window.google.maps) {
      return new Promise((resolve) => {
        const geocoder = new google.maps.Geocoder();
        geocoder.geocode({ address }, (results, status) => {
          if (status === google.maps.GeocoderStatus.OK && results && results[0]) {
            const location = results[0].geometry.location;
            resolve({
              latitude: location.lat(),
              longitude: location.lng(),
              address: results[0].formatted_address,
            });
          } else {
            resolve(null);
          }
        });
      });
    }

    // Fallback for mobile or when Google Maps is not available
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${this.apiKey}`
      );
      const data = await response.json();
      
      if (data.status === 'OK' && data.results.length > 0) {
        const result = data.results[0];
        return {
          latitude: result.geometry.location.lat,
          longitude: result.geometry.location.lng,
          address: result.formatted_address,
        };
      }
    } catch (error) {
      console.error('Geocoding error:', error);
    }

    return null;
  }

  static async reverseGeocode(latitude: number, longitude: number): Promise<ReverseGeocodeResult | null> {
    if (Platform.OS === 'web' && window.google && window.google.maps) {
      return new Promise((resolve) => {
        const geocoder = new google.maps.Geocoder();
        const latlng = { lat: latitude, lng: longitude };
        
        geocoder.geocode({ location: latlng }, (results, status) => {
          if (status === google.maps.GeocoderStatus.OK && results && results[0]) {
            const result = results[0];
            const addressComponents = result.address_components;
            
            const city = addressComponents.find(component => 
              component.types.includes('locality') || component.types.includes('administrative_area_level_2')
            )?.long_name || '';
            
            const country = addressComponents.find(component => 
              component.types.includes('country')
            )?.long_name || '';

            resolve({
              address: result.formatted_address,
              city,
              country,
            });
          } else {
            resolve(null);
          }
        });
      });
    }

    // Fallback for mobile or when Google Maps is not available
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${this.apiKey}`
      );
      const data = await response.json();
      
      if (data.status === 'OK' && data.results.length > 0) {
        const result = data.results[0];
        const addressComponents = result.address_components;
        
        const city = addressComponents.find((component: any) => 
          component.types.includes('locality') || component.types.includes('administrative_area_level_2')
        )?.long_name || '';
        
        const country = addressComponents.find((component: any) => 
          component.types.includes('country')
        )?.long_name || '';

        return {
          address: result.formatted_address,
          city,
          country,
        };
      }
    } catch (error) {
      console.error('Reverse geocoding error:', error);
    }

    return null;
  }

  static calculateDistance(
    lat1: number, 
    lng1: number, 
    lat2: number, 
    lng2: number
  ): number {
    if (Platform.OS === 'web' && window.google && window.google.maps) {
      const point1 = new google.maps.LatLng(lat1, lng1);
      const point2 = new google.maps.LatLng(lat2, lng2);
      return google.maps.geometry.spherical.computeDistanceBetween(point1, point2);
    }

    // Haversine formula fallback
    const R = 6371e3; // Earth's radius in meters
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lng2 - lng1) * Math.PI / 180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R * c; // Distance in meters
  }
}
import React, { useState } from 'react';
import { StyleSheet, View, Text, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { MapPin, Clock, ChevronRight, Navigation } from 'lucide-react-native';
import { LocationInput } from '@/components/LocationInput';
import { Button } from '@/components/Button';
import { useLocationStore } from '@/store/locationStore';
import { useLocation } from '@/hooks/useLocation';
import colors from '@/constants/colors';
import { savedLocations, recentLocations } from '../../mocks/location';

export default function HomeScreen() {
  const router = useRouter();
  const { origin, destination, setOrigin } = useLocationStore();
  const { location, loading, requestLocation } = useLocation();
  
  // Set current location as origin when available
  React.useEffect(() => {
    if (location && !origin) {
      setOrigin({
        name: 'Current Location',
        address: 'Your current location',
        latitude: location.latitude,
        longitude: location.longitude,
      });
    }
  }, [location, origin]);

  const handleWhereToPress = () => {
    router.push('/search');
  };

  const handleCurrentLocationPress = () => {
    requestLocation();
  };

  const navigateToRide = () => {
    if (destination) {
      router.push('/ride');
    }
  };

  return (
    <View style={styles.container}>
      
      <SafeAreaView style={styles.contentContainer}>
        <View style={styles.searchContainer}>
          <View style={styles.locationInputContainer}>
            <LocationInput
              placeholder="Where from?"
              value={origin?.name || ""}
              isOrigin
              editable={false}
              onPress={() => router.push('/search?type=origin')}
            />
            {loading && (
              <TouchableOpacity 
                style={styles.currentLocationButton}
                onPress={handleCurrentLocationPress}
              >
                <Navigation size={16} color={colors.primary} />
              </TouchableOpacity>
            )}
          </View>
          
          <LocationInput
            placeholder="Where to?"
            value={destination?.name || ""}
            editable={false}
            onPress={handleWhereToPress}
          />
          
          {destination && (
            <Button 
              title="Confirm Uber" 
              style={styles.confirmButton}
              onPress={navigateToRide}
            />
          )}
        </View>

        {!destination && (
          <ScrollView style={styles.suggestionsContainer}>
            <Text style={styles.sectionTitle}>Saved Places</Text>
            {savedLocations.map((location) => (
              <TouchableOpacity 
                key={location.id} 
                style={styles.suggestionItem}
                onPress={() => {
                  useLocationStore.getState().setDestination(location);
                  useLocationStore.getState().addRecentLocation(location);
                }}
              >
                <View style={styles.iconContainer}>
                  <MapPin size={20} color={colors.primary} />
                </View>
                <View style={styles.suggestionTextContainer}>
                  <Text style={styles.suggestionTitle}>{location.name}</Text>
                  <Text style={styles.suggestionSubtitle}>{location.address}</Text>
                </View>
                <ChevronRight size={20} color={colors.dark.subtext} />
              </TouchableOpacity>
            ))}

            <Text style={styles.sectionTitle}>Recent Trips</Text>
            {recentLocations.map((location) => (
              <TouchableOpacity 
                key={location.id} 
                style={styles.suggestionItem}
                onPress={() => {
                  useLocationStore.getState().setDestination(location);
                  useLocationStore.getState().addRecentLocation(location);
                }}
              >
                <View style={styles.iconContainer}>
                  <Clock size={20} color={colors.dark.subtext} />
                </View>
                <View style={styles.suggestionTextContainer}>
                  <Text style={styles.suggestionTitle}>{location.name}</Text>
                  <Text style={styles.suggestionSubtitle}>{location.address}</Text>
                </View>
                <ChevronRight size={20} color={colors.dark.subtext} />
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
      </SafeAreaView>
      {/* Add navigation buttons for demo/testing */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-around', padding: 16 }}>
        <Button title="Splash" onPress={() => router.push({ pathname: '/splash' })} style={{ flex: 1, marginHorizontal: 4 }} />
        <Button title="Onboarding" onPress={() => router.push({ pathname: '/onboarding' })} style={{ flex: 1, marginHorizontal: 4 }} />
        <Button title="Notifications" onPress={() => router.push({ pathname: '/notification-center' })} style={{ flex: 1, marginHorizontal: 4 }} />
        <Button title="Referral" onPress={() => router.push({ pathname: '/referral' })} style={{ flex: 1, marginHorizontal: 4 }} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.dark.background,
  },
  contentContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.dark.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 16,
    paddingHorizontal: 16,
    maxHeight: '60%',
  },
  searchContainer: {
    backgroundColor: colors.dark.background,
    borderRadius: 8,
    padding: 8,
  },
  locationInputContainer: {
    position: 'relative',
  },
  currentLocationButton: {
    position: 'absolute',
    right: 12,
    top: '50%',
    transform: [{ translateY: -8 }],
    padding: 4,
  },
  confirmButton: {
    marginTop: 16,
  },
  suggestionsContainer: {
    marginTop: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.dark.text,
    marginVertical: 16,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.dark.border,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.dark.card,
    justifyContent: 'center',
    alignItems: 'center',
  },
  suggestionTextContainer: {
    flex: 1,
    marginLeft: 16,
  },
  suggestionTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.dark.text,
  },
  suggestionSubtitle: {
    fontSize: 14,
    color: colors.dark.subtext,
    marginTop: 4,
  },
});
import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, SafeAreaView, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import colors from '@/constants/colors';
import { Button } from '@/components/Button';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/store/authStore';

export default function DriverHomeScreen() {
  const router = useRouter();
  // Placeholder data
  const [lastTrips, setLastTrips] = useState([]);
  const [incomingRequests, setIncomingRequests] = useState([]);
  const [balance, setBalance] = useState('$0.00');
  const [rating, setRating] = useState(5);
  const { user } = useAuthStore();

  useEffect(() => {
    if (!user) return;
    // Fetch last trips
    fetch(`http://localhost:4000/api/trips/driver/${user.id}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) setLastTrips(data.trips);
      });
    // Fetch incoming ride requests
    fetch(`http://localhost:4000/api/ride-requests?driverId=${user.id}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) setIncomingRequests(data.requests);
      });
    // Optionally fetch balance and rating from user profile
    setBalance(user.balance ? `$${user.balance.toFixed(2)}` : '$0.00');
    setRating(user.rating || 5);
  }, [user]);

  // GPS state
  const [location, setLocation] = useState<Location.LocationObjectCoords | null>(null);
  const [loadingLocation, setLoadingLocation] = useState(true);

  useEffect(() => {
    (async () => {
      setLoadingLocation(true);
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setLoadingLocation(false);
        return;
      }
      let loc = await Location.getCurrentPositionAsync({});
      setLocation(loc.coords);
      setLoadingLocation(false);
      // Optionally, subscribe to location updates:
      // const subscription = await Location.watchPositionAsync({ accuracy: Location.Accuracy.High, timeInterval: 5000, distanceInterval: 10 }, (loc) => setLocation(loc.coords));
      // return () => subscription.remove();
    })();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Driver Dashboard</Text>

        {/* Profile Section */}
        <TouchableOpacity style={styles.section} onPress={() => router.push('/profile/driver-edit')}>
          <Text style={styles.sectionTitle}>Profile</Text>
          <Text style={styles.profileText}>John Doe</Text>
          <Text style={styles.profileText}>john.driver@example.com</Text>
        </TouchableOpacity>

        {/* Balance and Ratings */}
        <View style={styles.rowSection}>
          <View style={styles.balanceBox}>
            <Text style={styles.sectionTitle}>Balance</Text>
            <Text style={styles.balanceText}>{balance}</Text>
          </View>
          <View style={styles.ratingBox}>
            <Text style={styles.sectionTitle}>Rating</Text>
            <Text style={styles.ratingText}>{rating} ★</Text>
          </View>
        </View>

        {/* Last Known Trips */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Last Known Trips</Text>
          {lastTrips.map(trip => (
            <View key={trip._id} style={styles.tripItem}>
              <Text style={styles.tripText}>From: {trip.from}</Text>
              <Text style={styles.tripText}>To: {trip.to}</Text>
              <Text style={styles.tripText}>Date: {trip.date}</Text>
              <Text style={styles.tripText}>Fare: ${trip.fare}</Text>
            </View>
          ))}
        </View>

        {/* Incoming Ride Requests */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Incoming Ride Requests</Text>
          {incomingRequests.length === 0 ? (
            <Text style={styles.emptyText}>No incoming requests</Text>
          ) : (
            incomingRequests.map(req => (
              <View key={req._id} style={styles.rideRequest}>
                <Text style={styles.rideText}>Pickup: {req.from}</Text>
                <Text style={styles.rideText}>Dropoff: {req.to}</Text>
                <Text style={styles.rideText}>Distance: {req.distance || '-'} km</Text>
                <Text style={styles.rideText}>Fare: ${req.fare}</Text>
                <Button title="Accept Ride" style={styles.acceptButton} onPress={() => {}} />
              </View>
            ))
          )}
        </View>

        {/* GPS & Map Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>GPS & Map Tracking</Text>
          {loadingLocation ? (
            <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 16 }} />
          ) : location ? (
            <MapView
              style={styles.map}
              initialRegion={{
                latitude: location.latitude,
                longitude: location.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              }}
              region={{
                latitude: location.latitude,
                longitude: location.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              }}
              showsUserLocation={true}
            >
              <Marker coordinate={{ latitude: location.latitude, longitude: location.longitude }} title="You are here" />
            </MapView>
          ) : (
            <Text style={styles.mapText}>Location not available</Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.dark.background,
  },
  scrollContent: {
    padding: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.dark.text,
    marginBottom: 24,
  },
  section: {
    width: '100%',
    backgroundColor: colors.dark.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    alignItems: 'flex-start',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.dark.text,
    marginBottom: 12,
  },
  profileText: {
    color: colors.dark.text,
    fontSize: 16,
    marginBottom: 4,
  },
  rowSection: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  balanceBox: {
    flex: 1,
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: 16,
    marginRight: 8,
    alignItems: 'center',
  },
  balanceText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 8,
  },
  ratingBox: {
    flex: 1,
    backgroundColor: colors.dark.card,
    borderRadius: 12,
    padding: 16,
    marginLeft: 8,
    alignItems: 'center',
  },
  ratingText: {
    color: colors.primary,
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 8,
  },
  tripItem: {
    backgroundColor: colors.dark.background,
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    width: '100%',
  },
  tripText: {
    color: colors.dark.text,
    fontSize: 15,
  },
  rideRequest: {
    backgroundColor: colors.dark.background,
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    width: '100%',
    alignItems: 'flex-start',
  },
  rideText: {
    color: colors.dark.text,
    fontSize: 15,
    marginBottom: 4,
  },
  acceptButton: {
    marginTop: 8,
    width: 160,
    alignSelf: 'center',
  },
  emptyText: {
    color: colors.dark.subtext,
    fontSize: 15,
    fontStyle: 'italic',
  },
  map: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginTop: 8,
  },
  mapText: {
    color: colors.dark.subtext,
    fontSize: 16,
    marginTop: 16,
    textAlign: 'center',
  },
}); 
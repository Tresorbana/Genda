import React, { useState } from 'react';
import { StyleSheet, View, Text, SafeAreaView, TouchableOpacity, FlatList, Alert, Modal, ActivityIndicator, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft, CreditCard, Clock } from 'lucide-react-native';
import { RideOption } from '@/components/RideOption';
import { Button } from '@/components/Button';
import { useLocationStore } from '@/store/locationStore';
import { useRideStore } from '@/store/rideStore';
import colors from '@/constants/colors';
import { paymentMethods } from '@/mocks/rides';
import { MaterialIcons, Feather } from '@expo/vector-icons';

type MatchedDriver = {
  name: string;
  car: string;
  plate: string;
  rating: number;
  phone: string;
  avatar: string;
};

export default function RideScreen() {
  const router = useRouter();
  const { origin, destination } = useLocationStore();
  const { rideTypes, selectedRideId, selectRide } = useRideStore();
  const [selectedPayment, setSelectedPayment] = useState(paymentMethods.find(p => p.isDefault));
  const [matching, setMatching] = useState(false);
  const [matchedDriver, setMatchedDriver] = useState<MatchedDriver | null>(null);

  const selectedRide = rideTypes.find(ride => ride.id === selectedRideId);
  const minPrice = Math.min(...rideTypes.map(r => r.price));

  const handleRideSelect = (id: string) => {
    selectRide(id);
  };

  const handleConfirmRide = async () => {
    if (!origin || !destination || !selectedRide) {
      Alert.alert('Error', 'Please select a ride and enter locations');
      return;
    }
    setMatching(true);
    // Simulate driver matching delay
    setTimeout(() => {
      setMatching(false);
      setMatchedDriver({
        name: 'Alex Driver',
        car: 'Toyota Prius',
        plate: 'UBR-1234',
        rating: 4.9,
        phone: '+1234567890',
        avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
      });
    }, 2500);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ChevronLeft size={24} color={colors.dark.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Choose a ride</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.routeInfo}>
        <View style={styles.routePoints}>
          <View style={styles.originDot} />
          <View style={styles.routeLine} />
          <View style={styles.destinationDot} />
        </View>
        <View style={styles.routeAddresses}>
          <Text style={styles.addressText} numberOfLines={1}>
            {origin?.name || 'Current Location'}
          </Text>
          <Text style={styles.addressText} numberOfLines={1}>
            {destination?.name || 'Destination'}
          </Text>
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.rideOptions}>
          <FlatList
            data={rideTypes}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <RideOption
                id={item.id}
                name={item.name}
                description={item.description}
                capacity={item.capacity}
                price={item.price}
                eta={item.eta}
                image={item.image}
                selected={selectedRideId === item.id}
                onSelect={handleRideSelect}
                best={item.price === minPrice}
              />
            )}
            showsVerticalScrollIndicator={false}
          />
        </View>

        <View style={styles.footer}>
          <View style={styles.paymentSection}>
            <TouchableOpacity style={styles.paymentSelector}>
              <CreditCard size={20} color={colors.dark.text} />
              <Text style={styles.paymentText}>
                {selectedPayment?.type} •••• {selectedPayment?.lastFour}
              </Text>
              <ChevronLeft size={20} color={colors.dark.text} style={{ transform: [{ rotate: '270deg' }] }} />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.arrivalTime}>
              <Clock size={20} color={colors.dark.text} />
              <Text style={styles.arrivalTimeText}>
                Now • {selectedRide?.eta || '5 min'}
              </Text>
              <ChevronLeft size={20} color={colors.dark.text} style={{ transform: [{ rotate: '270deg' }] }} />
            </TouchableOpacity>
          </View>

          <Button
            title={`Confirm ${selectedRide?.name || 'Uber'}`}
            size="large"
            style={styles.confirmButton}
            disabled={!selectedRideId}
            onPress={handleConfirmRide}
          />
        </View>
      </View>
      <Modal visible={matching} transparent animationType="fade">
        <View style={styles.matchingOverlay}>
          {/* Placeholder for animated loader (replace with Lottie for real app) */}
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.matchingText}>Looking for a driver...</Text>
        </View>
      </Modal>
      <Modal visible={!!matchedDriver} transparent animationType="slide">
        <View style={styles.driverCardOverlay}>
          <View style={styles.driverCard}>
            <Image source={{ uri: matchedDriver?.avatar }} style={styles.driverAvatar} />
            <Text style={styles.driverName}>{matchedDriver?.name}</Text>
            <Text style={styles.driverInfo}>{matchedDriver?.car} • {matchedDriver?.plate}</Text>
            <View style={styles.driverRatingRow}>
              <MaterialIcons name="star" size={20} color="#FFD700" />
              <Text style={styles.driverRating}>{matchedDriver?.rating}</Text>
            </View>
            <View style={styles.driverActions}>
              <TouchableOpacity style={styles.driverActionBtn}><Feather name="phone" size={20} color={colors.primary} /><Text style={styles.driverActionText}>Call</Text></TouchableOpacity>
              <TouchableOpacity style={styles.driverActionBtn}><Feather name="message-circle" size={20} color={colors.primary} /><Text style={styles.driverActionText}>Text</Text></TouchableOpacity>
              <TouchableOpacity style={styles.driverActionBtn} onPress={() => setMatchedDriver(null)}><Feather name="x" size={20} color={colors.common.error} /><Text style={[styles.driverActionText, { color: colors.common.error }]}>Cancel</Text></TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.dark.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.dark.border,
  },
  backButton: {
    padding: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.dark.text,
  },
  placeholder: {
    width: 32,
  },
  routeInfo: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.dark.border,
  },
  routePoints: {
    width: 24,
    alignItems: 'center',
    marginRight: 12,
  },
  originDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary,
  },
  routeLine: {
    width: 2,
    height: 30,
    backgroundColor: colors.dark.border,
    marginVertical: 4,
  },
  destinationDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.secondary,
  },
  routeAddresses: {
    flex: 1,
    justifyContent: 'space-between',
    height: 50,
  },
  addressText: {
    fontSize: 16,
    color: colors.dark.text,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  rideOptions: {
    flex: 1,
    paddingTop: 16,
  },
  footer: {
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: colors.dark.border,
  },
  paymentSection: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  paymentSelector: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.dark.card,
    borderRadius: 8,
    padding: 12,
    marginRight: 8,
  },
  paymentText: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
    color: colors.dark.text,
  },
  arrivalTime: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.dark.card,
    borderRadius: 8,
    padding: 12,
    marginLeft: 8,
  },
  arrivalTimeText: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
    color: colors.dark.text,
  },
  confirmButton: {
    width: '100%',
  },
  matchingOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', alignItems: 'center' },
  matchingText: { color: '#fff', fontSize: 20, marginTop: 16 },
  driverCardOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', alignItems: 'center' },
  driverCard: { backgroundColor: '#222', borderRadius: 16, padding: 24, alignItems: 'center', width: 300 },
  driverAvatar: { width: 80, height: 80, borderRadius: 40, marginBottom: 12 },
  driverName: { color: '#fff', fontSize: 22, fontWeight: 'bold' },
  driverInfo: { color: '#ccc', fontSize: 16, marginBottom: 8 },
  driverRatingRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  driverRating: { color: '#FFD700', fontSize: 16, marginLeft: 6 },
  driverActions: { flexDirection: 'row', justifyContent: 'space-between', width: '100%' },
  driverActionBtn: { flex: 1, alignItems: 'center', padding: 8 },
  driverActionText: { color: colors.primary, fontSize: 14, marginTop: 4 },
});
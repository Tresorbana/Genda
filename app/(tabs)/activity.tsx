import React, { useState } from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity, SafeAreaView, Modal, TextInput, Button as RNButton, Share } from 'react-native';
import { Clock, ChevronRight } from 'lucide-react-native';
import colors from '@/constants/colors';
import { MaterialIcons, Feather } from '@expo/vector-icons';

// Mock data for past rides
const pastRides = [
  {
    id: '1',
    date: 'Today, 2:30 PM',
    pickup: '123 Main St',
    dropoff: 'San Francisco Airport',
    price: '$35.42',
    status: 'Completed',
  },
  {
    id: '2',
    date: 'Yesterday, 8:15 AM',
    pickup: 'Home',
    dropoff: 'Work',
    price: '$22.15',
    status: 'Completed',
  },
  {
    id: '3',
    date: 'Jul 12, 7:30 PM',
    pickup: 'Golden Gate Park',
    dropoff: 'Home',
    price: '$18.75',
    status: 'Completed',
  },
  {
    id: '4',
    date: 'Jul 10, 12:45 PM',
    pickup: 'Work',
    dropoff: 'Fisherman\'s Wharf',
    price: '$24.30',
    status: 'Completed',
  },
  {
    id: '5',
    date: 'Jul 5, 9:20 AM',
    pickup: 'Home',
    dropoff: 'San Francisco Airport',
    price: '$38.50',
    status: 'Completed',
  },
];

type Ride = {
  id: string;
  date: string;
  pickup: string;
  dropoff: string;
  price: string;
  status: string;
};

export default function ActivityScreen() {
  const [selectedRide, setSelectedRide] = useState<Ride | null>(null);
  const [showSummary, setShowSummary] = useState(false);
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [tip, setTip] = useState('');

  const openSummary = (ride: Ride) => {
    setSelectedRide(ride);
    setShowSummary(true);
  };
  const closeSummary = () => {
    setShowSummary(false);
    setSelectedRide(null);
    setRating(0);
    setFeedback('');
    setTip('');
  };
  const handleShare = async () => {
    if (selectedRide) {
      await Share.share({ message: `I just took a ride from ${selectedRide.pickup} to ${selectedRide.dropoff} for ${selectedRide.price}!` });
    }
  };
  const renderRideItem = ({ item }: { item: Ride }) => (
    <TouchableOpacity style={styles.rideItem} onPress={() => openSummary(item)}>
      <View style={styles.rideHeader}>
        <Text style={styles.rideDate}>{item.date}</Text>
        <Text style={styles.ridePrice}>{item.price}</Text>
      </View>
      <View style={styles.rideDetails}>
        <View style={styles.locationContainer}>
          <View style={styles.locationDot} />
          <Text style={styles.locationText}>{item.pickup}</Text>
        </View>
        <View style={styles.locationLine} />
        <View style={styles.locationContainer}>
          <View style={styles.destinationDot} />
          <Text style={styles.locationText}>{item.dropoff}</Text>
        </View>
      </View>
      <View style={styles.rideFooter}>
        <Text style={styles.rideStatus}>{item.status}</Text>
        <ChevronRight size={20} color={colors.dark.subtext} />
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Your Activity</Text>
      </View>
      
      {pastRides.length > 0 ? (
        <FlatList
          data={pastRides}
          renderItem={renderRideItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Clock size={48} color={colors.dark.subtext} />
          <Text style={styles.emptyTitle}>No activity yet</Text>
          <Text style={styles.emptyText}>
            Your past rides and orders will appear here
          </Text>
        </View>
      )}
      <Modal visible={showSummary} transparent animationType="slide">
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ backgroundColor: '#222', borderRadius: 16, padding: 24, width: 320 }}>
            <Text style={{ color: '#fff', fontSize: 20, fontWeight: 'bold', marginBottom: 8 }}>Trip Summary</Text>
            <Text style={{ color: '#fff', marginBottom: 4 }}>From: {selectedRide?.pickup}</Text>
            <Text style={{ color: '#fff', marginBottom: 4 }}>To: {selectedRide?.dropoff}</Text>
            <Text style={{ color: '#fff', marginBottom: 4 }}>Date: {selectedRide?.date}</Text>
            <Text style={{ color: '#fff', marginBottom: 8 }}>Cost: {selectedRide?.price}</Text>
            {/* Star Rating */}
            <View style={{ flexDirection: 'row', marginBottom: 8 }}>
              {[1,2,3,4,5].map(i => (
                <TouchableOpacity key={i} onPress={() => setRating(i)}>
                  <MaterialIcons name={i <= rating ? 'star' : 'star-border'} size={28} color="#FFD700" />
                </TouchableOpacity>
              ))}
            </View>
            {/* Feedback */}
            <TextInput
              style={{ backgroundColor: '#333', color: '#fff', borderRadius: 8, padding: 8, marginBottom: 8 }}
              placeholder="Leave feedback..."
              placeholderTextColor="#aaa"
              value={feedback}
              onChangeText={setFeedback}
              multiline
            />
            {/* Tip */}
            <TextInput
              style={{ backgroundColor: '#333', color: '#fff', borderRadius: 8, padding: 8, marginBottom: 8 }}
              placeholder="Tip your driver (optional)"
              placeholderTextColor="#aaa"
              value={tip}
              onChangeText={setTip}
              keyboardType="numeric"
            />
            {/* Share Button */}
            <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }} onPress={handleShare}>
              <Feather name="share-2" size={20} color="#fff" style={{ marginRight: 8 }} />
              <Text style={{ color: '#fff' }}>Share Trip</Text>
            </TouchableOpacity>
            {/* Close Button */}
            <RNButton title="Close" onPress={closeSummary} color="#276EF1" />
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
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.dark.border,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.dark.text,
  },
  listContent: {
    padding: 16,
  },
  rideItem: {
    backgroundColor: colors.dark.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  rideHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  rideDate: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.dark.text,
  },
  ridePrice: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.dark.text,
  },
  rideDetails: {
    marginBottom: 16,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  locationDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary,
    marginRight: 12,
  },
  destinationDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.secondary,
    marginRight: 12,
  },
  locationLine: {
    width: 1,
    height: 20,
    backgroundColor: colors.dark.border,
    marginLeft: 5,
  },
  locationText: {
    fontSize: 14,
    color: colors.dark.text,
  },
  rideFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rideStatus: {
    fontSize: 14,
    color: colors.secondary,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.dark.text,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: colors.dark.subtext,
    textAlign: 'center',
  },
});
import React from 'react';
import { StyleSheet, View, Text, SafeAreaView, TouchableOpacity, FlatList, Alert } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { MapPin, Home, Briefcase, Plus, Trash2 } from 'lucide-react-native';
import { Button } from '@/components/Button';
import { useProfileStore } from '@/store/profileStore';
import colors from '@/constants/colors';

interface SavedPlace {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  type: 'home' | 'work' | 'other';
}

export default function SavedPlacesScreen() {
  const router = useRouter();
  const { savedPlaces, removeSavedPlace } = useProfileStore();

  const handleRemovePlace = (id: string, name: string) => {
    Alert.alert(
      'Remove Place',
      `Are you sure you want to remove ${name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => removeSavedPlace(id),
        },
      ]
    );
  };

  const getPlaceIcon = (type: string) => {
    switch (type) {
      case 'home':
        return <Home size={20} color={colors.primary} />;
      case 'work':
        return <Briefcase size={20} color={colors.secondary} />;
      default:
        return <MapPin size={20} color={colors.dark.text} />;
    }
  };

  const renderSavedPlace = ({ item }: { item: SavedPlace }) => (
    <View style={styles.placeItem}>
      <View style={styles.placeInfo}>
        <View style={styles.iconContainer}>
          {getPlaceIcon(item.type)}
        </View>
        <View style={styles.placeDetails}>
          <Text style={styles.placeName}>{item.name}</Text>
          <Text style={styles.placeAddress}>{item.address}</Text>
        </View>
      </View>
      
      <TouchableOpacity
        style={styles.removeButton}
        onPress={() => handleRemovePlace(item.id, item.name)}
      >
        <Trash2 size={20} color={colors.common.error} />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen 
        options={{ 
          title: 'Saved Places',
          headerStyle: { backgroundColor: colors.dark.background },
          headerTintColor: colors.dark.text,
          headerTitleStyle: { color: colors.dark.text },
        }} 
      />
      
      <View style={styles.content}>
        <FlatList
          data={savedPlaces}
          keyExtractor={(item) => item.id}
          renderItem={renderSavedPlace}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <MapPin size={48} color={colors.dark.subtext} />
              <Text style={styles.emptyTitle}>No saved places</Text>
              <Text style={styles.emptyText}>
                Add your frequently visited places for quick access
              </Text>
            </View>
          }
        />
      </View>

      <View style={styles.footer}>
        <Button
          title="Add Saved Place"
          onPress={() => router.push('/profile/add-place')}
          style={styles.addButton}
          variant="outline"
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.dark.background,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  listContent: {
    flexGrow: 1,
  },
  placeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.dark.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.dark.border,
  },
  placeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.dark.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  placeDetails: {
    flex: 1,
  },
  placeName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.dark.text,
    marginBottom: 4,
  },
  placeAddress: {
    fontSize: 14,
    color: colors.dark.subtext,
  },
  removeButton: {
    padding: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
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
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: colors.dark.border,
  },
  addButton: {
    width: '100%',
  },
});
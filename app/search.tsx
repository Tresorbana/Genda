import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, SafeAreaView, TextInput, FlatList } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Search, X } from 'lucide-react-native';
import { LocationItem } from '@/components/LocationItem';
import { useLocationStore } from '@/store/locationStore';
import colors from '@/constants/colors';
import { savedLocations, recentLocations, popularLocations } from '../mocks/location';

export default function SearchScreen() {
  const router = useRouter();
  const { type } = useLocalSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  type Location = {
    id: string;
    name: string;
    address: string;
    latitude: number;
    longitude: number;
  };
  const [filteredLocations, setFilteredLocations] = useState<Location[]>([]);
  const { setOrigin, setDestination, addRecentLocation } = useLocationStore();

  const isOriginSearch = type === 'origin';

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredLocations([]);
    } else {
      const allLocations = [...savedLocations, ...recentLocations, ...popularLocations];
      const filtered = allLocations.filter(
        (location) =>
          location.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          location.address.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredLocations(filtered);
    }
  }, [searchQuery]);

  const handleLocationSelect = (location: Location) => {
    if (isOriginSearch) {
      setOrigin(location);
    } else {
      setDestination(location);
      addRecentLocation(location);
    }
    router.back();
  };

  const renderLocationSections = () => {
    if (searchQuery.trim() !== '') {
      return (
        <FlatList
          data={filteredLocations}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <LocationItem
              name={item.name}
              address={item.address}
              type="recent"
              onPress={() => handleLocationSelect(item)}
            />
          )}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No locations found</Text>
            </View>
          }
        />
      );
    }

    return (
      <FlatList
        data={[
          { title: 'Saved Places', data: savedLocations, type: 'saved' },
          { title: 'Recent Searches', data: recentLocations, type: 'recent' },
          { title: 'Popular Destinations', data: popularLocations, type: 'popular' },
        ]}
        keyExtractor={(item, index) => `section-${index}`}
        renderItem={({ item: section }) => (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            {section.data.map((location: Location) => (
              <LocationItem
                key={location.id}
                name={location.name}
                address={location.address}
                type={section.type as 'saved' | 'recent' | 'popular'}
                onPress={() => handleLocationSelect(location)}
              />
            ))}
          </View>
        )}
      />
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.searchContainer}>
          <Search size={20} color={colors.dark.subtext} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder={isOriginSearch ? "Search for pickup location" : "Search for destination"}
            placeholderTextColor={colors.dark.subtext}
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoFocus
          />
          {searchQuery.length > 0 && (
            <X
              size={20}
              color={colors.dark.subtext}
              style={styles.clearIcon}
              onPress={() => setSearchQuery('')}
            />
          )}
        </View>
      </View>

      <View style={styles.content}>{renderLocationSections()}</View>
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.dark.card,
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 48,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    color: colors.dark.text,
    fontSize: 16,
  },
  clearIcon: {
    padding: 4,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.dark.text,
    marginBottom: 16,
  },
  emptyContainer: {
    padding: 16,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: colors.dark.subtext,
  },
});
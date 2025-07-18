import React, { useState } from 'react';
import { StyleSheet, View, Text, SafeAreaView, TextInput, Alert, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { Home, Briefcase, MapPin } from 'lucide-react-native';
import { Button } from '@/components/Button';
import { useProfileStore } from '@/store/profileStore';
import colors from '@/constants/colors';

export default function AddPlaceScreen() {
  const router = useRouter();
  const { addSavedPlace } = useProfileStore();
  
  const [placeName, setPlaceName] = useState('');
  const [address, setAddress] = useState('');
  const [selectedType, setSelectedType] = useState<'home' | 'work' | 'other'>('other');
  const [loading, setLoading] = useState(false);

  const placeTypes = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'work', label: 'Work', icon: Briefcase },
    { id: 'other', label: 'Other', icon: MapPin },
  ];

  const handleSave = async () => {
    if (!placeName.trim() || !address.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);
    
    // Simulate geocoding API call
    setTimeout(() => {
      // In a real app, you would geocode the address to get coordinates
      const mockCoordinates = {
        latitude: 37.7749 + (Math.random() - 0.5) * 0.1,
        longitude: -122.4194 + (Math.random() - 0.5) * 0.1,
      };
      
      addSavedPlace({
        name: placeName,
        address,
        type: selectedType,
        latitude: mockCoordinates.latitude,
        longitude: mockCoordinates.longitude,
      });
      
      setLoading(false);
      Alert.alert('Success', 'Place saved successfully', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    }, 1000);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen 
        options={{ 
          title: 'Add Saved Place',
          headerStyle: { backgroundColor: colors.dark.background },
          headerTintColor: colors.dark.text,
          headerTitleStyle: { color: colors.dark.text },
        }} 
      />
      
      <ScrollView style={styles.content}>
        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Place Name</Text>
            <TextInput
              style={styles.input}
              value={placeName}
              onChangeText={setPlaceName}
              placeholder="e.g., Home, Office, Gym"
              placeholderTextColor={colors.dark.subtext}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Address</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={address}
              onChangeText={setAddress}
              placeholder="Enter the full address"
              placeholderTextColor={colors.dark.subtext}
              multiline
              numberOfLines={3}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Place Type</Text>
            <View style={styles.typeSelector}>
              {placeTypes.map((type) => {
                const IconComponent = type.icon;
                const isSelected = selectedType === type.id;
                
                return (
                  <TouchableOpacity
                    key={type.id}
                    style={[
                      styles.typeOption,
                      isSelected && styles.typeOptionSelected,
                    ]}
                    onPress={() => setSelectedType(type.id as any)}
                  >
                    <IconComponent 
                      size={20} 
                      color={isSelected ? colors.common.white : colors.dark.text} 
                    />
                    <Text 
                      style={[
                        styles.typeLabel,
                        isSelected && styles.typeLabelSelected,
                      ]}
                    >
                      {type.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          <View style={styles.infoBox}>
            <Text style={styles.infoText}>
              Saved places help you quickly select frequently visited locations when booking rides.
            </Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          title="Save Place"
          onPress={handleSave}
          loading={loading}
          style={styles.saveButton}
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
  form: {
    flex: 1,
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.dark.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: colors.dark.card,
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    color: colors.dark.text,
    borderWidth: 1,
    borderColor: colors.dark.border,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  typeSelector: {
    flexDirection: 'row',
    gap: 12,
  },
  typeOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.dark.card,
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.dark.border,
  },
  typeOptionSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  typeLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.dark.text,
    marginLeft: 8,
  },
  typeLabelSelected: {
    color: colors.common.white,
  },
  infoBox: {
    backgroundColor: colors.dark.card,
    borderRadius: 8,
    padding: 16,
    marginTop: 16,
  },
  infoText: {
    fontSize: 14,
    color: colors.dark.subtext,
    textAlign: 'center',
    lineHeight: 20,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: colors.dark.border,
  },
  saveButton: {
    width: '100%',
  },
});
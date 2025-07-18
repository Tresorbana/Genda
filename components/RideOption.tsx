import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image, Animated } from 'react-native';
import { Users } from 'lucide-react-native';
import colors from '@/constants/colors';
import { useEffect, useRef } from 'react';

interface RideOptionProps {
  id: string;
  name: string;
  description: string;
  capacity: number;
  price: number;
  eta: string;
  image: string;
  selected?: boolean;
  onSelect: (id: string) => void;
  best?: boolean;
}

export const RideOption = ({ id, name, description, capacity, price, eta, image, selected, onSelect, best }: RideOptionProps) => {
  const glowAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (best) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(glowAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
          Animated.timing(glowAnim, { toValue: 0, duration: 800, useNativeDriver: true }),
        ])
      ).start();
    }
  }, [best]);
  const glowStyle = best ? {
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: glowAnim.interpolate({ inputRange: [0, 1], outputRange: [0.3, 0.8] }),
    shadowRadius: glowAnim.interpolate({ inputRange: [0, 1], outputRange: [8, 16] }),
    elevation: 8,
  } : {};
  return (
    <TouchableOpacity
      style={[styles.container, selected && styles.selectedContainer]}
      onPress={() => onSelect(id)}
    >
      <Animated.View style={[styles.image, glowStyle]}>
        <Image source={{ uri: image }} style={styles.image} />
      </Animated.View>
      <View style={styles.infoContainer}>
        <View style={styles.nameContainer}>
          <Text style={styles.name}>{name}</Text>
          <View style={styles.capacityContainer}>
            <Users size={14} color={colors.dark.subtext} />
            <Text style={styles.capacity}>{capacity}</Text>
          </View>
        </View>
        <Text style={styles.description}>{description}</Text>
        <Text style={styles.eta}>{eta}</Text>
      </View>
      <View style={styles.priceContainer}>
        <Text style={styles.price}>${price.toFixed(2)}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.dark.card,
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  selectedContainer: {
    borderColor: colors.primary,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  infoContainer: {
    flex: 1,
    marginLeft: 16,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.dark.text,
  },
  capacityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  capacity: {
    fontSize: 14,
    color: colors.dark.subtext,
    marginLeft: 4,
  },
  description: {
    fontSize: 14,
    color: colors.dark.subtext,
    marginBottom: 4,
  },
  eta: {
    fontSize: 14,
    color: colors.primary,
  },
  priceContainer: {
    marginLeft: 'auto',
  },
  price: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.dark.text,
  },
});
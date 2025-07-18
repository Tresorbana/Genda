import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { MapPin, Clock, Star } from 'lucide-react-native';
import colors from '@/constants/colors';

interface LocationItemProps {
  name: string;
  address: string;
  type?: 'recent' | 'saved' | 'popular';
  onPress: () => void;
}

export const LocationItem = ({
  name,
  address,
  type = 'recent',
  onPress,
}: LocationItemProps) => {
  const renderIcon = () => {
    switch (type) {
      case 'recent':
        return <Clock size={20} color={colors.dark.subtext} />;
      case 'saved':
        return <Star size={20} color={colors.primary} />;
      case 'popular':
        return <MapPin size={20} color={colors.secondary} />;
      default:
        return <MapPin size={20} color={colors.dark.subtext} />;
    }
  };

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.iconContainer}>{renderIcon()}</View>
      <View style={styles.textContainer}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.address}>{address}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
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
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.dark.text,
    marginBottom: 4,
  },
  address: {
    fontSize: 14,
    color: colors.dark.subtext,
  },
});
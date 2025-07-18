import React from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity, Text, ViewStyle } from 'react-native';
import { MapPin, Circle } from 'lucide-react-native';
import colors from '@/constants/colors';

interface LocationInputProps {
  placeholder: string;
  value: string;
  onPress?: () => void;
  onChangeText?: (text: string) => void;
  style?: ViewStyle;
  editable?: boolean;
  isOrigin?: boolean;
}

export const LocationInput = ({
  placeholder,
  value,
  onPress,
  onChangeText,
  style,
  editable = true,
  isOrigin = false,
}: LocationInputProps) => {
  return (
    <TouchableOpacity 
      style={[styles.container, style]} 
      onPress={onPress}
      disabled={!onPress}
      activeOpacity={onPress ? 0.7 : 1}
    >
      <View style={styles.iconContainer}>
        {isOrigin ? (
          <Circle size={12} fill={colors.primary} color={colors.primary} />
        ) : (
          <MapPin size={16} color={colors.primary} />
        )}
      </View>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor={colors.dark.subtext}
        value={value}
        onChangeText={onChangeText}
        editable={editable && !onPress}
        pointerEvents={onPress ? 'none' : 'auto'}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.dark.card,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginVertical: 6,
  },
  iconContainer: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    color: colors.dark.text,
    fontSize: 16,
  },
});
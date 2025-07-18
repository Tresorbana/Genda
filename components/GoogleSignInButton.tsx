import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import colors from '@/constants/colors';

interface GoogleSignInButtonProps {
  onPress: () => void;
  disabled?: boolean;
}

export const GoogleSignInButton = ({ onPress, disabled = false }: GoogleSignInButtonProps) => {
  return (
    <TouchableOpacity
      style={[styles.button, disabled && styles.buttonDisabled]}
      onPress={onPress}
      disabled={disabled}
    >
      <View style={styles.iconContainer}>
        <Text style={styles.googleIcon}>G</Text>
      </View>
      <Text style={styles.buttonText}>Continue with Google</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.common.white,
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderWidth: 1,
    borderColor: colors.dark.border,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  iconContainer: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  googleIcon: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.common.white,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.common.black,
  },
});
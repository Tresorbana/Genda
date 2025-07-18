import React, { ReactNode } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { ChevronDown } from 'lucide-react-native';
import colors from '@/constants/colors';

interface BottomSheetProps {
  title?: string;
  children: ReactNode;
  onClose?: () => void;
  height?: number | string;
}

const { height: screenHeight } = Dimensions.get('window');

export const BottomSheet = ({
  title,
  children,
  onClose,
  height = screenHeight * 0.6,
}: BottomSheetProps) => {
  return (
    <View style={styles.container}>
      <View style={[styles.content, { height }]}>
        <View style={styles.header}>
          <View style={styles.handle} />
          {title && <Text style={styles.title}>{title}</Text>}
          {onClose && (
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <ChevronDown size={24} color={colors.dark.text} />
            </TouchableOpacity>
          )}
        </View>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {children}
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  content: {
    backgroundColor: colors.dark.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.dark.border,
  },
  handle: {
    width: 40,
    height: 5,
    backgroundColor: colors.dark.border,
    borderRadius: 3,
    marginBottom: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.dark.text,
  },
  closeButton: {
    position: 'absolute',
    right: 0,
    top: 16,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingVertical: 20,
  },
});
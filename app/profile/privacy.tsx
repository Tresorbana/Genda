import React from 'react';
import { StyleSheet, View, Text, SafeAreaView, Switch, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Stack } from 'expo-router';
import { Shield, Eye, EyeOff, Trash2 } from 'lucide-react-native';
import { Button } from '@/components/Button';
import { useProfileStore } from '@/store/profileStore';
import colors from '@/constants/colors';

export default function PrivacyScreen() {
  const { settings, updateSettings } = useProfileStore();

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to delete your account? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            Alert.alert('Account Deletion', 'Your account deletion request has been submitted. You will receive a confirmation email within 24 hours.');
          },
        },
      ]
    );
  };

  const handleDownloadData = () => {
    Alert.alert(
      'Download Data',
      'We will prepare your data and send you a download link via email within 48 hours.',
      [{ text: 'OK' }]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen 
        options={{ 
          title: 'Privacy',
          headerStyle: { backgroundColor: colors.dark.background },
          headerTintColor: colors.dark.text,
          headerTitleStyle: { color: colors.dark.text },
        }} 
      />
      
      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data Sharing</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Location Sharing</Text>
              <Text style={styles.settingDescription}>
                Allow us to access your location for better ride matching and navigation
              </Text>
            </View>
            <Switch
              value={settings.locationSharing}
              onValueChange={(value) => updateSettings({ locationSharing: value })}
              trackColor={{ false: colors.dark.border, true: colors.primary }}
              thumbColor={colors.common.white}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Ride Data Analytics</Text>
              <Text style={styles.settingDescription}>
                Share anonymized ride data to help improve our service quality
              </Text>
            </View>
            <Switch
              value={settings.rideSharing}
              onValueChange={(value) => updateSettings({ rideSharing: value })}
              trackColor={{ false: colors.dark.border, true: colors.primary }}
              thumbColor={colors.common.white}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data Management</Text>
          
          <TouchableOpacity style={styles.actionItem} onPress={handleDownloadData}>
            <View style={styles.actionIconContainer}>
              <Eye size={20} color={colors.primary} />
            </View>
            <View style={styles.actionInfo}>
              <Text style={styles.actionLabel}>Download My Data</Text>
              <Text style={styles.actionDescription}>
                Get a copy of all your personal data
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionItem} onPress={handleDeleteAccount}>
            <View style={styles.actionIconContainer}>
              <Trash2 size={20} color={colors.common.error} />
            </View>
            <View style={styles.actionInfo}>
              <Text style={[styles.actionLabel, { color: colors.common.error }]}>
                Delete Account
              </Text>
              <Text style={styles.actionDescription}>
                Permanently delete your account and all data
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.infoSection}>
          <Shield size={24} color={colors.primary} style={styles.infoIcon} />
          <Text style={styles.infoTitle}>Your Privacy Matters</Text>
          <Text style={styles.infoText}>
            We are committed to protecting your privacy and giving you control over your personal data. 
            You can review our full Privacy Policy in the app settings or on our website.
          </Text>
          
          <Button
            title="View Privacy Policy"
            variant="outline"
            size="small"
            style={styles.policyButton}
            onPress={() => Alert.alert('Privacy Policy', 'This would open the full privacy policy.')}
          />
        </View>
      </ScrollView>
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
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.dark.text,
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.dark.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  settingInfo: {
    flex: 1,
    marginRight: 16,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.dark.text,
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    color: colors.dark.subtext,
    lineHeight: 18,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.dark.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  actionIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.dark.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  actionInfo: {
    flex: 1,
  },
  actionLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.dark.text,
    marginBottom: 4,
  },
  actionDescription: {
    fontSize: 14,
    color: colors.dark.subtext,
    lineHeight: 18,
  },
  infoSection: {
    backgroundColor: colors.dark.card,
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    marginTop: 16,
  },
  infoIcon: {
    marginBottom: 12,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.dark.text,
    marginBottom: 12,
    textAlign: 'center',
  },
  infoText: {
    fontSize: 14,
    color: colors.dark.subtext,
    lineHeight: 20,
    textAlign: 'center',
    marginBottom: 16,
  },
  policyButton: {
    paddingHorizontal: 24,
  },
});
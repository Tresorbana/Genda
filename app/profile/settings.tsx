import React from 'react';
import { StyleSheet, View, Text, SafeAreaView, Switch, ScrollView } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useProfileStore } from '@/store/profileStore';
import colors from '@/constants/colors';
import { Button } from '@/components/Button';

export default function SettingsScreen() {
  const { settings, updateSettings } = useProfileStore();
  const router = useRouter();

  const settingsOptions = [
    {
      title: 'Notifications',
      items: [
        {
          key: 'pushNotifications',
          label: 'Push Notifications',
          description: 'Receive notifications about your rides',
          value: settings.pushNotifications,
        },
        {
          key: 'smsNotifications',
          label: 'SMS Notifications',
          description: 'Receive text messages about your rides',
          value: settings.smsNotifications,
        },
        {
          key: 'promotionalEmails',
          label: 'Promotional Emails',
          description: 'Receive emails about offers and promotions',
          value: settings.promotionalEmails,
        },
      ],
    },
    {
      title: 'Privacy',
      items: [
        {
          key: 'locationSharing',
          label: 'Location Sharing',
          description: 'Share your location for better ride experience',
          value: settings.locationSharing,
        },
        {
          key: 'rideSharing',
          label: 'Ride Sharing Data',
          description: 'Share ride data to improve service quality',
          value: settings.rideSharing,
        },
      ],
    },
  ];

  const handleToggle = (key: string, value: boolean) => {
    updateSettings({ [key]: value });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen 
        options={{ 
          title: 'Settings',
          headerStyle: { backgroundColor: colors.dark.background },
          headerTintColor: colors.dark.text,
          headerTitleStyle: { color: colors.dark.text },
        }} 
      />
      
      <ScrollView style={styles.content}>
        {settingsOptions.map((section, sectionIndex) => (
          <View key={sectionIndex} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            
            {section.items.map((item, itemIndex) => (
              <View key={item.key} style={styles.settingItem}>
                <View style={styles.settingInfo}>
                  <Text style={styles.settingLabel}>{item.label}</Text>
                  <Text style={styles.settingDescription}>{item.description}</Text>
                </View>
                <Switch
                  value={item.value}
                  onValueChange={(value) => handleToggle(item.key, value)}
                  trackColor={{ false: colors.dark.border, true: colors.primary }}
                  thumbColor={colors.common.white}
                />
              </View>
            ))}
          </View>
        ))}

        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>About Settings</Text>
          <Text style={styles.infoText}>
            These settings help customize your experience and control how we communicate with you. 
            You can change these preferences at any time.
          </Text>
        </View>
      </ScrollView>
      {/* Add navigation buttons for demo/testing */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-around', padding: 16 }}>
        <Button title="Onboarding" onPress={() => router.push({ pathname: '/onboarding' })} style={{ flex: 1, marginHorizontal: 4 }} />
        <Button title="Notifications" onPress={() => router.push({ pathname: '/notification-center' })} style={{ flex: 1, marginHorizontal: 4 }} />
        <Button title="Referral" onPress={() => router.push({ pathname: '/referral' })} style={{ flex: 1, marginHorizontal: 4 }} />
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
  infoSection: {
    backgroundColor: colors.dark.card,
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.dark.text,
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: colors.dark.subtext,
    lineHeight: 20,
  },
});
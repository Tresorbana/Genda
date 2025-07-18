import React from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, SafeAreaView, Switch, Alert } from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { User, CreditCard, MapPin, Settings, ChevronRight, Bell, Shield, HelpCircle, LogOut } from 'lucide-react-native';
import { useAuthStore } from '@/store/authStore';
import { useProfileStore } from '@/store/profileStore';
import colors from '@/constants/colors';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout: authLogout } = useAuthStore();
  const { settings, updateSettings, logout: profileLogout } = useProfileStore();

  const handleLogout = () => {
    Alert.alert(
      'Log Out',
      'Are you sure you want to log out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Log Out',
          style: 'destructive',
          onPress: () => {
            profileLogout();
            authLogout();
            router.replace('/(auth)/login');
          },
        },
      ]
    );
  };

  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Please log in to view your profile</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Profile</Text>
      </View>

      <ScrollView style={styles.scrollView}>
        <View style={styles.profileSection}>
          <View style={styles.profileHeader}>
            <View style={styles.avatarContainer}>
              <Image
                source={user.avatar || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(user.name)}
                style={styles.avatar}
              />
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>{user.name}</Text>
              <Text style={styles.profileEmail}>{user.email}</Text>
              <Text style={styles.profileProvider}>
                Signed in with {user.provider === 'google' ? 'Google' : 'Email'}
              </Text>
            </View>
            <TouchableOpacity 
              style={styles.editButton}
              onPress={() => router.push('/profile/personal-info')}
            >
              <Text style={styles.editButtonText}>Edit</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          
          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => router.push('/profile/personal-info')}
          >
            <View style={styles.menuIconContainer}>
              <User size={20} color={colors.dark.text} />
            </View>
            <Text style={styles.menuText}>Personal Information</Text>
            <ChevronRight size={20} color={colors.dark.subtext} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => router.push('/profile/payment-methods')}
          >
            <View style={styles.menuIconContainer}>
              <CreditCard size={20} color={colors.dark.text} />
            </View>
            <Text style={styles.menuText}>Payment Methods</Text>
            <ChevronRight size={20} color={colors.dark.subtext} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => router.push('/profile/saved-places')}
          >
            <View style={styles.menuIconContainer}>
              <MapPin size={20} color={colors.dark.text} />
            </View>
            <Text style={styles.menuText}>Saved Places</Text>
            <ChevronRight size={20} color={colors.dark.subtext} />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          
          <View style={styles.menuItem}>
            <View style={styles.menuIconContainer}>
              <Bell size={20} color={colors.dark.text} />
            </View>
            <Text style={styles.menuText}>Notifications</Text>
            <Switch
              value={settings.notifications}
              onValueChange={(value) => updateSettings({ notifications: value })}
              trackColor={{ false: colors.dark.border, true: colors.primary }}
              thumbColor={colors.common.white}
            />
          </View>
          
          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => router.push('/profile/privacy')}
          >
            <View style={styles.menuIconContainer}>
              <Shield size={20} color={colors.dark.text} />
            </View>
            <Text style={styles.menuText}>Privacy</Text>
            <ChevronRight size={20} color={colors.dark.subtext} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => router.push('/profile/settings')}
          >
            <View style={styles.menuIconContainer}>
              <Settings size={20} color={colors.dark.text} />
            </View>
            <Text style={styles.menuText}>Settings</Text>
            <ChevronRight size={20} color={colors.dark.subtext} />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => router.push('/profile/help')}
          >
            <View style={styles.menuIconContainer}>
              <HelpCircle size={20} color={colors.dark.text} />
            </View>
            <Text style={styles.menuText}>Help</Text>
            <ChevronRight size={20} color={colors.dark.subtext} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
            <View style={styles.menuIconContainer}>
              <LogOut size={20} color={colors.common.error} />
            </View>
            <Text style={[styles.menuText, { color: colors.common.error }]}>Log Out</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Version 1.0.0</Text>
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
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.dark.border,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.dark.text,
  },
  scrollView: {
    flex: 1,
  },
  profileSection: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.dark.border,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    overflow: 'hidden',
    backgroundColor: colors.dark.card,
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  profileInfo: {
    marginLeft: 16,
    flex: 1,
  },
  profileName: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.dark.text,
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: colors.dark.subtext,
    marginBottom: 2,
  },
  profileProvider: {
    fontSize: 12,
    color: colors.primary,
  },
  editButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 16,
    backgroundColor: colors.dark.card,
  },
  editButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.primary,
  },
  section: {
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.dark.text,
    marginBottom: 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.dark.border,
  },
  menuIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.dark.card,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    color: colors.dark.text,
  },
  footer: {
    padding: 24,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: colors.dark.subtext,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  errorText: {
    fontSize: 16,
    color: colors.dark.text,
    textAlign: 'center',
  },
});
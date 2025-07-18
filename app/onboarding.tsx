import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
// Placeholder for Lottie/Undraw illustrations
export default function OnboardingScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Permissions</Text>
      <View style={styles.card}><Text>Location Access</Text></View>
      <View style={styles.card}><Text>Notifications</Text></View>
      <View style={styles.card}><Text>Camera (Profile Pic)</Text></View>
      <Button title="Allow & Continue" onPress={() => {}} />
    </View>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#111' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#fff', marginBottom: 24 },
  card: { backgroundColor: '#222', padding: 20, borderRadius: 12, marginBottom: 16, width: 280, alignItems: 'center' },
}); 
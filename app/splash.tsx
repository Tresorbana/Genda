import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
// Placeholder for LottieView or Undraw illustration
export default function SplashScreen() {
  return (
    <View style={styles.container}>
      {/* Replace with Lottie animation or Undraw illustration */}
      <Image source={require('../assets/images/splash-icon.png')} style={styles.logo} />
      <Text style={styles.title}>Welcome to Uber Clone</Text>
      <Text style={styles.tagline}>Get there fast. Rides anytime, anywhere.</Text>
      {/* Carousel placeholder */}
    </View>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000' },
  logo: { width: 120, height: 120, marginBottom: 24 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#fff', marginBottom: 8 },
  tagline: { fontSize: 16, color: '#ccc' },
}); 
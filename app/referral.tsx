import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
export default function ReferralScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Referral Program</Text>
      <Text style={styles.codeLabel}>Your Code:</Text>
      <Text style={styles.code}>UBER1234</Text>
      <View style={styles.stats}><Text>Referrals: 0</Text><Text>Bonus: $0</Text></View>
      <Button title="Share" onPress={() => {}} />
    </View>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#111' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#fff', marginBottom: 24 },
  codeLabel: { color: '#ccc', fontSize: 16 },
  code: { color: '#fff', fontSize: 28, fontWeight: 'bold', marginBottom: 16 },
  stats: { flexDirection: 'row', justifyContent: 'space-between', width: 200, marginBottom: 24 },
}); 
import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
const notifications = [
  { id: '1', type: 'ride', message: 'Your ride is arriving soon.' },
  { id: '2', type: 'promo', message: '20% off your next trip!' },
  { id: '3', type: 'system', message: 'App update available.' },
];
export default function NotificationCenter() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Notifications</Text>
      <FlatList
        data={notifications}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <MaterialIcons name="notifications" size={24} color="#fff" style={{ marginRight: 12 }} />
            <Text style={styles.message}>{item.message}</Text>
          </View>
        )}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#111', padding: 24 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#fff', marginBottom: 24 },
  item: { flexDirection: 'row', alignItems: 'center', marginBottom: 18 },
  message: { color: '#fff', fontSize: 16 },
}); 
import React, { useState } from 'react';
import { StyleSheet, View, Text, SafeAreaView, TouchableOpacity, FlatList, Alert, TextInput, Modal, Button as RNButton } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { CreditCard, Plus, Trash2, Check } from 'lucide-react-native';
import { Feather } from '@expo/vector-icons';
import { Button } from '@/components/Button';
import { useProfileStore } from '@/store/profileStore';
import colors from '@/constants/colors';

interface PaymentMethod {
  id: string;
  name: string;
  type: 'Visa' | 'Mastercard' | 'American Express' | 'Cash';
  lastFour: string;
  isDefault: boolean;
  expiryDate?: string;
}

export default function PaymentMethodsScreen() {
  const router = useRouter();
  const { paymentMethods, removePaymentMethod, setDefaultPaymentMethod } = useProfileStore();

  const [walletBalance, setWalletBalance] = useState(42.50);
  const [showAddFunds, setShowAddFunds] = useState(false);
  const [addAmount, setAddAmount] = useState('');
  const [promoCode, setPromoCode] = useState('');
  const [transactions] = useState([
    { id: 't1', type: 'add', amount: 20, date: '2024-05-01' },
    { id: 't2', type: 'ride', amount: -15.5, date: '2024-05-02' },
    { id: 't3', type: 'add', amount: 50, date: '2024-05-03' },
  ]);

  const handleRemoveCard = (id: string, name: string) => {
    Alert.alert(
      'Remove Card',
      `Are you sure you want to remove ${name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => removePaymentMethod(id),
        },
      ]
    );
  };

  const handleSetDefault = (id: string) => {
    setDefaultPaymentMethod(id);
  };

  const handleAddFunds = () => {
    setWalletBalance(b => b + parseFloat(addAmount || '0'));
    setShowAddFunds(false);
    setAddAmount('');
  };
  const handleWithdraw = () => {
    setWalletBalance(b => Math.max(0, b - 10)); // Placeholder logic
  };
  const handleApplyPromo = () => {
    // Placeholder: just clear input
    setPromoCode('');
    alert('Promo code applied!');
  };

  const getCardIcon = (type: string) => {
    return <CreditCard size={24} color={colors.dark.text} />;
  };

  const renderPaymentMethod = ({ item }: { item: PaymentMethod }) => (
    <View style={styles.cardItem}>
      <View style={styles.cardInfo}>
        <View style={styles.cardHeader}>
          {getCardIcon(item.type)}
          <View style={styles.cardDetails}>
            <Text style={styles.cardName}>{item.name}</Text>
            <Text style={styles.cardNumber}>
              {item.type} •••• {item.lastFour}
            </Text>
            {item.expiryDate && (
              <Text style={styles.cardExpiry}>Expires {item.expiryDate}</Text>
            )}
          </View>
        </View>
      </View>
      
      <View style={styles.cardActions}>
        {item.isDefault ? (
          <View style={styles.defaultBadge}>
            <Check size={16} color={colors.common.white} />
            <Text style={styles.defaultText}>Default</Text>
          </View>
        ) : (
          <TouchableOpacity
            style={styles.setDefaultButton}
            onPress={() => handleSetDefault(item.id)}
          >
            <Text style={styles.setDefaultText}>Set Default</Text>
          </TouchableOpacity>
        )}
        
        <TouchableOpacity
          style={styles.removeButton}
          onPress={() => handleRemoveCard(item.id, item.name)}
        >
          <Trash2 size={20} color={colors.common.error} />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen 
        options={{ 
          title: 'Payment Methods',
          headerStyle: { backgroundColor: colors.dark.background },
          headerTintColor: colors.dark.text,
          headerTitleStyle: { color: colors.dark.text },
        }} 
      />
      {/* Wallet Section */}
      <View style={{ backgroundColor: colors.primary, borderRadius: 16, padding: 20, margin: 16, alignItems: 'center' }}>
        <Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold' }}>Wallet Balance</Text>
        <Text style={{ color: '#fff', fontSize: 32, fontWeight: 'bold', marginVertical: 8 }}>${walletBalance.toFixed(2)}</Text>
        <View style={{ flexDirection: 'row', marginTop: 8 }}>
          <TouchableOpacity style={{ marginHorizontal: 12 }} onPress={() => setShowAddFunds(true)}>
            <Feather name="plus-circle" size={24} color="#fff" />
            <Text style={{ color: '#fff' }}>Add Funds</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{ marginHorizontal: 12 }} onPress={handleWithdraw}>
            <Feather name="arrow-down-circle" size={24} color="#fff" />
            <Text style={{ color: '#fff' }}>Withdraw</Text>
          </TouchableOpacity>
        </View>
        {/* Promo Code */}
        <View style={{ flexDirection: 'row', marginTop: 12, alignItems: 'center' }}>
          <TextInput
            style={{ backgroundColor: '#fff', borderRadius: 8, padding: 8, width: 120, marginRight: 8 }}
            placeholder="Promo code"
            value={promoCode}
            onChangeText={setPromoCode}
          />
          <TouchableOpacity onPress={handleApplyPromo} style={{ backgroundColor: '#fff', borderRadius: 8, padding: 8 }}>
            <Text style={{ color: colors.primary, fontWeight: 'bold' }}>Apply</Text>
          </TouchableOpacity>
        </View>
      </View>
      {/* Add Funds Modal */}
      <Modal visible={showAddFunds} transparent animationType="slide">
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ backgroundColor: '#fff', borderRadius: 16, padding: 24, width: 300 }}>
            <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 12 }}>Add Funds</Text>
            <TextInput
              style={{ backgroundColor: '#eee', borderRadius: 8, padding: 8, marginBottom: 12 }}
              placeholder="Amount"
              value={addAmount}
              onChangeText={setAddAmount}
              keyboardType="numeric"
            />
            <RNButton title="Add" onPress={handleAddFunds} color={colors.primary} />
            <RNButton title="Cancel" onPress={() => setShowAddFunds(false)} color={colors.common.error} />
          </View>
        </View>
      </Modal>
      {/* Transaction History */}
      <View style={{ margin: 16 }}>
        <Text style={{ color: colors.dark.text, fontSize: 18, fontWeight: 'bold', marginBottom: 8 }}>Transaction History</Text>
        {transactions.map(tx => (
          <View key={tx.id} style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
            <Text style={{ color: colors.dark.text }}>{tx.type === 'add' ? 'Add' : 'Ride'}</Text>
            <Text style={{ color: colors.dark.text }}>{tx.date}</Text>
            <Text style={{ color: tx.amount > 0 ? 'green' : 'red' }}>{tx.amount > 0 ? '+' : ''}${Math.abs(tx.amount).toFixed(2)}</Text>
          </View>
        ))}
      </View>
      
      <View style={styles.content}>
        <FlatList
          data={paymentMethods}
          keyExtractor={(item) => item.id}
          renderItem={renderPaymentMethod}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <CreditCard size={48} color={colors.dark.subtext} />
              <Text style={styles.emptyTitle}>No payment methods</Text>
              <Text style={styles.emptyText}>
                Add a payment method to start booking rides
              </Text>
            </View>
          }
        />
      </View>

      <View style={styles.footer}>
        <Button
          title="Add Payment Method"
          onPress={() => router.push('/profile/add-payment')}
          style={styles.addButton}
          variant="outline"
        />
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
  listContent: {
    flexGrow: 1,
  },
  cardItem: {
    backgroundColor: colors.dark.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.dark.border,
  },
  cardInfo: {
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardDetails: {
    marginLeft: 16,
    flex: 1,
  },
  cardName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.dark.text,
    marginBottom: 4,
  },
  cardNumber: {
    fontSize: 14,
    color: colors.dark.subtext,
    marginBottom: 2,
  },
  cardExpiry: {
    fontSize: 12,
    color: colors.dark.subtext,
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  defaultBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.secondary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  defaultText: {
    color: colors.common.white,
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 4,
  },
  setDefaultButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  setDefaultText: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '500',
  },
  removeButton: {
    padding: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.dark.text,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: colors.dark.subtext,
    textAlign: 'center',
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: colors.dark.border,
  },
  addButton: {
    width: '100%',
  },
});
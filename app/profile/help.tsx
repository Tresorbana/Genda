import React, { useState } from 'react';
import { StyleSheet, View, Text, SafeAreaView, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { Stack } from 'expo-router';
import { MessageCircle, Phone, Mail, ChevronRight, ChevronDown, Send } from 'lucide-react-native';
import { Button } from '@/components/Button';
import colors from '@/constants/colors';

const faqData = [
  {
    question: 'How do I cancel a ride?',
    answer: 'You can cancel a ride by tapping the "Cancel" button in the app before the driver arrives. Cancellation fees may apply depending on timing.',
  },
  {
    question: 'How are ride prices calculated?',
    answer: 'Ride prices are based on distance, time, demand, and local rates. You will see the estimated fare before confirming your ride.',
  },
  {
    question: 'What if I left something in the vehicle?',
    answer: 'Contact your driver through the app immediately after your trip. If you cannot reach them, use the "Report Lost Item" feature in your trip history.',
  },
  {
    question: 'How do I add a payment method?',
    answer: 'Go to Profile > Payment Methods > Add Payment Method. You can add credit cards, debit cards, or digital wallets.',
  },
  {
    question: 'Is my personal information secure?',
    answer: 'Yes, we use industry-standard encryption to protect your personal and payment information. Your data is never shared without your consent.',
  },
];

export default function HelpScreen() {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [contactMessage, setContactMessage] = useState('');
  const [showContactForm, setShowContactForm] = useState(false);

  const toggleFaq = (index: number) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  const handleSendMessage = () => {
    if (!contactMessage.trim()) {
      Alert.alert('Error', 'Please enter your message');
      return;
    }

    Alert.alert(
      'Message Sent',
      'Thank you for contacting us. We will get back to you within 24 hours.',
      [
        {
          text: 'OK',
          onPress: () => {
            setContactMessage('');
            setShowContactForm(false);
          },
        },
      ]
    );
  };

  const contactOptions = [
    {
      icon: MessageCircle,
      title: 'Live Chat',
      description: 'Chat with our support team',
      action: () => Alert.alert('Live Chat', 'Live chat feature would be implemented here'),
    },
    {
      icon: Phone,
      title: 'Call Support',
      description: '1-800-UBER-HELP',
      action: () => Alert.alert('Call Support', 'This would initiate a phone call to support'),
    },
    {
      icon: Mail,
      title: 'Email Support',
      description: 'Send us an email',
      action: () => setShowContactForm(true),
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen 
        options={{ 
          title: 'Help & Support',
          headerStyle: { backgroundColor: colors.dark.background },
          headerTintColor: colors.dark.text,
          headerTitleStyle: { color: colors.dark.text },
        }} 
      />
      
      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Support</Text>
          
          {contactOptions.map((option, index) => {
            const IconComponent = option.icon;
            return (
              <TouchableOpacity
                key={index}
                style={styles.contactItem}
                onPress={option.action}
              >
                <View style={styles.contactIconContainer}>
                  <IconComponent size={20} color={colors.primary} />
                </View>
                <View style={styles.contactInfo}>
                  <Text style={styles.contactTitle}>{option.title}</Text>
                  <Text style={styles.contactDescription}>{option.description}</Text>
                </View>
                <ChevronRight size={20} color={colors.dark.subtext} />
              </TouchableOpacity>
            );
          })}
        </View>

        {showContactForm && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Send us a message</Text>
            <View style={styles.contactForm}>
              <TextInput
                style={styles.messageInput}
                value={contactMessage}
                onChangeText={setContactMessage}
                placeholder="Describe your issue or question..."
                placeholderTextColor={colors.dark.subtext}
                multiline
                numberOfLines={4}
              />
              <Button
                title="Send Message"
                onPress={handleSendMessage}
                style={styles.sendButton}
              />
            </View>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
          
          {faqData.map((faq, index) => (
            <View key={index} style={styles.faqItem}>
              <TouchableOpacity
                style={styles.faqQuestion}
                onPress={() => toggleFaq(index)}
              >
                <Text style={styles.faqQuestionText}>{faq.question}</Text>
                <ChevronDown
                  size={20}
                  color={colors.dark.subtext}
                  style={[
                    styles.faqIcon,
                    expandedFaq === index && styles.faqIconExpanded,
                  ]}
                />
              </TouchableOpacity>
              
              {expandedFaq === index && (
                <View style={styles.faqAnswer}>
                  <Text style={styles.faqAnswerText}>{faq.answer}</Text>
                </View>
              )}
            </View>
          ))}
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>Need More Help?</Text>
          <Text style={styles.infoText}>
            Visit our Help Center online for more detailed guides and troubleshooting steps.
          </Text>
          <Button
            title="Visit Help Center"
            variant="outline"
            size="small"
            style={styles.helpCenterButton}
            onPress={() => Alert.alert('Help Center', 'This would open the web help center')}
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
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.dark.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  contactIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.dark.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  contactInfo: {
    flex: 1,
  },
  contactTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.dark.text,
    marginBottom: 4,
  },
  contactDescription: {
    fontSize: 14,
    color: colors.dark.subtext,
  },
  contactForm: {
    backgroundColor: colors.dark.card,
    borderRadius: 12,
    padding: 16,
  },
  messageInput: {
    backgroundColor: colors.dark.background,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: colors.dark.text,
    textAlignVertical: 'top',
    marginBottom: 16,
    minHeight: 100,
  },
  sendButton: {
    alignSelf: 'flex-end',
    paddingHorizontal: 24,
  },
  faqItem: {
    backgroundColor: colors.dark.card,
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
  },
  faqQuestion: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  faqQuestionText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: colors.dark.text,
  },
  faqIcon: {
    transform: [{ rotate: '0deg' }],
  },
  faqIconExpanded: {
    transform: [{ rotate: '180deg' }],
  },
  faqAnswer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderTopWidth: 1,
    borderTopColor: colors.dark.border,
  },
  faqAnswerText: {
    fontSize: 14,
    color: colors.dark.subtext,
    lineHeight: 20,
    marginTop: 12,
  },
  infoSection: {
    backgroundColor: colors.dark.card,
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    marginTop: 16,
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
  helpCenterButton: {
    paddingHorizontal: 24,
  },
});
// features/mobile-prepaid/components/PrepaidSuccessView.tsx
import React, { memo } from 'react';
import { View, Image, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/ui/themed-text';
import { Colors } from '@/constants/theme';

function PrepaidSuccessViewComponent() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Image
        source={require('@/assets/images/illustrations/payment-success.png')}
        style={styles.illustration}
        resizeMode="contain"
      />
      <ThemedText style={styles.title}>Payment success!</ThemedText>
      <ThemedText style={styles.message}>
        You have successfully paid mobile prepaid!
      </ThemedText>
      <Pressable
        style={styles.button}
        onPress={() => router.replace('/(tabs)')}
        accessibilityRole="button"
        accessibilityLabel="Confirm"
      >
        <ThemedText style={styles.buttonText}>Confirm</ThemedText>
      </Pressable>
    </View>
  );
}

export const PrepaidSuccessView = memo(PrepaidSuccessViewComponent);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    gap: 16,
  },
  illustration: {
    width: 240,
    height: 180,
    marginBottom: 8,
  },
  title: {
    fontSize: 20,
    fontFamily: 'Poppins_600SemiBold',
    color: Colors.primary,
    textAlign: 'center',
  },
  message: {
    fontSize: 14,
    fontFamily: 'Poppins_400Regular',
    color: '#687076',
    textAlign: 'center',
  },
  button: {
    width: '100%',
    paddingVertical: 16,
    borderRadius: 28,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    marginTop: 24,
  },
  buttonText: {
    fontSize: 16,
    fontFamily: 'Poppins_600SemiBold',
    color: '#FFFFFF',
  },
});

import { Slot } from 'expo-router';
import { ClerkProvider } from '@clerk/clerk-expo'
import { tokenCache } from '@clerk/clerk-expo/token-cache'
import Toast from 'react-native-toast-message';

import '../global.css'

export default function RootLayout() {
  return (
      <ClerkProvider tokenCache={tokenCache}>
          <Slot />
          <Toast />
      </ClerkProvider>
  );
} 

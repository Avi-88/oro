import { Slot } from 'expo-router';
import { ClerkProvider } from '@clerk/clerk-expo'
import { tokenCache } from '@clerk/clerk-expo/token-cache'
import Toast from 'react-native-toast-message';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import '../global.css'

export default function RootLayout() {
  return (
      <ClerkProvider tokenCache={tokenCache}>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <Slot />
          <Toast />
        </GestureHandlerRootView>
      </ClerkProvider>
  );
} 

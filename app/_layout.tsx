import { Slot } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ClerkProvider } from '@clerk/clerk-expo'
import { tokenCache } from '@clerk/clerk-expo/token-cache'
import '../global.css'

export default function RootLayout() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ClerkProvider tokenCache={tokenCache}>
        <Slot />
      </ClerkProvider>
    </SafeAreaView>
  );
} 

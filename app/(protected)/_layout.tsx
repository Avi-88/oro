import { SignedIn, SignedOut, useAuth } from '@clerk/clerk-expo';
import { Stack, Redirect } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';
import { TabBarProvider } from '../../context/TabBarContext';

export default function ProtectedLayout() {
  const { isLoaded } = useAuth();

  if (!isLoaded) {
    // Show a splash or loading indicator while auth state is being determined
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <TabBarProvider>
      <SignedIn>
        <Stack   screenOptions={{ headerShown: false, contentStyle: { backgroundColor: "transparent" } }} />
      </SignedIn>
      <SignedOut>
        <Redirect href="/welcome" />
      </SignedOut>
    </TabBarProvider>
  );
}
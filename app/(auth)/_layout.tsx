import { SignedIn, SignedOut, useAuth } from '@clerk/clerk-expo';
import { Stack, Redirect } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';

export default function AuthLayout() {
  const { isLoaded } = useAuth();

  if (!isLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <>
      <SignedOut>
        <Stack screenOptions={{ headerShown: false }} />
      </SignedOut>
      <SignedIn>
        <Redirect href="/" />
      </SignedIn>
    </>
  );
}
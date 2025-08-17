import { SignedIn, SignedOut, useAuth } from '@clerk/clerk-expo';
import { Stack, Redirect, SplashScreen } from 'expo-router';
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
        <Stack
          initialRouteName='welcome'
          screenOptions={{
            headerShown: false,
            animation: 'slide_from_bottom',
            // contentStyle: {backgroundColor: '#D3D1FD'}
          }}
        />
      </SignedOut>
      <SignedIn>
        <Redirect href="/" />
      </SignedIn>
    </>
  );
}
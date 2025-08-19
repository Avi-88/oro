import { SignedIn, SignedOut, useAuth } from '@clerk/clerk-expo';
import { Stack, Redirect, SplashScreen } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';

// const forFadeFromBottom = ({ current, layouts }) => {
//   return {
//     cardStyle: {
//       transform: [
//         {
//           translateY: current.progress.interpolate({
//             inputRange: [0, 1],
//             outputRange: [layouts.screen.height, 0],
//           }),
//         },
//       ],
//       opacity: current.progress.interpolate({
//         inputRange: [0, 0.5, 1],
//         outputRange: [0, 0.25, 1],
//       }),
//     },
//   };
// };

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
            // cardStyleInterpolator: forFadeFromBottom,
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
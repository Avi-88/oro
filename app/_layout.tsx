import { Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View } from 'react-native';

export default function RootLayout() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View className="flex-1 bg-gray-50">
        <Stack screenOptions={{headerShown: false}} />
      </View>
    </SafeAreaView>
  );
} 
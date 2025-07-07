import { Stack } from 'expo-router';
import { View, Text } from 'react-native';

export default function AuthLayout() {
  return (
    <View className="flex-1 bg-gray-50">
      <Stack screenOptions={{ headerShown: false }} />
    </View>
  );
} 
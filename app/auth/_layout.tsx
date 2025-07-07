import { Stack } from 'expo-router';
import { View, Text } from 'react-native';

export default function AuthLayout() {
  return (
    <View className="flex-1 bg-gray-50">
      <View className="py-8 items-center">
        <Text className="text-xl font-bold text-blue-700">Auth Area</Text>
      </View>
      <Stack />
    </View>
  );
} 
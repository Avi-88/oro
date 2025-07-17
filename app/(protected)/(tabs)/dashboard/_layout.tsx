import { Stack } from 'expo-router';
import { View, Text } from 'react-native';

const  DashboardLayout = () => {
  return (
    <View className="flex-1 bg-gray-100">
      <View className="py-8 items-center">
        <Text className="text-xl font-bold text-green-700">Dashboard Area</Text>
      </View>
      <Stack screenOptions={{ headerShown: false }} />
    </View>
  );
} 

export default DashboardLayout
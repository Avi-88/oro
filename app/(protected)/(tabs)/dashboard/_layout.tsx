import { Stack } from 'expo-router';
import { View, Text } from 'react-native';

const  DashboardLayout = () => {
  return (
    <View className="flex-1 bg-gray-100">
      <Stack screenOptions={{ headerShown: false }} />
    </View>
  );
} 

export default DashboardLayout
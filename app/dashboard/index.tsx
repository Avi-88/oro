import { View, Text } from 'react-native';
import { Link } from 'expo-router';
import Button from '../../components/Button';

export default function DashboardHomeScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="text-2xl font-bold text-green-600 mb-2">Dashboard Home</Text>
      <Text className="mb-4 text-base text-gray-700">This is the dashboard home screen.</Text>
      <Link href="/" asChild>
        <Button title="Back to Home" />
      </Link>
    </View>
  );
} 
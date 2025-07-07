import { View, Text } from 'react-native';
import { Link } from 'expo-router';
import Button from '../../components/Button';

export default function LoginScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-red-300">
      <Text className="text-2xl font-bold text-blue-600 mb-2">Login</Text>
      <Text className="mb-4 text-base text-gray-700">This is the login screen.</Text>
      <Link href="/" asChild>
        {/* <Button title="Back to Home" /> */}
      </Link>
    </View>
  );
} 
import { View, Text } from 'react-native';
import { Link } from 'expo-router';
import Button from '../components/Button';
import { useAuth } from '../hooks/useAuth';

export default function HomeScreen() {
  const { user, login, logout } = useAuth();

  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="text-2xl font-bold text-blue-600 mb-2">Welcome to Oro RN (Expo Router)!</Text>
      <Text className="mb-4 text-base text-gray-700">This is your Home Screen using NativeWind and Expo Router.</Text>
      {user ? (
        <>
          <Text className="mb-2">Hello, {user.name}!</Text>
          <Button title="Logout" onPress={logout} className="mb-2" />
        </>
      ) : (
        <Button title="Login as John" onPress={() => login('John')} className="mb-2" />
      )}
      <Link href="/auth/login" asChild>
        <Button title="Go to Login" className="mb-2" />
      </Link>
      <Link href="/dashboard" asChild>
        <Button title="Go to Dashboard" />
      </Link>
    </View>
  );
} 
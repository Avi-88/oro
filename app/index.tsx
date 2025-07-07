import { Redirect } from 'expo-router';
import { useAuth } from '../hooks/useAuth';
import { View, Text } from 'react-native';
import '../global.css';

export default function Index() {
  const { user } = useAuth();
  console.log('Index component rendered');

  if (user) {
    // User is authenticated, go to protected area
    return <Redirect href="/protected" />;
  }
  // Not authenticated, go to login
  return <Redirect href="/auth/login" />;

}
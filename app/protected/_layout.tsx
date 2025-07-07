import { Stack, Redirect } from 'expo-router';
import { useAuth } from '../../hooks/useAuth';

export default function ProtectedLayout() {
  const { user } = useAuth();

  if (!user) {
    // Not authenticated, redirect to login
    return <Redirect href="/auth/login" />;
  }

  // Authenticated, render the stack (tabs)
  return <Stack  screenOptions={{headerShown: false}} />;
}
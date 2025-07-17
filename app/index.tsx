import { Redirect } from 'expo-router';
import { useAuth } from '@clerk/clerk-expo';
import '../global.css';

export default function Index() {
  const { isSignedIn } = useAuth()
  console.log('Index component rendered');

  if (isSignedIn) {
    return <Redirect href="/" />;
  }
  
  return <Redirect href="/login" />;
}

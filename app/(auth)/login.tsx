import { 
  View, 
  Text, 
  KeyboardAvoidingView, 
  Platform, 
  Keyboard,
  TouchableWithoutFeedback,
  Animated,
  TouchableOpacity
} from 'react-native';
import { Link, router } from 'expo-router';
import { useSignIn } from '@clerk/clerk-expo'
import { useState, useEffect, useRef } from 'react';
import Toast from 'react-native-toast-message';
import InputField from '../../components/common/InputField';

export default function LoginScreen() {

  const [emailAddress, setEmailAddress] = useState('')
  const [password, setPassword] = useState('')

  const { signIn, setActive, isLoaded } = useSignIn()

  const fadeAnim1 = useRef(new Animated.Value(0)).current;
  const fadeAnim2 = useRef(new Animated.Value(0)).current;
  const fadeAnim3 = useRef(new Animated.Value(0)).current;
  const fadeAnim4 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.stagger(100, [
      Animated.timing(fadeAnim1, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim2, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim3, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim4, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const onSignInPress = async () => {
    if (!isLoaded) return
    try {
      const signInAttempt = await signIn.create({
        identifier: emailAddress,
        password,
      })
      if (signInAttempt.status === 'complete') {
        await setActive({ session: signInAttempt.createdSessionId })
        Toast.show({
          type: 'success',
          text1: 'Login Successful',
          text2: 'Welcome back!',
        });
        router.replace('/')
      } else {
        console.error(JSON.stringify(signInAttempt, null, 2))
        Toast.show({
          type: 'error',
          text1: 'Login Failed',
          text2: 'Please check your credentials and try again.',
        });
      }
    } catch (err) {
      console.error(JSON.stringify(err, null, 2))
      Toast.show({
        type: 'error',
        text1: 'Login Failed',
        text2: err.errors[0].message,
      });
    }
  }


  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View className='flex-1 bg-white'>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          className="flex-1 justify-center items-center"
        >
          <Animated.View style={{ opacity: fadeAnim1 }} className='w-full flex flex-col justify-center items-center px-6'>
            <Text className='text-pink-400 text-4xl font-bold pb-4 text-center'>Welcome Back!</Text>
            <Text className='text-pink-300 font-semibold text-2xl text-center'>
              We're so excited to see you again.
            </Text>
          </Animated.View>
          <Animated.View style={{ opacity: fadeAnim2 }} className='w-4/6 mt-10'>
            <InputField
              value={emailAddress}
              onChangeText={setEmailAddress}
              placeHolder='Your email...'
            />
          </Animated.View>
          <Animated.View style={{ opacity: fadeAnim3 }} className='w-4/6 mt-4'>
            <InputField
              value={password}
              onChangeText={setPassword}
              placeHolder='Your password...'
              isSensitive={true}
            />
          </Animated.View>
          <Animated.View style={{ opacity: fadeAnim4 }} className='w-4/6 mt-10'>
            <TouchableOpacity
              onPress={onSignInPress}
              className='py-4 px-8 rounded-full w-full bg-pink-400'
            >
              <Text className='text-white font-bold text-center'>Login</Text>
            </TouchableOpacity>
            <Text className="text-center text-gray-400 text-sm mt-6">
              Don't have an account?{' '}
              <Link href="/signup" className="text-pink-400 font-semibold">Sign up</Link>
            </Text>
          </Animated.View>
        </KeyboardAvoidingView>
      </View>
    </TouchableWithoutFeedback>
  );
}
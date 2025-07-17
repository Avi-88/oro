import { 
  View, 
  Text, 
  TextInput, 
  Image, 
  KeyboardAvoidingView, 
  Platform, 
  Keyboard, 
  TouchableWithoutFeedback, 
  Dimensions, 
  Pressable, 
  ScrollView 
} from 'react-native';
import { Link, router } from 'expo-router';
import { useSignUp } from '@clerk/clerk-expo'
import { BlurView } from 'expo-blur';
import { useState, useEffect } from 'react';
import Button from 'components/common/Button';

const { height: screenHeight } = Dimensions.get('window');

export default function SignupScreen() {

  const [emailAddress, setEmailAddress] = useState('')
  const [password, setPassword] = useState('')
  const [pendingVerification, setPendingVerification] = useState(false)
  const [code, setCode] = useState('')
  const [showPassword, setShowPassword] = useState(false);
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  const { isLoaded, signUp, setActive } = useSignUp()

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardVisible(true);
    });
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardVisible(false);
    });
    return () => {
      keyboardDidShowListener?.remove();
      keyboardDidHideListener?.remove();
    };
  }, []);

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  const onSignUpPress = async () => {
    if (!isLoaded) return
    try {
      await signUp.create({
        emailAddress,
        password,
      })

      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' })
      setPendingVerification(true)
    } catch (err) {
      console.error(JSON.stringify(err, null, 2))
    }
  }

  const onVerifyPress = async () => {
    if (!isLoaded) return
    try {
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code,
      })

      if (signUpAttempt.status === 'complete') {
        await setActive({ session: signUpAttempt.createdSessionId })
        router.replace('/')
      } else {
        console.error(JSON.stringify(signUpAttempt, null, 2))
      }
    } catch (err) {
      console.error(JSON.stringify(err, null, 2))
    }
  }


  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <View className="flex-1 bg-black">
        {/* Background Image */}
        <Image
          source={require('../../assets/gradient-head.png')}
          className="absolute w-full h-5/6 top-10 left-10"
          resizeMode="cover"
          style={{ zIndex: 0 }}
        />
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
          className="flex-1"
          style={{ zIndex: 1 }}
        >
          <ScrollView
            contentContainerStyle={{
              flexGrow: 1,
              justifyContent: keyboardVisible ? 'flex-start' : 'center',
              alignItems: 'center',
              paddingHorizontal: 20,
              paddingTop: keyboardVisible ? 100 : screenHeight * 0.3,
              paddingBottom: 40,
            }}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            scrollEnabled={true}
          >
            <View className="w-full max-w-sm rounded-2xl overflow-hidden"
              style={{
                backgroundColor: 'transparent',
                borderRadius: 24,
                borderWidth: 1,
                borderColor: 'rgba(255,255,255,0.25)',
                shadowColor: '#000',
                shadowOpacity: 0.12,
                shadowRadius: 24,
                shadowOffset: { width: 0, height: 8 },
                elevation: 8
              }}>
              <BlurView
                intensity={55}
                tint="dark"
                style={{
                  backgroundColor: 'rgba(24,24,37,0.65)',
                  padding: 28,
                  borderRadius: 24,
                  alignItems: 'stretch',
                  borderWidth: 1,
                  borderColor: 'rgba(255,255,255,0.10)',
                }}
              >
                {pendingVerification ? (
                        <>
                        <Text className="text-sm text-gray-300 mb-1 font-medium">Verify your email</Text>
                        <TextInput
                          style={{ backgroundColor: 'rgba(255,255,255,0.08)', color: '#F3F4F6', borderWidth: 1, borderColor: 'rgba(255,255,255,0.12)' }}
                          textContentType='oneTimeCode'
                          placeholderTextColor="#888"
                          className="w-full px-4 py-3 rounded-lg my-2"
                          value={code}
                          placeholder="Enter your verification code"
                          onChangeText={(code) => setCode(code)}
                        />
                        <Button
                          title="Continue"
                          className="w-full rounded-lg px-4 py-3 my-2 text-gray-100 font-bold"
                          style={{ backgroundColor: '#059669' }}
                          onPress={() => {
                            dismissKeyboard();
                            onVerifyPress()
                          }}
                        />
                      </>
                ) : (
                <>
                <Text className="text-3xl font-bold text-gray-100 mb-2">Sign up</Text>
                <Text className="text-base text-gray-400 mb-1">Looks like you don't have an account.</Text>
                <Text className="text-base text-gray-400 mb-6">
                  Let's create a new account for you!
                </Text>
                <Text className="text-sm text-gray-300 mb-1 font-medium">Email</Text>
                <TextInput
                  className="w-full px-4 py-3 rounded-lg mb-4"
                  style={{ backgroundColor: 'rgba(255,255,255,0.08)', color: '#F3F4F6', borderWidth: 1, borderColor: 'rgba(255,255,255,0.12)' }}
                  placeholder="Email"
                  placeholderTextColor="#888"
                  value={emailAddress}
                  onChangeText={setEmailAddress}
                  autoCapitalize="words"
                  autoCorrect={false}
                  returnKeyType="next"
                />
                <Text className="text-sm text-gray-300 mb-1 font-medium">Password</Text>
                <View className="relative mb-4">
                  <TextInput
                    className="w-full px-4 py-3 rounded-lg pr-16"
                    style={{ backgroundColor: 'rgba(255,255,255,0.08)', color: '#F3F4F6', borderWidth: 1, borderColor: 'rgba(255,255,255,0.12)' }}
                    placeholder="Password"
                    placeholderTextColor="#888"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                    autoCorrect={false}
                    returnKeyType="done"
                    onSubmitEditing={dismissKeyboard}
                  />
                  <Pressable
                    onPress={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 px-2 py-1"
                  >
                    <Text className="text-emerald-400 font-semibold text-sm">
                      {showPassword ? 'Hide' : 'View'}
                    </Text>
                  </Pressable>
                </View>
                <Text className="text-xs text-gray-400 mb-4">
                  By selecting Agree and continue below, I agree to <Text className="text-emerald-400 font-semibold">Terms of Service</Text> and <Text className="text-emerald-400 font-semibold">Privacy Policy</Text>.
                </Text>
                <Button
                  title="Agree and continue"
                  className="w-full rounded-lg px-4 py-4 text-gray-100 font-bold"
                  style={{ backgroundColor: '#059669' }}
                  onPress={() => {
                    dismissKeyboard();
                    onSignUpPress();
                  }}
                />
                <Text className="text-center text-gray-400 text-sm mt-6">
                  Already have an account?{' '}
                  <Link href="/login" className="text-emerald-400 font-semibold">Sign in</Link>
                </Text>
                </>
                )}
              </BlurView>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </TouchableWithoutFeedback>
  );
}


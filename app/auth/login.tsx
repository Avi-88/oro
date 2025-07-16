import { 
  View, 
  Text, 
  TextInput, 
  Image, 
  KeyboardAvoidingView, 
  ScrollView, 
  Platform, 
  Keyboard,
  TouchableWithoutFeedback,
  Dimensions,
  Pressable
} from 'react-native';
import { Link } from 'expo-router';
import Button from '../../components/Button';
import { BlurView } from 'expo-blur';
import { useState, useEffect } from 'react';

const { height: screenHeight } = Dimensions.get('window');

export default function LoginScreen() {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [username, setUsername] = useState('');

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
                <Text className="text-3xl font-bold text-gray-100 mb-2">Log in</Text>
                <Text className="text-base text-gray-400 mb-6">Welcome back! Please enter your credentials to continue.</Text>
                {/* Username Input */}
                <Text className="text-sm text-gray-300 mb-1 font-medium">Username</Text>
                <TextInput
                  className="w-full px-4 py-3 rounded-lg mb-4"
                  style={{ backgroundColor: 'rgba(255,255,255,0.08)', color: '#F3F4F6', borderWidth: 1, borderColor: 'rgba(255,255,255,0.12)' }}
                  placeholder="Username"
                  placeholderTextColor="#888"
                  value={username}
                  onChangeText={setUsername}
                  autoCapitalize="none"
                  autoCorrect={false}
                  returnKeyType="next"
                  blurOnSubmit={false}
                />
                {/* Password Input */}
                <Text className="text-sm text-gray-300 mb-1 font-medium">Password</Text>
                <View className="relative mb-6">
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
                <Button
                  title="Continue"
                  className="w-full rounded-lg px-4 py-4 text-gray-100 font-bold"
                  style={{ backgroundColor: '#059669' }}
                  onPress={() => {
                    dismissKeyboard();
                    // Add your login logic here
                  }}
                />
                <Text className="text-center text-gray-400 text-sm mt-2">
                  Don't have an account?{' '}
                  <Link href="/auth/signup" className="text-emerald-400 font-semibold">Sign up</Link>
                </Text>
              </BlurView>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </TouchableWithoutFeedback>
  );
}
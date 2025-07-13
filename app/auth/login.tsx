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
  Dimensions 
} from 'react-native';
import { Link } from 'expo-router';
import Button from '../../components/Button';
import { BlurView } from 'expo-blur';
import { useState, useEffect } from 'react';

const { height: screenHeight } = Dimensions.get('window');

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [keyboardVisible, setKeyboardVisible] = useState(false);

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
        
        {/* Main Content */}
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
            <View className="w-full max-w-sm rounded-3xl overflow-hidden border border-white/30 bg-white/20">
              <BlurView
                intensity={10}
                tint="dark"
                className="w-full p-8 rounded-3xl items-center bg-white/20"
              >
                <Text className="text-3xl font-bold text-blue-600 mb-6">Login</Text>
                <TextInput
                  className="w-full mb-4 px-4 py-3 rounded-xl bg-white/60 text-base text-gray-800"
                  placeholder="Email"
                  placeholderTextColor="#888"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  returnKeyType="next"
                  blurOnSubmit={false}
                />
                <TextInput
                  className="w-full mb-6 px-4 py-3 rounded-xl bg-white/60 text-base text-gray-800"
                  placeholder="Password"
                  placeholderTextColor="#888"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  autoCapitalize="none"
                  autoCorrect={false}
                  returnKeyType="done"
                  onSubmitEditing={dismissKeyboard}
                />
                <Button 
                  title="Login" 
                  className="w-full rounded-xl px-4 py-3 mb-4" 
                  onPress={() => {
                    dismissKeyboard();
                    // Add your login logic here
                  }} 
                />
                <Text className="text-sm text-gray-300 text-center">
                  Don't have an account? {' '}
                  <Link href="/auth/signup" className="text-blue-600 font-semibold">
                    Sign up
                  </Link>
                </Text>
              </BlurView>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </TouchableWithoutFeedback>
  );
}
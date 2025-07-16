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
import { BlurView } from 'expo-blur';
import { useState, useEffect } from 'react';
import Button from '../../components/Button';

const { height: screenHeight } = Dimensions.get('window');

export default function SignupScreen() {
  const [name, setName] = useState('Jane Doe');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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
                <Text className="text-3xl font-bold text-gray-100 mb-2">Sign up</Text>
                <Text className="text-base text-gray-400 mb-1">Looks like you don't have an account.</Text>
                <Text className="text-base text-gray-400 mb-6">
                  Let's create a new account for <Text className="font-semibold text-gray-100">jane.doe@gmail.com</Text>
                </Text>
                <Text className="text-sm text-gray-300 mb-1 font-medium">Name</Text>
                <TextInput
                  className="w-full px-4 py-3 rounded-lg mb-4"
                  style={{ backgroundColor: 'rgba(255,255,255,0.08)', color: '#F3F4F6', borderWidth: 1, borderColor: 'rgba(255,255,255,0.12)' }}
                  placeholder="Name"
                  placeholderTextColor="#888"
                  value={name}
                  onChangeText={setName}
                  autoCapitalize="words"
                  autoCorrect={false}
                  returnKeyType="next"
                  blurOnSubmit={false}
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
                    // Add your signup logic here
                  }}
                />
              </BlurView>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </TouchableWithoutFeedback>
  );
}


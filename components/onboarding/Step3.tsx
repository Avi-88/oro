import React, { useState , useEffect} from 'react';
import { View, Text, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import InputField from 'components/common/InputField';
import { validateEmail, validatePassword } from 'utils/validation';

interface Step3Props {
  onDataChange: (data: { [key: string]: any }) => void;
  data: { [key: string]: any };
  onStepComplete: (isComplete: boolean) => void;
}

const Step3 = ({ onDataChange, data, onStepComplete }: Step3Props) => {
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const handleEmailChange = (text: string) => {
    const emailError = validateEmail(text);
    setErrors({ ...errors, email: emailError });
    onDataChange({ ...data, email: text });
    onStepComplete(!emailError && !errors.password);
  };

  const handlePasswordChange = (text: string) => {
    const passwordError = validatePassword(text);
    setErrors({ ...errors, password: passwordError });
    onDataChange({ ...data, password: text });
    onStepComplete(!errors.email && !passwordError);
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
    <View className='flex flex-col h-full justify-start items-center'>
      <View className='w-full flex flex-col min-h-[50%] justify-center items-center px-6'>
        <Text className='text-pink-400 text-4xl font-bold pb-4 text-center'>You're almost set!</Text>
        <Text className='text-pink-300 font-semibold text-2xl text-center'>
          Lets create your account so you can start your journey with Enso.
        </Text>
      </View>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
        className="flex flex-col justify-center items-center w-4/6"
        style={{ zIndex: 1 }}
      >
        <View className='w-full mb-4'>
          <InputField
            value={data.email || ''}
            onChangeText={handleEmailChange}
            placeHolder='Your email...'
            error={errors.email}
          />
        </View>
        <View className='w-full'>
          <InputField
            value={data.password || ''}
            isSensitive={true}
            onChangeText={handlePasswordChange}
            placeHolder='Your password...'
            error={errors.password}
          />
        </View>
      </KeyboardAvoidingView>
    </View>
    </TouchableWithoutFeedback>
  );
};

export default Step3;
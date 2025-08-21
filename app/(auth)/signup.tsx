
import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import Onboarding from '../../components/common/Onboarding';
import { useSignUp } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';
import Toast from 'react-native-toast-message';
import Step1 from '../../components/onboarding/Step1';
import Step2 from '../../components/onboarding/Step2';
import Step3 from '../../components/onboarding/Step3';
import VerifyCode from '../../components/onboarding/VerifyCode';

const steps = [Step1, Step2, Step3, VerifyCode];

const SignupScreen = () => {
  const { isLoaded, signUp, setActive } = useSignUp();
  const router = useRouter();
  const [onboardingKey, setOnboardingKey] = React.useState(0);

  const handleSignUp = async (data) => {
    if (!isLoaded) {
      return;
    }
    try {
      const { email, password, nickName } = data;

      await signUp.create({
        username: nickName,
        emailAddress: email,
        password,
      });

      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
      return true; // Indicate success
    } catch (err: any) {
      console.error(JSON.stringify(err, null, 2));
      Toast.show({
        type: 'error',
        text1: 'Signup Failed',
        text2: err.errors[0].message,
      });
      return false; // Indicate failure
    }
  };

  const handleVerifyCode = async (data) => {
    if (!isLoaded) {
      return;
    }
    try {
      const { code } = data;
      const completeSignUp = await signUp.attemptEmailAddressVerification({ code });
      if (completeSignUp.status === 'complete') {
        await setActive({ session: completeSignUp.createdSessionId });
        Toast.show({
          type: 'success',
          text1: 'Signup Successful',
          text2: 'Welcome!',
        });
        router.replace('/');
      } else {
        console.error(JSON.stringify(completeSignUp, null, 2));
        Toast.show({
          type: 'error',
          text1: 'Verification Failed',
          text2: 'Please check the code and try again.',
        });
      }
    } catch (err: any) {
      console.error(JSON.stringify(err, null, 2));
      Toast.show({
        type: 'error',
        text1: 'Verification Failed',
        text2: err.errors[0].message,
      });
    }
  };

  const onComplete = async (data) => {
    await handleVerifyCode(data);
    setOnboardingKey(onboardingKey + 1);
  };

  const renderNextButton = (onNext, isStepComplete, currentData, currentStep) => {
    if (currentStep === 2) {
      return (
        <TouchableOpacity
          onPress={async () => {
            const success = await handleSignUp(currentData);
            if (success) {
              onNext();
            }
          }}
          disabled={!isStepComplete}
          className={`py-6 px-8 rounded-full w-full ` + (!isStepComplete ? "bg-gray-200" : "bg-pink-400")}
        >
          <Text className='text-white font-bold text-center'>Sign Up</Text>
        </TouchableOpacity>
      );
    }
    return (
      <TouchableOpacity
        onPress={onNext}
        disabled={!isStepComplete}
        className={`py-6 px-8 rounded-full w-full ` + (!isStepComplete ? "bg-gray-300" : "bg-pink-400")}
      >
        <Text className='text-white font-bold text-center'>Next</Text>
      </TouchableOpacity>
    );
  };

  return (
    <Onboarding
      key={onboardingKey}
      steps={steps}
      onComplete={onComplete}
      renderNextButton={renderNextButton}
    />
  );
};

export default SignupScreen;

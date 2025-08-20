import React, { useState } from 'react';
import { TouchableOpacity, Text, View } from 'react-native';
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
  const [currentStep, setCurrentStep] = useState(0);
  const [data, setData] = useState({});
  const [stepCompletion, setStepCompletion] = useState(steps.map(() => false));

  const handleSignUp = async () => {
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
      setCurrentStep(3);
    } catch (err: any) {
      console.error(JSON.stringify(err, null, 2));
      Toast.show({
        type: 'error',
        text1: 'Signup Failed',
        text2: err.errors[0].message,
      });
    }
  };

  const handleVerifyCode = async () => {
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

  const onNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const onPrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const onDataChange = (stepData) => {
    setData({ ...data, ...stepData });
  };

  const onStepComplete = (stepIndex, isComplete) => {
    const newCompletion = [...stepCompletion];
    newCompletion[stepIndex] = isComplete;
    setStepCompletion(newCompletion);
  };

  const renderNextButton = () => {
    if (currentStep === 2) {
      return (
        <TouchableOpacity
          onPress={handleSignUp}
          disabled={!stepCompletion[currentStep]}
          className={`py-6 px-8 rounded-full w-full ` + (!stepCompletion[currentStep] ? "bg-gray-200" : "bg-pink-400")}
        >
          <Text className='text-white font-bold text-center'>Sign Up</Text>
        </TouchableOpacity>
      );
    }
    if (currentStep === 3) {
      return (
        <TouchableOpacity
          onPress={handleVerifyCode}
          disabled={!stepCompletion[currentStep]}
          className={`py-6 px-8 rounded-full w-full ` + (!stepCompletion[currentStep] ? "bg-gray-200" : "bg-pink-400")}
        >
          <Text className='text-white font-bold text-center'>Verify Code</Text>
        </TouchableOpacity>
      );
    }
    return (
      <TouchableOpacity
        onPress={onNext}
        disabled={!stepCompletion[currentStep]}
        className={`py-6 px-8 rounded-full w-full ` + (!stepCompletion[currentStep] ? "bg-gray-300" : "bg-pink-400")}
      >
        <Text className='text-white font-bold text-center'>Next</Text>
      </TouchableOpacity>
    );
  };

  return (
    <Onboarding
      steps={steps}
      currentStep={currentStep}
      onNext={onNext}
      onPrev={onPrev}
      onDataChange={onDataChange}
      data={data}
      onStepComplete={onStepComplete}
      stepCompletion={stepCompletion}
      renderNextButton={renderNextButton}
    />
  );
};

export default SignupScreen;
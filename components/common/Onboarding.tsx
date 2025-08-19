import React, { useState, useRef } from 'react';
import { View, TouchableOpacity, Animated, Easing, Text, SafeAreaView, Dimensions } from 'react-native';
import { Feather } from '@expo/vector-icons';
import Step1 from '../onboarding/Step1';
import Step2 from '../onboarding/Step2';
import Step3 from '../onboarding/Step3';

const { width } = Dimensions.get('window');
const steps = [Step1, Step2, Step3];

const Onboarding = ({ onFinish }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [data, setData] = useState({});
  const [isStepComplete, setIsStepComplete] = useState(false);
  const anim = useRef(new Animated.Value(0)).current;

  const nextStep = () => {
    if (isStepComplete && currentStep < steps.length - 1) {
      setIsStepComplete(false);
      Animated.timing(anim, {
        toValue: currentStep + 1,
        duration: 400,
        easing: Easing.out(Easing.poly(4)),
        useNativeDriver: true,
      }).start(() => {
        setCurrentStep(currentStep + 1);
      });
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setIsStepComplete(false);
      Animated.timing(anim, {
        toValue: currentStep - 1,
        duration: 400,
        easing: Easing.out(Easing.poly(4)),
        useNativeDriver: true,
      }).start(() => {
        setCurrentStep(currentStep - 1);
      });
    }
  };

  const handleDataChange = (stepData) => {
    setData({ ...data, ...stepData });
  };

  const handleStepComplete = (isComplete) => {
    setIsStepComplete(isComplete);
  };

  const finishOnboarding = () => {
    if (onFinish) {
      onFinish(data);
    }
  };

  const renderStep = (StepComponent, index) => {
    const translateX = anim.interpolate({
      inputRange: [index - 1, index, index + 1],
      outputRange: [width, 0, -width],
    });

    const opacity = anim.interpolate({
      inputRange: [index - 1, index, index + 1],
      outputRange: [0, 1, 0],
    });

    return (
      <Animated.View
        key={index}
        style={{
          width: '100%',
          height:"100%",
          position: 'absolute',
          transform: [{ translateX }],
          opacity: opacity,
        }}
      >
        <StepComponent onDataChange={handleDataChange} data={data} onStepComplete={handleStepComplete} isActive={index === currentStep} />
      </Animated.View>
    );
  };

  return (
    <View className='h-full py-10 relative'>    
        {currentStep > 0 && (
          <TouchableOpacity
            onPress={prevStep}
            className='absolute left-5 h-content w-content p-1 top-20 z-50 rounded-full'
          >
            <Feather className='' name="chevron-left" size={30} color="pink" />
          </TouchableOpacity>
        )}
      <View style={{ flex: 1, flexDirection: 'row', position: 'relative' }}>
        {steps.map(renderStep)}
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'center', paddingBottom: 20 }}>
        {steps.map((_, i) => (
          <View
            key={i}
            style={{
              width: 10,
              height: 10,
              borderRadius: 5,
              backgroundColor: i === currentStep ? 'pink' : '#E5E7EB',
              marginHorizontal: 5,
            }}
          />
        ))}
      </View>
      <View className='flex justify-center items-center px-20 pb-20'>
        {currentStep === steps.length - 1 ? (
            <TouchableOpacity
              onPress={finishOnboarding}
              className='py-4 px-8 rounded-full w-full bg-pink-400'
            >
              <Text className='text-white font-bold text-center'>Finish</Text>
            </TouchableOpacity>
        ) : (
          isStepComplete ? (
            <TouchableOpacity
              onPress={nextStep}
              className='py-4 px-8 rounded-full w-full bg-pink-400'
            >
              <Text className='text-white font-bold text-center'>Next</Text>
            </TouchableOpacity>
          ) : (
            <View className='py-4 px-8 rounded-full w-full bg-gray-300'>
              <Text className='text-white font-bold text-center'>Next</Text>
            </View>
          )
        )}
      </View>
      </View>
  );
};

export default Onboarding;
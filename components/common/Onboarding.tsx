
import React, { useRef, useState, useEffect } from 'react';
import { View, TouchableOpacity, Animated, Easing, Text, Dimensions } from 'react-native';
import { Feather } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

interface OnboardingProps {
  steps: any[];
  onComplete: (data: any) => void;
  onClose?: () => void;
  renderNextButton?: (onNext: () => void, isStepComplete: boolean, data: any, currentStep: number) => React.ReactNode;
  crownComponent?: React.ReactNode;
}

const Onboarding = ({ steps, onComplete, onClose, renderNextButton, crownComponent }: OnboardingProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [data, setData] = useState({});
  const [stepCompletion, setStepCompletion] = useState(steps.map(() => false));
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(anim, {
      toValue: currentStep,
      duration: 400,
      easing: Easing.out(Easing.poly(4)),
      useNativeDriver: true,
    }).start();
  }, [currentStep]);

  const onNext = () => {
    if (stepCompletion[currentStep]) {
      const nextStep = currentStep + 1;
      if (nextStep < steps.length) {
        setCurrentStep(nextStep);
      } else {
        console.log("this is data on complete", data)
        onComplete(data);
      }
    }
  };

  const onPrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const onDataChange = (stepData: any) => {
    setData((prevData) => ({ ...prevData, ...stepData }));
  };

  const onStepComplete = (stepIndex: number, isComplete : boolean) => {
    const newCompletion = [...stepCompletion];
    newCompletion[stepIndex] = isComplete;
    setStepCompletion(newCompletion);
  };

  const renderStep = (StepComponent: any, index: number) => {
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
        <StepComponent onDataChange={onDataChange} data={data} onStepComplete={(isComplete : boolean) => onStepComplete(index, isComplete)} isActive={index === currentStep} />
      </Animated.View>
    );
  };

  return (
    <View className='h-full flex flex-col justify-center  w-full py-10 relative'>
      <View className='relative w-full  mb-10  flex-row flex justify-center items-center'>
        {currentStep > 0 && (
          <TouchableOpacity
            onPress={onPrev}
            className='left-10 bg-pink-100 absolute h-content w-content p-2 z-50 rounded-xl'
          >
            <Feather className='' name="chevron-left" size={30} color="pink" />
          </TouchableOpacity>
        )}
        {crownComponent && crownComponent}
        {onClose && (
            <TouchableOpacity
                onPress={onClose}
                className='h-content bg-pink-100 absolute right-10 w-content p-2 z-50 rounded-xl'
            >
                <Feather className='' name="x" size={30} color="pink" />
            </TouchableOpacity>
        )}
      </View>
      <View  style={{ flex: 1, flexDirection: 'row', position: 'relative' }}>
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
          {renderNextButton ? renderNextButton(onNext, stepCompletion[currentStep], data, currentStep) : (
            <TouchableOpacity
              onPress={onNext}
              disabled={!stepCompletion[currentStep]}
              className={'py-6 px-8 rounded-full w-full ' + (stepCompletion[currentStep] ? 'bg-pink-400' : 'bg-gray-300')}
            >
              <Text className='text-white font-bold text-center'>Next</Text>
            </TouchableOpacity>
          )}
      </View>
      </View>
  );
};

export default Onboarding;

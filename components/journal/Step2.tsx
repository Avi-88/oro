import { useState, useRef, useEffect } from 'react';
import { View, Text, Animated } from 'react-native';
import ScrollableMultiSelect from 'components/common/ScrollableMultiSelect';

interface Step2Props {
  onDataChange: (data: { [key: string]: any }) => void;
  data: { [key: string]: any };
  onStepComplete: (isComplete: boolean) => void;
  isActive: boolean;
}

const Step2 = ({ onDataChange, data, onStepComplete, isActive }: Step2Props) => {
  const [selectedReasons, setSelectedReasons] = useState<string[]>([]);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isActive) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        delay: 200,
        useNativeDriver: true,
      }).start();
    } else {
      fadeAnim.setValue(0);
    }
  }, [isActive, fadeAnim]);

  const getDynamicQuestion = () => {
    const mood = data.mood;
    switch (mood) {
      case 'Really Bad':
      case 'Bad':
        return "Oh no, that's terrible. What's got you feeling that way?";
      case 'Okay':
        return "Glad to hear things are okay. What's contributing to that feeling?";
      case 'Good':
      case 'Really Good':
        return "That's great to hear! What's making you feel so good?";
      default:
        return "What's the reason for you feeling this way?";
    }
  };

  const reasonOptions = [
    { key: 'Work', label: 'Work', icon: 'briefcase-outline' },
    { key: 'Relationship', label: 'Relationship', icon: 'heart-outline' },
    { key: 'Exercise', label: 'Exercise', icon: 'weight-lifter' },
    { key: 'Weather', label: 'Weather', icon: 'weather-cloudy' },
    { key: 'Family', label: 'Family', icon: 'home-outline' },
    { key: 'Friends', label: 'Friends', icon: 'account-group-outline' },
    { key: 'Health', label: 'Health', icon: 'medical-bag' },
    { key: 'Travel', label: 'Travel', icon: 'airplane' },
    { key: 'Hobbies', label: 'Hobbies', icon: 'gamepad-variant-outline' },
    { key: 'Other', label: 'Other', icon: 'dots-horizontal' },
  ];

  const handleSelectionChange = (selectedValues: string[]) => {
    setSelectedReasons(selectedValues);
    onDataChange({ ...data, reasons: selectedValues });
    onStepComplete(selectedValues.length > 0);
  };

  return (
    <Animated.View 
      className='w-full h-full flex justify-center items-center px-4'
      style={{ opacity: fadeAnim }}
    >
      <Text className='text-pink-400 text-center text-3xl font-bold mb-10'>
        {getDynamicQuestion()}
      </Text>
      
      <ScrollableMultiSelect
        options={reasonOptions}
        selectedValues={selectedReasons}
        onSelectionChange={handleSelectionChange}
        multiSelect={true}
        itemsPerRow={2}
      />
    </Animated.View>
  );
};

export default Step2;
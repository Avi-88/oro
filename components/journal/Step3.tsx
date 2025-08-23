import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, Animated, ScrollView } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { LinearGradient } from 'expo-linear-gradient';
import ScrollableMultiSelect from 'components/common/ScrollableMultiSelect';

interface Step3Props {
  onDataChange: (data: { [key: string]: any }) => void;
  data: { [key: string]: any };
  onStepComplete: (isComplete: boolean) => void;
  isActive: boolean; // Added isActive prop
}

const Step3 = ({ onDataChange, data, onStepComplete, isActive }: Step3Props) => {
  const [selectedFeelings, setSelectedFeelings] = useState<string[]>([]);
  const fadeAnim = useRef(new Animated.Value(0)).current; // Initial value for opacity: 0

  useEffect(() => {
    if (isActive) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500, // Fade in duration
        delay: 200, // Slight delay
        useNativeDriver: true,
      }).start();
    } else {
      fadeAnim.setValue(0); // Reset opacity when not active
    }
  }, [isActive, fadeAnim]);

  const feelings = [
    { key: 'Happy', label: 'Happy', icon: 'emoticon-happy-outline' },
    { key: 'Sad', label: 'Sad', icon: 'emoticon-sad-outline' },
    { key: 'Anxious', label: 'Anxious', icon: 'emoticon-neutral-outline' },
    { key: 'Excited', label: 'Excited', icon: 'emoticon-excited-outline' },
    { key: 'Calm', label: 'Calm', icon: 'emoticon-cool-outline' },
    { key: 'Stressed', label: 'Stressed', icon: 'emoticon-dead-outline' },
    { key: 'Grateful', label: 'Grateful', icon: 'emoticon-kiss-outline' },
    { key: 'Tired', label: 'Tired', icon: 'emoticon-dead-outline' },
    { key: 'Energetic', label: 'Energetic', icon: 'flash-outline' },
    { key: 'Confused', label: 'Confused', icon: 'emoticon-confused-outline' },
    { key: 'Angry', label: 'Angry', icon: 'emoticon-angry-outline' },
    { key: 'Hopeful', label: 'Hopeful', icon: 'emoticon-happy-outline' },
    { key: 'Relaxed', label: 'Relaxed', icon: 'emoticon-cool-outline' },
    { key: 'Motivated', label: 'Motivated', icon: 'run' },
    { key: 'Overwhelmed', label: 'Overwhelmed', icon: 'emoticon-cry-outline' },
    { key: 'Content', label: 'Content', icon: 'emoticon-outline' },
    { key: 'Lonely', label: 'Lonely', icon: 'emoticon-sad-outline' },
    { key: 'Inspired', label: 'Inspired', icon: 'lightbulb-on-outline' },
  ];
  

  const handleFeelingSelect = (feeling: string) => {
    let newSelectedFeelings;
    if (selectedFeelings.includes(feeling)) {
      newSelectedFeelings = selectedFeelings.filter((f) => f !== feeling);
    } else {
      newSelectedFeelings = [...selectedFeelings, feeling];
    }
    setSelectedFeelings(newSelectedFeelings);
    onDataChange({ ...data, feelings: newSelectedFeelings });
    onStepComplete(newSelectedFeelings.length > 0);
  };

  const handleSelectionChange = (selectedValues: string[]) => {
    setSelectedFeelings(selectedValues);
    onDataChange({ ...data, feelings: selectedValues });
    onStepComplete(selectedValues.length > 0);
  };

  return (
    <Animated.View 
      className='w-full h-full flex justify-center items-center p-4'
      style={{ opacity: fadeAnim }} // Apply animated opacity
    >
      <Text className='text-pink-400 text-center text-3xl font-bold mb-8'>What other feelings are you experiencing?</Text>
      <ScrollableMultiSelect
        options={feelings}
        selectedValues={selectedFeelings}
        onSelectionChange={handleSelectionChange}
        multiSelect={true}
        itemsPerRow={2}
      />
    </Animated.View>
  );
};

export default Step3;
import { useState, useRef, useEffect } from 'react';
import { Text, Animated } from 'react-native';
import ScrollableMultiSelect from 'components/common/ScrollableMultiSelect';

interface Step3Props {
  onDataChange: (data: { [key: string]: any }) => void;
  data: { [key: string]: any };
  onStepComplete: (isComplete: boolean) => void;
  isActive: boolean; 
}

const Step3 = ({ onDataChange, data, onStepComplete, isActive }: Step3Props) => {
  const [selectedFeelings, setSelectedFeelings] = useState<string[]>([]);
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
  

  const handleSelectionChange = (selectedValues: string[]) => {
    setSelectedFeelings(selectedValues);
    onDataChange({ ...data, feelings: selectedValues });
    onStepComplete(selectedValues.length > 0);
  };

  return (
    <Animated.View 
      className='w-full h-full flex justify-center items-center p-4'
      style={{ opacity: fadeAnim }} 
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
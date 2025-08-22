
import { View, Text } from 'react-native';
import ArcSlider from './MoodSlider';

interface Step1Props {
  onDataChange: (data: { [key: string]: any }) => void;
  data: { [key: string]: any };
  onStepComplete: (isComplete: boolean) => void;
}

const Step1 = ({ onDataChange, data, onStepComplete }: Step1Props) => {

  const moodSteps = [
    { emoji: '😭', label: 'Really Bad' },
    { emoji: '😞', label: 'Bad' },
    { emoji: '😐', label: 'Okay' },
    { emoji: '😊', label: 'Good' },
    { emoji: '😄', label: 'Really Good' }
];

const handleStepChange = (step) => {
    console.log('Current mood:', step?.label);
    onStepComplete(step)
};

  return (
    <View className='w-full h-full flex justify-center items-center'>
      <Text className='text-2xl font-bold mb-8'>How are you feeling today?</Text>
      <ArcSlider
            steps={moodSteps}
            onStepChange={handleStepChange}
            initialStep={2} // Start at "Okay"
            title="How are you feeling?"
            showLabels={true}
            showCurrentDisplay={true}
        />
    </View>
  );
};

export default Step1;

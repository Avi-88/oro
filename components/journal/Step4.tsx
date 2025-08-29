import { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, Animated } from 'react-native';

interface Step4Props {
  onDataChange: (data: { [key: string]: any }) => void;
  data: { [key: string]: any };
  onStepComplete: (isComplete: boolean) => void;
  isActive: boolean;
}

const Step4 = ({ onDataChange, data, onStepComplete, isActive }: Step4Props) => {
  const [note, setNote] = useState<string>('');
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

  const handleNoteChange = (text: string) => {
    setNote(text);
    onDataChange({ ...data, note: text });
    onStepComplete(text.trim().length > 0);
  };

  return (
    <Animated.View 
      className='w-full h-full flex justify-center items-center px-4'
      style={{ opacity: fadeAnim }}
    >
      <Text className='text-pink-400 text-center text-3xl font-bold mb-8'>
        Any additional thoughts or notes?
      </Text>
      
      <View className='w-full px-6'>
        <View className='w-full relative bg-pink-100 px-4 py-6 rounded-xl min-h-32'>
          {!note && (
            <Text className='absolute top-6 left-4 text-pink-300 font-semibold' style={{ letterSpacing: 1.2 }}>
              Write your thoughts here...
            </Text>
          )}
          <TextInput
            className='w-full text-pink-300 font-semibold tracking-wide'
            value={note}
            onChangeText={handleNoteChange}
            multiline={true}
            textAlignVertical="top"
            style={{ minHeight: 80 }}
          />
        </View>
      </View>
    </Animated.View>
  );
};

export default Step4;
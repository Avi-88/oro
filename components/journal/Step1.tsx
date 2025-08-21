
import React from 'react';
import { View, Text, TextInput } from 'react-native';

interface Step1Props {
  onDataChange: (data: { [key: string]: any }) => void;
  onStepComplete: (isComplete: boolean) => void;
}

const Step1 = ({ onDataChange, onStepComplete }: Step1Props) => {
  const [text, setText] = React.useState('');

  const handleChange = (text: string) => {
    setText(text);
    onDataChange({ text: text.trim() });
    onStepComplete(text.length > 0);
  }

  return (
    <View className='w-full h-full flex justify-center items-center'>
      <Text>Step 1</Text>
      <TextInput
        placeholder="Enter something for step 1"
        value={text}
        onChangeText={handleChange}
      />
    </View>
  );
};

export default Step1;

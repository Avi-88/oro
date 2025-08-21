
import React from 'react';
import { View, Text, TextInput } from 'react-native';

interface Step3Props {
  onDataChange: (data: { [key: string]: any }) => void;
  data: { [key: string]: any };
  onStepComplete: (isComplete: boolean) => void;
}

const Step3 = ({ onDataChange, data, onStepComplete } : Step3Props) => {

  const handleChange = (text: string) => {
    onDataChange({ ...data, text3: text.trim() });
    onStepComplete(text.length > 0);
  }

  return (
    <View className='w-full h-full flex justify-center items-center'>
      <Text>Step 3</Text>
      <TextInput
        placeholder="Enter something for step 1"
        value={data.text3 || ''}
        onChangeText={handleChange}
      />
    </View>
  );
};

export default Step3;

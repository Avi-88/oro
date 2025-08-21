
import React from 'react';
import { View, Text, TextInput } from 'react-native';

interface Step2Props {
  onDataChange: (data: { [key: string]: any }) => void;
  data: { [key: string]: any };
  onStepComplete: (isComplete: boolean) => void;
}


const Step2 = ({ onDataChange, data, onStepComplete }: Step2Props) => {

  const handleChange = (text: string) => {
    onDataChange({ ...data, text2: text.trim() });
    onStepComplete(text.length > 0);
  }

  return (
    <View className='w-full h-full flex justify-center items-center'>
      <Text>Step 2</Text>
      <TextInput
        placeholder="Enter something for step 2"
        value={data.text2 || ''}
        onChangeText={handleChange}
      />
    </View>
  );
};

export default Step2;


import React from 'react';
import { View, Text, TextInput } from 'react-native';

interface Step2Props {
  onDataChange: (data: { [key: string]: any }) => void;
  onStepComplete: (isComplete: boolean) => void;
}


const Step2 = ({ onDataChange, onStepComplete }: Step2Props) => {
  const [text2, setText2] = React.useState('');

  const handleChange = (text2: string) => {
    setText2(text2);
    onDataChange({ text2: text2.trim() });
    onStepComplete(text2.length > 0);
  }

  return (
    <View className='w-full h-full flex justify-center items-center'>
      <Text>Step 2</Text>
      <TextInput
        placeholder="Enter something for step 2"
        value={text2}
        onChangeText={handleChange}
      />
    </View>
  );
};

export default Step2;

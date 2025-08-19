import React, { useState } from 'react';
import { View, Text } from 'react-native';
import Button from '../common/Button';

const options = ['Yes', 'No', 'I am not comfortable sharing right now'];

interface Step2Props {
  onDataChange: (data: { [key: string]: any }) => void;
  data: { [key: string]: any };
  onStepComplete: (isComplete: boolean) => void;
}

const Step2 = ({ onDataChange, data, onStepComplete } : Step2Props) => {
  const [selectedOption, setSelectedOption] = useState(null);

  const handleSelect = (option) => {
    setSelectedOption(option);
    onDataChange({ therapy: option });
    onStepComplete(true);
  };

  return (
    <View className='flex flex-col h-full justify-start items-center'>
      <View className='w-full flex flex-col min-h-[50%] justify-center items-center px-4'>
        <Text className='text-pink-400 text-4xl font-bold pb-4 text-center'>
          Welcome, {data.nickName || 'friend'}!
        </Text>
        <Text className='text-pink-300 font-semibold text-2xl text-center'>
          To help us personalize your journey, could you share if you are currently in therapy?
        </Text>
      </View>
      <View className="w-4/6">
        {options.map((option, index) => (
          <Button
            key={index}
            title={option}
            onPress={() => handleSelect(option)}
            className={
              `bg-pink-100 rounded-xl mb-4 ` +
              (selectedOption === option ? 'border border-pink-400' : 'border border-pink-100')
            }
            textClassName='text-pink-300 py-2 font-semibold'
          />
        ))}
      </View>
    </View>
  );
};

export default Step2;
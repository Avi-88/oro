import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

const options = ['Option 1', 'Option 2', 'Option 3'];

const Step2 = ({ onDataChange }) => {
  const [selectedOption, setSelectedOption] = useState(null);

  const handleSelect = (option) => {
    setSelectedOption(option);
    onDataChange({ purpose: option });
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>What are you here for?</Text>
      <Text style={{ fontSize: 16, textAlign: 'center', marginBottom: 40 }}>
        This will help us personalize your experience.
      </Text>
      {options.map((option, index) => (
        <TouchableOpacity
          key={index}
          onPress={() => handleSelect(option)}
          style={{
            width: '100%',
            borderWidth: 1,
            borderColor: selectedOption === option ? '#f472b6' : '#E5E7EB',
            borderRadius: 10,
            padding: 15,
            marginBottom: 10,
            backgroundColor: selectedOption === option ? '#fce7f3' : 'white',
          }}
        >
          <Text>{option}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default Step2;
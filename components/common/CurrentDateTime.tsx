import { useState, useEffect, useCallback } from 'react';
import {  StyleSheet, Text, View } from 'react-native';

const CurrentDateTime = () => {
  // State to hold the formatted date and time string
  const [currentDateTime, setCurrentDateTime] = useState('');

  const updateDateTime = useCallback(() => {
    const now = new Date();

    const options = {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    };

    const formatter = new Intl.DateTimeFormat('en-US', options);
    const formattedDateTime = formatter.format(now)
                                      .replace(',', '')       
                                      .replace(' at ', ' - '); 
    setCurrentDateTime(formattedDateTime);
  }, []);

  useEffect(() => {
    updateDateTime();

    const intervalId = setInterval(updateDateTime, 60000);

    return () => clearInterval(intervalId);
  }, [updateDateTime]);

  return (
    <View className='bg-pink-100 w-content rounded-full px-4 py-2' >
      <Text className='text-pink-300 font-semibold'>{currentDateTime}</Text>
    </View>
  );
};


export default CurrentDateTime
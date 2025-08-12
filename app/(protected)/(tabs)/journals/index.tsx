import { View, Text } from 'react-native';

const JournalsPage = () => {
  return (
    <View className='flex-1 items-center justify-center bg-transparent'>
      <Text className='text-white text-xl font-semibold'>Journals</Text>
      <Text className='text-gray-300 mt-2'>Your personal journal entries</Text>
    </View>
  );
};

export default JournalsPage; 
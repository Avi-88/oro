import { View, Text, ImageBackground } from 'react-native';

const InsightsPage = () => {
  return (
    <ImageBackground
    source={require('../../../../assets/bgl-1.jpeg')}
      className='flex-1 h-full w-full'
      resizeMode="cover"
    >
      <View className='flex-1 items-center justify-center bg-transparent'>
        <Text className='text-white text-xl font-semibold'>Insights</Text>
        <Text className='text-gray-300 mt-2'>Your mood insights and analytics</Text>
      </View>
    </ImageBackground>
  );
};

export default InsightsPage; 
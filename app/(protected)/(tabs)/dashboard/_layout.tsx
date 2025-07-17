import { Stack } from 'expo-router';
import { View, Text, ImageBackground } from 'react-native';

const  DashboardLayout = () => {
  return (
    <ImageBackground
    source={require('../../../../assets/bg-1.png')}
      className='flex-1 h-full w-full'
      resizeMode="cover"
    >
    <View className="flex-1 bg-transparent">
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: "transparent" } }} />
    </View>
    </ImageBackground>
  );
} 

export default DashboardLayout
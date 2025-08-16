import { Stack } from 'expo-router';
import { View, Text ,ImageBackground} from 'react-native';

const  InsightsLayout = () => {
  return (
    // <ImageBackground
    // source={require('../../../../assets/bgl-1.jpeg')}
    //   className='flex-1 h-full w-full'
    //   resizeMode="cover"
    // >
      <View className="flex-1 bg-transparent">
        <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: "transparent" } }} />
      </View>
 
  );
} 

export default InsightsLayout
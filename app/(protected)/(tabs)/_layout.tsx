import { Tabs, useRouter } from 'expo-router';
import { ImageBackground, TouchableOpacity } from 'react-native';
import CustomTabBar from '../../../components/common/CustomTabBar';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { BlurView } from 'expo-blur';

export default function TabsLayout() {
  const router = useRouter();

  return (
    <ImageBackground
      source={require('../../../assets/bgl-1.jpeg')}
      className="flex-1"
      resizeMode="cover"
    >
      <Tabs 
        tabBar={props => <CustomTabBar {...props}/>}
        screenOptions={{
          headerTitleAlign: 'center',
          headerTransparent: true,
          // headerBackground: () => (
          //   <BlurView
          //     intensity={120}
          //     tint="light"
          //     style={{ flex: 1 }}
          //   />
          // ),
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} style={{ marginLeft: 15 }}>
              <Ionicons name="chevron-back" size={24} color="black" />
            </TouchableOpacity>
          ),
        }}
      >
        <Tabs.Screen
          name="dashboard"
          options={{
            title: 'Home',
            headerShown: false,
          }}
        />
        <Tabs.Screen
          name="insights"
          options={{
            title: 'Insights',
          }}
        />
        <Tabs.Screen
          name="mood"
          options={{
            title: 'Mood Entry',
          }}
        />
        <Tabs.Screen
          name="journals"
          options={{
            title: 'Journals',
          }}
        />
        <Tabs.Screen
          name="account"
          options={{
            title: 'Account',
          }}
        />
      </Tabs>
    </ImageBackground>
  );
}
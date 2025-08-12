import { Tabs } from 'expo-router';
import { ImageBackground } from 'react-native';
import CustomTabBar from '../../../components/common/CustomTabBar';

export default function TabsLayout() {
  return (
    <ImageBackground
      source={require('../../../assets/bgl-1.jpeg')}
      className="flex-1"
      resizeMode="cover"
    >
      <Tabs 
        tabBar={props => <CustomTabBar {...props}/>}
        screenOptions={{
          headerShown: false,
        }}
      >
        <Tabs.Screen
          name="dashboard"
          options={{
            title: 'Home',
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
import { Tabs } from 'expo-router';
import Ionicons from 'react-native-vector-icons/Ionicons';
import CustomTabBar from 'components/common/CustomTabBar';

export default function TabsLayout() {
  return (
    <Tabs 
      tabBar={props => <CustomTabBar {...props}/>}
      sceneContainerStyle={{ backgroundColor: 'transparent' }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{
          title: 'Dashboard',
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          title: 'Account',
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}
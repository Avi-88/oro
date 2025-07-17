import { View, Pressable } from 'react-native';
import { BlurView } from 'expo-blur';
import Ionicons from 'react-native-vector-icons/Ionicons';

const CustomTabBar = ({ state, descriptors, navigation }) => {
  return (
    <View className="absolute width-full bottom-0 left-0 right-0 pb-8 px-6">
      <View 
        className="mx-auto rounded-3xl overflow-hidden max-w-[90%] w-full"
        style={{
          backgroundColor: 'transparent',
          borderRadius: 32,
          borderWidth: 1,
          borderColor: 'rgba(255,255,255,0.25)',
          // shadowColor: '#000',
          // shadowOpacity: 0.12,
          // shadowRadius: 24,
          // shadowOffset: { width: 0, height: 8 },
          elevation: 8,
        }}
      >
        <BlurView
          intensity={55}
          tint="dark"
          style={{
            // backgroundColor: 'rgba(24,24,37,0.65)',
            paddingHorizontal: 16,
            paddingVertical: 12,
            borderRadius: 32,
          }}
        >
          <View className="flex-row justify-between items-center">
            {state.routes.map((route, index) => {
              const { options } = descriptors[route.key];
              const isFocused = state.index === index;

              const onPress = () => {
                const event = navigation.emit({
                  type: 'tabPress',
                  target: route.key,
                  canPreventDefault: true,
                });

                if (!isFocused && !event.defaultPrevented) {
                  navigation.navigate(route.name);
                }
              };

              const onLongPress = () => {
                navigation.emit({
                  type: 'tabLongPress',
                  target: route.key,
                });
              };

              // Get the icon name from the route
              const getIconName = (routeName, focused) => {
                const iconMap = {
                  dashboard: focused ? 'home' : 'home-outline',
                  account: focused ? 'person' : 'person-outline',
                };
                return iconMap[routeName] || 'ellipse-outline';
              };

              return (
                <Pressable
                  key={route.key}
                  onPress={onPress}
                  onLongPress={onLongPress}
                  className="flex-1 items-center justify-center"
                >
                  <View className="items-center">
                    <Ionicons
                      name={getIconName(route.name, isFocused)}
                      size={22}
                      color={isFocused ? '#3B82F6' : '#64748B'}
                    />
                    {isFocused && (
                      <View 
                        className="w-6 h-1 mt-1  rounded-full"
                        style={{ backgroundColor: '#3B82F6' }}
                      />
                    )}
                  </View>
                </Pressable>
              );
            })}
          </View>
        </BlurView>
      </View>
    </View>
  );
};

export default CustomTabBar;
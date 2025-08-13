import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { BlurView } from 'expo-blur';
import { Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Map route names to icons - exactly 5 tabs as shown in reference
const tabIcons = {
  dashboard: {
    name: 'home',
    IconComponent: Feather,
  },
  insights: {
    name: 'bar-chart-2',
    IconComponent: Feather,
  },
  mood: {
    name: 'plus',
    IconComponent: Feather,
  },
  journals: {
    name: 'book-open',
    IconComponent: Feather,
  },
  account: {
    name: 'user',
    IconComponent: Feather,
  },
};

export default function CustomTabBar({ state, descriptors, navigation }) {
  const insets = useSafeAreaInsets();

  return (
    <View className="absolute left-0 right-0 bottom-0 w-full">
      <View className="rounded-t-3xl  overflow-hidden">
        <BlurView
          intensity={110}
          tint="light"
          className="border border-white/20"
          style={{
            paddingBottom: insets.bottom,
          }}
        >
          <View className="flex-row justify-between items-center py-4 px-6" style={{ minHeight: 40 }}>
            {state.routes.map((route, index) => {
              const isFocused = state.index === index;
              const iconDetails = tabIcons[route.name] || { name: 'alert-circle', IconComponent: Feather };
              const IconComponent = iconDetails.IconComponent;
              const iconName = iconDetails.name;

              const onPress = () => {
                const event = navigation.emit({
                  type: 'tabPress',
                  target: route.key,
                  canPreventDefault: true,
                });
                if (!isFocused && !event.defaultPrevented) {
                  navigation.navigate(route.name, route.params);
                }
              };

              return (
                <TouchableOpacity
                  key={route.key}
                  onPress={onPress}
                  className="items-center justify-center flex-1"
                  activeOpacity={0.7}
                  style={{ height: 40 }}
                >
                  <IconComponent
                    name={iconName}
                    size={24}
                    color={isFocused ? "#8b5cf6" : "#374151"}
                  />
                </TouchableOpacity>
              );
            })}
          </View>
        </BlurView>
      </View>
    </View>
  );
}
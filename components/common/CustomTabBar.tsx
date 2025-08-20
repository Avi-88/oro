
import React from 'react';
import { View, TouchableOpacity, Dimensions } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';

const { width } = Dimensions.get('window');
const TAB_BAR_HEIGHT = 65;
const BUTTON_DIAMETER = 60;
const BORDER_WIDTH = 4;
const TOTAL_BUTTON_DIAMETER = BUTTON_DIAMETER + BORDER_WIDTH * 2; // 68
const NOTCH_RADIUS = TOTAL_BUTTON_DIAMETER / 2 + 8; // 34 + 8 = 42
const CORNER_RADIUS = 25;

const tabIcons = {
  dashboard: { name: 'home', IconComponent: Feather },
  insights: { name: 'bar-chart-2', IconComponent: Feather },
  mood: { name: 'plus', IconComponent: Feather },
  journals: { name: 'book-open', IconComponent: Feather },
  account: { name: 'user', IconComponent: Feather },
};

const CustomTabBar = ({ state, navigation }) => {
  const insets = useSafeAreaInsets();

  const moodRoute = state.routes.find(route => route.name === 'mood');
  const moodRouteIndex = state.routes.findIndex(route => route.name === 'mood');
  const isMoodFocused = state.index === moodRouteIndex;

  const d = `
    M 0 ${CORNER_RADIUS}
    A ${CORNER_RADIUS} ${CORNER_RADIUS} 0 0 1 ${CORNER_RADIUS} 0
    L ${width / 2 - NOTCH_RADIUS} 0
    A ${NOTCH_RADIUS} ${NOTCH_RADIUS} 0 0 0 ${width / 2 + NOTCH_RADIUS} 0
    L ${width - CORNER_RADIUS} 0
    A ${CORNER_RADIUS} ${CORNER_RADIUS} 0 0 1 ${width} ${CORNER_RADIUS}
    L ${width} ${TAB_BAR_HEIGHT + insets.bottom}
    L 0 ${TAB_BAR_HEIGHT + insets.bottom}
    Z
  `;

  return (
    <View className="absolute left-0 right-0 bottom-0 items-center">
      <Svg width={width} height={TAB_BAR_HEIGHT + insets.bottom}>
        <Path d={d} fill="rgba(255, 255, 255, 0.95)" stroke="rgba(0,0,0,0.05)" strokeWidth={1} />
      </Svg>

      {moodRoute && (
        <TouchableOpacity
          key={moodRoute.key}
          onPress={() => {
            const event = navigation.emit({ type: 'tabPress', target: moodRoute.key, canPreventDefault: true });
            if (!isMoodFocused && !event.defaultPrevented) {
              navigation.navigate(moodRoute.name, moodRoute.params);
            }
          }}
          className="w-[${BUTTON_DIAMETER}px] p-4 h-[${BUTTON_DIAMETER}px] rounded-full bg-pink-400 justify-center items-center absolute top-[-32px] z-10  shadow-lg"
          activeOpacity={0.8}
        >
          <Feather name="plus" size={32} color="white" />
        </TouchableOpacity>
      )}

      <View
        className="flex-row justify-around items-center absolute bottom-2 w-full"
        style={{ height: TAB_BAR_HEIGHT, paddingBottom: insets.bottom }}
      >
        {state.routes.map((route, index) => {
          const isFocused = state.index === index;
          const { IconComponent, name } = tabIcons[route.name] || {};

          const onPress = () => {
            const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name, route.params);
            }
          };

          if (route.name === 'mood') {
            return <View key={route.key} className="flex-1" />;
          }

          return (
            <TouchableOpacity
              key={route.key}
              onPress={onPress}
              className="flex-1 items-center justify-center h-full"
              activeOpacity={0.7}
            >
              <IconComponent name={name} size={24} color={isFocused ? '#f472b6' : '#374151'} />
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

export default CustomTabBar;

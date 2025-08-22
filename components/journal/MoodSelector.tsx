import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Svg, Path, Circle, Defs, LinearGradient, Stop } from 'react-native-svg';
import { PanGestureHandler } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedProps,
  useAnimatedGestureHandler,
  withSpring,
  useAnimatedStyle,
  runOnJS,
  interpolate,
} from 'react-native-reanimated';

const AnimatedPath = Animated.createAnimatedComponent(Path);
const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const AnimatedView = Animated.createAnimatedComponent(View);

const MoodSelector = ({
  size = 320,
  strokeWidth = 20,
  onMoodChange,
}) => {
  const center = size / 2;
  const radius = (size - strokeWidth * 3) / 2;
  
  const progress = useSharedValue(0.5); // Start in the middle (neutral mood)
  const scale = useSharedValue(1);
  const [currentMood, setCurrentMood] = useState(2);

  const moods = [
    { label: 'Terrible', emoji: '😢', color: '#FF6B6B' },
    { label: 'Bad', emoji: '😞', color: '#FF8E53' },
    { label: 'Okay', emoji: '😐', color: '#4ECDC4' },
    { label: 'Good', emoji: '😊', color: '#45B7D1' },
    { label: 'Awesome', emoji: '😍', color: '#96CEB4' },
  ];

  const gestureHandler = useAnimatedGestureHandler({
    onStart: () => {
      scale.value = withSpring(1.3, { damping: 15 });
    },
    onActive: (event) => {
      // Calculate angle from touch position
      const deltaX = event.x - center;
      const deltaY = event.y - center;
      let touchAngle = Math.atan2(deltaY, deltaX);
      
      // Normalize angle to 0-2π
      if (touchAngle < 0) touchAngle += 2 * Math.PI;
      
      // Convert angle to progress (0-1)
      // Semicircle from π (left) to 0/2π (right)
      let newProgress;
      if (touchAngle >= Math.PI) {
        // Left half: π to 2π maps to 0 to 0.5
        newProgress = (touchAngle - Math.PI) / Math.PI * 0.5;
      } else {
        // Right half: 0 to π maps to 0.5 to 1
        newProgress = 0.5 + touchAngle / Math.PI * 0.5;
      }
      
      progress.value = Math.max(0, Math.min(1, newProgress));
    },
    onEnd: () => {
      scale.value = withSpring(1, { damping: 15 });
      
      // Snap to nearest mood
      const moodIndex = Math.round(progress.value * 4); // 0-4 for 5 moods
      const targetProgress = moodIndex / 4;
      
      progress.value = withSpring(targetProgress, {
        damping: 20,
        stiffness: 300,
      });
    },
  });

  // Update current mood when progress changes
  const updateMood = (newProgress) => {
    const moodIndex = Math.round(newProgress * 4);
    const clampedIndex = Math.max(0, Math.min(4, moodIndex));
    
    if (clampedIndex !== currentMood) {
      setCurrentMood(clampedIndex);
      if (onMoodChange) {
        onMoodChange(moods[clampedIndex]);
      }
    }
  };

  const animatedTrackProps = useAnimatedProps(() => {
    // Convert progress to angle (all inline calculations)
    const currentAngle = Math.PI + progress.value * Math.PI; // π to 2π
    
    // Start position (left side at π)
    const startX = center + radius * Math.cos(Math.PI);
    const startY = center + radius * Math.sin(Math.PI);
    
    // Current position
    const endX = center + radius * Math.cos(currentAngle);
    const endY = center + radius * Math.sin(currentAngle);
    
    // Always sweep clockwise from start to current position
    const largeArcFlag = progress.value > 0.5 ? 1 : 0;

    return {
      d: `M ${startX} ${startY} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${endX} ${endY}`,
    };
  });

  const animatedHandleProps = useAnimatedProps(() => {
    // Convert progress to angle (all inline calculations)
    const currentAngle = Math.PI + progress.value * Math.PI; // π to 2π
    const x = center + radius * Math.cos(currentAngle);
    const y = center + radius * Math.sin(currentAngle);
    
    // Update mood on JS thread
    runOnJS(updateMood)(progress.value);
    
    return {
      cx: x,
      cy: y,
      r: interpolate(scale.value, [1, 1.3], [strokeWidth * 0.7, strokeWidth * 0.9]),
    };
  });

  const animatedContainerStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  // Create full semicircle track path (JS thread calculation)
  const startX = center + radius * Math.cos(Math.PI);
  const startY = center + radius * Math.sin(Math.PI);
  const endX = center + radius * Math.cos(2 * Math.PI);
  const endY = center + radius * Math.sin(2 * Math.PI);
  const fullTrackPath = `M ${startX} ${startY} A ${radius} ${radius} 0 0 1 ${endX} ${endY}`;

  return (
    <View style={styles.container}>      
      <View style={styles.emojiContainer}>
        <Text style={styles.mainEmoji}>{moods[currentMood].emoji}</Text>
        <View style={styles.heartsContainer}>
          <Text style={styles.heartEmoji}>❤️</Text>
          <Text style={styles.heartEmoji}>❤️</Text>
        </View>
      </View>

      <PanGestureHandler onGestureEvent={gestureHandler}>
        <AnimatedView style={[styles.sliderContainer, animatedContainerStyle]}>
          <Svg width={size} height={size * 0.65} style={styles.svg}>
            <Defs>
              <LinearGradient id="trackGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <Stop offset="0%" stopColor="#FF6B6B" />
                <Stop offset="25%" stopColor="#FF8E53" />
                <Stop offset="50%" stopColor="#4ECDC4" />
                <Stop offset="75%" stopColor="#45B7D1" />
                <Stop offset="100%" stopColor="#96CEB4" />
              </LinearGradient>
            </Defs>
            
            {/* Background track */}
            <Path
              d={fullTrackPath}
              stroke="#E8E8E8"
              strokeWidth={strokeWidth}
              fill="none"
              strokeLinecap="round"
            />
            
            {/* Active track */}
            <AnimatedPath
              stroke="url(#trackGradient)"
              strokeWidth={strokeWidth}
              fill="none"
              strokeLinecap="round"
              animatedProps={animatedTrackProps}
            />
            
            {/* Handle */}
            <AnimatedCircle
              fill="#FFFFFF"
              stroke={moods[currentMood].color}
              strokeWidth={4}
              animatedProps={animatedHandleProps}
            />
          </Svg>
        </AnimatedView>
      </PanGestureHandler>
      
      <View style={styles.moodContainer}>
        <Text style={[styles.moodText, { color: moods[currentMood].color }]}>
          {moods[currentMood].label}
        </Text>
      </View>

      <View style={styles.indicatorContainer}>
        {moods.map((_, index) => (
          <View
            key={index}
            style={[
              styles.indicator,
              {
                backgroundColor: index === currentMood ? moods[currentMood].color : '#E0E0E0',
                transform: [{ scale: index === currentMood ? 1.2 : 0.8 }],
              }
            ]}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
    backgroundColor: '#F8F9FA',
  },
  questionContainer: {
    marginBottom: 30,
  },
  questionText: {
    fontSize: 24,
    fontWeight: '600',
    color: '#2C3E50',
    textAlign: 'center',
  },
  emojiContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
    position: 'relative',
  },
  mainEmoji: {
    fontSize: 80,
    textAlign: 'center',
  },
  heartsContainer: {
    position: 'absolute',
    right: -25,
    top: -5,
    flexDirection: 'row',
  },
  heartEmoji: {
    fontSize: 20,
    marginHorizontal: 2,
  },
  sliderContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  svg: {
    overflow: 'visible',
  },
  moodContainer: {
    marginTop: 30,
    marginBottom: 20,
  },
  moodText: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  indicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  indicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 6,
  },
});

export default MoodSelector;
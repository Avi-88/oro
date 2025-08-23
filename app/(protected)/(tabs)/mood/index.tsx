
import { View } from 'react-native';
import { useState, useCallback } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router, useFocusEffect } from 'expo-router';
import Onboarding from '../../../../components/common/Onboarding';
import Step1 from '../../../../components/journal/Step1';
import Step2 from '../../../../components/journal/Step2';
import Step3 from '../../../../components/journal/Step3';
import { useTabBar } from '../../../../context/TabBarContext';
import CurrentDateTime from 'components/common/CurrentDateTime';

const steps = [Step1, Step2, Step3];

const MoodEntryPage = () => {
  const insets = useSafeAreaInsets();
  const [onboardingKey, setOnboardingKey] = useState(0);
  const { setIsTabBarVisible } = useTabBar();

  useFocusEffect(
    useCallback(() => {
      setIsTabBarVisible(false);
      // Force Onboarding to remount by changing its key
      setOnboardingKey(Date.now()); // Use a new unique key each time the screen is focused
      return () => {
        setIsTabBarVisible(true);
      };
    }, [])
  );

  const onComplete = (data) => {
    console.log('Journal entry complete:', data);
    router.replace('/(protected)/(tabs)/dashboard');
    setOnboardingKey(onboardingKey + 1);
  };

  const onClose = () => {
    router.replace('/(protected)/(tabs)/dashboard');
    setOnboardingKey(onboardingKey + 1);
  };

  return (
    <View style={{ flex: 1, paddingTop: insets.top, paddingBottom: insets.bottom }}>
      <Onboarding crownComponent={<CurrentDateTime/>} key={onboardingKey} steps={steps} onComplete={onComplete} onClose={onClose} />
    </View>
  );
};

export default MoodEntryPage;

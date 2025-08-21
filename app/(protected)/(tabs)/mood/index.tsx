
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import Onboarding from '../../../../components/common/Onboarding';
import Step1 from '../../../../components/journal/Step1';
import Step2 from '../../../../components/journal/Step2';
import Step3 from '../../../../components/journal/Step3';

const steps = [Step1, Step2, Step3];

const MoodEntryPage = () => {
  const insets = useSafeAreaInsets();

  const onComplete = (data) => {
    console.log('Journal entry complete:', data);
    router.replace('/(protected)/(tabs)/dashboard');
  };

  const onClose = () => {
    router.replace('/(protected)/(tabs)/dashboard');
  };

  return (
    <View style={{ flex: 1, paddingTop: insets.top, paddingBottom: insets.bottom }}>
      <Onboarding steps={steps} onComplete={onComplete} onClose={onClose} />
    </View>
  );
};

export default MoodEntryPage;

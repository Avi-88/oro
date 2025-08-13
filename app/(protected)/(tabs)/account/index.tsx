import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { BlurView } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { SignOutButton } from 'components/common/SignOutButton';

const AccountPage = () => {
  const insets = useSafeAreaInsets();

  const accountOptions = [
    { id: '1', title: 'Profile', icon: 'user' },
    { id: '2', title: 'Notifications', icon: 'bell' },
    { id: '3', title: 'Privacy', icon: 'shield' },
    { id: '4', title: 'Help & Support', icon: 'help-circle' },
  ];

  return (
    <ScrollView
      className="flex-1 bg-transparent"
      contentContainerStyle={{ paddingTop: insets.top + 80, paddingBottom: insets.bottom + 120 }}
      showsVerticalScrollIndicator={false}
    >
      <View className="px-6">
        <View className="mb-8">
          {accountOptions.map((item) => (
            <View key={item.id} className="mb-4">
              <BlurView
                intensity={80}
                tint="light"
                className="rounded-2xl border border-white/20 overflow-hidden bg-white/30"
              >
                <TouchableOpacity className="p-4 flex-row items-center justify-between">
                  <View className="flex-row items-center">
                    <Feather name={item.icon as any} size={20} color="#374151" />
                    <Text className="text-lg text-gray-800 ml-4">{item.title}</Text>
                  </View>
                  <Feather name="chevron-right" size={24} color="#6b7280" />
                </TouchableOpacity>
              </BlurView>
            </View>
          ))}
        </View>

        <SignOutButton />
      </View>
    </ScrollView>
  );
};

export default AccountPage;

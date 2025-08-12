import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { BlurView } from 'expo-blur';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const DashboardHomeScreen = () => {
  const insets = useSafeAreaInsets();

  const moodOptions = [
    { name: 'Happy', icon: '😊', color: '#ec4899' },
    { name: 'Calm', icon: '😐', color: '#f97316' },
    { name: 'Angry', icon: '😠', color: '#ef4444' },
    { name: 'Sad', icon: '😢', color: '#dc2626' },
    { name: 'Excited', icon: '😄', color: '#22c55e' },
  ];

  const quickAccessCards = [
    {
      title: 'Write Journal',
      description: 'Log your thoughts and emotions',
      icon: 'edit-3',
      iconColor: '#6b7280',
    },
    {
      title: 'View Insights',
      description: 'Understand your mood patterns',
      icon: 'bar-chart-2',
      iconColor: '#6b7280',
    },
    {
      title: 'Weekly Summary',
      description: 'Recap of your emotional journey',
      icon: 'calendar',
      iconColor: '#6b7280',
    },
    {
      title: 'Therapist Messages',
      description: 'Check-in notes and feedback',
      icon: 'message-circle',
      iconColor: '#14b8a6',
    },
  ];

  return (
    <ScrollView 
      className="flex-1 bg-transparent"
      contentContainerStyle={{ paddingBottom: insets.bottom + 100 }}
      showsVerticalScrollIndicator={false}
    >
      <View className="px-6 pt-4">
        {/* Header Section */}
        <View className="flex-row justify-between items-center mb-6">
          <Text className="text-2xl font-bold text-gray-800">Hello Aisha</Text>
          <TouchableOpacity className="p-2">
            <Feather name="bell" size={24} color="#374151" />
          </TouchableOpacity>
        </View>

        {/* Mood Tracker Section */}
        <View className="mb-8">
          <Text className="text-lg text-gray-600 mb-4">How are you feeling in this moment?</Text>
          <View className="flex-row justify-between">
            {moodOptions.map((mood, index) => (
              <TouchableOpacity
                key={index}
                className="items-center"
                activeOpacity={0.7}
              >
                <View 
                  className="w-12 h-12 rounded-full items-center justify-center mb-2"
                  style={{ backgroundColor: mood.color }}
                >
                  <Text className="text-xl">{mood.icon}</Text>
                </View>
                <Text className="text-sm text-gray-700 font-medium">{mood.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Journaling Prompt Card */}
        <View className="mb-8">
          <BlurView
            intensity={60}
            tint="light"
            className="rounded-2xl border border-white/20 overflow-hidden"
            style={{
              backgroundColor: 'rgba(255,255,255,0.2)',
            }}
          >
            <View className="p-6">
              <View className="flex-row items-start mb-4">
                <View className="mr-4 mt-1">
                  <Feather name="book" size={24} color="#6b7280" />
                </View>
                <View className="flex-1">
                  <Text className="text-lg font-bold text-gray-800 mb-1">
                    Would you like to reflect on your day?
                  </Text>
                  <Text className="text-sm text-gray-600">
                    Taking a few minutes to journal can help process emotions.
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                className="bg-gradient-to-r from-pink-500 to-purple-600 rounded-xl py-3 px-6 items-center"
                activeOpacity={0.8}
              >
                <Text className="text-white font-semibold text-base">Open My Journal</Text>
              </TouchableOpacity>
            </View>
          </BlurView>
        </View>

        {/* Quick Access Section */}
        <View className="mb-6">
          <Text className="text-xl font-bold text-gray-800 mb-4">Quick Access</Text>
          <View className="flex-row flex-wrap justify-between">
            {quickAccessCards.map((card, index) => (
              <TouchableOpacity
                key={index}
                className="w-[48%] mb-4"
                activeOpacity={0.7}
              >
                <BlurView
                  intensity={60}
                  tint="light"
                  className="rounded-2xl border border-white/20 overflow-hidden"
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.2)',
                    minHeight: 120,
                  }}
                >
                  <View className="p-4">
                    <View className="mb-3">
                      <Feather 
                        name={card.icon as any} 
                        size={24} 
                        color={card.iconColor} 
                      />
                    </View>
                    <Text className="text-base font-bold text-gray-800 mb-1">
                      {card.title}
                    </Text>
                    <Text className="text-xs text-gray-600 leading-4">
                      {card.description}
                    </Text>
                  </View>
                </BlurView>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default DashboardHomeScreen;
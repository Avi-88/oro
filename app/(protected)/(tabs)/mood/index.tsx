import { View, Text, TouchableOpacity, TextInput, ScrollView, Switch } from 'react-native';
import { BlurView } from 'expo-blur';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useState } from 'react';

const MoodEntryPage = () => {
  const insets = useSafeAreaInsets();
  const [selectedEmotion, setSelectedEmotion] = useState<string | null>(null);
  const [thoughts, setThoughts] = useState('');
  const [sleepHours, setSleepHours] = useState('7.5');
  const [shareWithTherapist, setShareWithTherapist] = useState(false);

  const emotions = [
    { name: 'Happy', icon: '😊', color: '#ec4899' },
    { name: 'Excited', icon: '✨', color: '#f59e0b' },
    { name: 'Relaxed', icon: '🍃', color: '#10b981' },
    { name: 'Tired', icon: '😴', color: '#6b7280' },
    { name: 'Stressed', icon: '⚡', color: '#ef4444' },
    { name: 'Sad', icon: '💔', color: '#8b5cf6' },
    { name: 'Anxious', icon: '😰', color: '#f97316' },
    { name: 'Grateful', icon: '👍', color: '#22c55e' },
  ];

  const adjustSleepHours = (increment: boolean) => {
    const current = parseFloat(sleepHours);
    const newValue = increment ? current + 0.5 : current - 0.5;
    if (newValue >= 0 && newValue <= 24) {
      setSleepHours(newValue.toString());
    }
  };

  return (
    <ScrollView 
      className="flex-1 bg-transparent"
      contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
      showsVerticalScrollIndicator={false}
    >
      <View className="px-6 pt-4">
        {/* Header */}
        <View className="flex-row items-center mb-8">
          <TouchableOpacity className="mr-4">
            <Feather name="arrow-left" size={24} color="#374151" />
          </TouchableOpacity>
          <Text className="text-2xl font-bold text-gray-800">Journal</Text>
        </View>

        {/* Emotion Selection */}
        <View className="mb-8">
          <Text className="text-xl font-bold text-gray-800 mb-6">What emotion is with you today?</Text>
          <View className="flex-row flex-wrap justify-between">
            {emotions.map((emotion, index) => (
              <TouchableOpacity
                key={index}
                className="w-[22%] mb-4"
                activeOpacity={0.7}
                onPress={() => setSelectedEmotion(emotion.name)}
              >
                <BlurView
                  intensity={60}
                  tint="light"
                  className={`rounded-full border border-white/20 overflow-hidden items-center justify-center ${
                    selectedEmotion === emotion.name ? 'border-pink-400' : ''
                  }`}
                  style={{
                    backgroundColor: selectedEmotion === emotion.name 
                      ? 'rgba(236, 72, 153, 0.1)' 
                      : 'rgba(255,255,255,0.2)',
                    aspectRatio: 1,
                  }}
                >
                  <View className="p-4 items-center">
                    <Text className="text-2xl mb-2">{emotion.icon}</Text>
                    <Text className="text-xs text-gray-700 font-medium text-center">
                      {emotion.name}
                    </Text>
                  </View>
                </BlurView>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Thought Entry */}
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
              <TextInput
                placeholder="Start typing your thoughts here..."
                placeholderTextColor="#9ca3af"
                value={thoughts}
                onChangeText={setThoughts}
                multiline
                numberOfLines={6}
                className="text-gray-800 text-base leading-6"
                style={{
                  minHeight: 120,
                  textAlignVertical: 'top',
                }}
              />
              
              <View className="flex-row justify-between items-center mt-4">
                <View className="flex-row">
                  <TouchableOpacity className="mr-4">
                    <MaterialCommunityIcons name="image" size={24} color="#3b82f6" />
                  </TouchableOpacity>
                  <TouchableOpacity>
                    <MaterialCommunityIcons name="microphone" size={24} color="#ec4899" />
                  </TouchableOpacity>
                </View>
                
                <TouchableOpacity
                  className="bg-gradient-to-r from-pink-500 to-purple-600 rounded-xl py-3 px-6"
                  activeOpacity={0.8}
                >
                  <Text className="text-white font-semibold text-base">Save Mood Entry</Text>
                </TouchableOpacity>
              </View>
            </View>
          </BlurView>
        </View>

        {/* Sleep Tracking */}
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
              <View className="flex-row items-center mb-4">
                <MaterialCommunityIcons name="bed" size={24} color="#6b7280" />
                <Text className="text-xl font-bold text-gray-800 ml-3">Sleep</Text>
              </View>
              
              <Text className="text-lg text-gray-600 mb-4">How was your sleep last night?</Text>
              
              {/* Sleep Quality Slider Placeholder */}
              <View className="flex-row justify-between items-center mb-6">
                <Text className="text-sm text-gray-500">Poor</Text>
                <View className="flex-1 mx-4 h-2 bg-gray-200 rounded-full">
                  <View className="h-2 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full w-3/4" />
                </View>
                <Text className="text-sm text-gray-500">Excellent</Text>
              </View>
              
              {/* Sleep Hours */}
              <View className="flex-row items-center justify-between">
                <Text className="text-base text-gray-700 font-medium">Hours</Text>
                <View className="flex-row items-center">
                  <TouchableOpacity
                    onPress={() => adjustSleepHours(false)}
                    className="w-8 h-8 rounded-full bg-gray-200 items-center justify-center mr-3"
                  >
                    <Text className="text-gray-600 font-bold">-</Text>
                  </TouchableOpacity>
                  <Text className="text-lg font-semibold text-gray-800 mx-4">{sleepHours}</Text>
                  <TouchableOpacity
                    onPress={() => adjustSleepHours(true)}
                    className="w-8 h-8 rounded-full bg-gray-200 items-center justify-center ml-3"
                  >
                    <Text className="text-gray-600 font-bold">+</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </BlurView>
        </View>

        {/* Therapist Sharing */}
        <View className="mb-6">
          <BlurView
            intensity={60}
            tint="light"
            className="rounded-2xl border border-white/20 overflow-hidden"
            style={{
              backgroundColor: 'rgba(255,255,255,0.2)',
            }}
          >
            <View className="p-6">
              <View className="flex-row justify-between items-center">
                <View className="flex-1">
                  <Text className="text-xl font-bold text-gray-800 mb-1">
                    Share this with your therapist
                  </Text>
                  <Text className="text-sm text-gray-600">
                    You control what's shared.
                  </Text>
                </View>
                <Switch
                  value={shareWithTherapist}
                  onValueChange={setShareWithTherapist}
                  trackColor={{ false: '#d1d5db', true: '#ec4899' }}
                  thumbColor={shareWithTherapist ? '#ffffff' : '#ffffff'}
                />
              </View>
            </View>
          </BlurView>
        </View>
      </View>
    </ScrollView>
  );
};

export default MoodEntryPage; 
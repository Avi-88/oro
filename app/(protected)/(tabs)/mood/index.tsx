import { View, Text, TouchableOpacity, TextInput, ScrollView, Switch } from 'react-native';
import { BlurView } from 'expo-blur';
import { Feather, FontAwesome } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useState } from 'react';
import VoiceRecordingModal from 'components/common/RecordingModal';

const MoodEntryPage = () => {
  const insets = useSafeAreaInsets();
  const [selectedEmotion, setSelectedEmotion] = useState<string | null>(null);
  const [thoughts, setThoughts] = useState('');
  const [sleepHours, setSleepHours] = useState('7.5');
  const [shareWithTherapist, setShareWithTherapist] = useState(false);
  const [showVoiceModal, setShowVoiceModal] = useState(false);
  const [voiceRecordings, setVoiceRecordings] = useState([]);

  const emotions = [
    { name: 'Happy', icon: 'smile-o', color: '#f472b6' },
    { name: 'Excited', icon: 'star-o', color: '#f472b6' },
    { name: 'Relaxed', icon: 'leaf', color: '#f472b6' },
    { name: 'Tired', icon: 'moon-o', color: '#f472b6' },
    { name: 'Stressed', icon: 'bolt', color: '#f472b6' },
    { name: 'Sad', icon: 'frown-o', color: '#f472b6' },
    { name: 'Anxious', icon: 'cloud', color: '#f472b6' },
    { name: 'Grateful', icon: 'thumbs-o-up', color: '#f472b6' },
  ];

  const adjustSleepHours = (increment: boolean) => {
    const current = parseFloat(sleepHours);
    const newValue = increment ? current + 0.5 : current - 0.5;
    if (newValue >= 0 && newValue <= 24) {
      setSleepHours(newValue.toFixed(1));
    }
  };

  const handleVoiceRecordingSave = (recordingData) => {
    // Add the voice recording to our list
    const newRecording = {
      id: Date.now(),
      duration: recordingData.duration,
      timestamp: new Date(),
    };
    setVoiceRecordings([...voiceRecordings, newRecording]);
  };

  const handleVoiceRecordingDelete = (id) => {
    // Add the voice recording to our list
    setVoiceRecordings((prev) => prev.filter((record) => record.id !== id));
  };

  return (
    <>

    <ScrollView 
      className="flex-1 bg-transparent"
      contentContainerStyle={{ paddingTop: insets.top + 60, paddingBottom: insets.bottom + 120 }}
      showsVerticalScrollIndicator={false}
    >
      <View className="px-6 pt-4">
        {/* Emotion Selection */}
        <View className="my-8">
          <Text className="text-xl font-bold text-gray-800 mb-6">What emotion is with you today?</Text>
          <View className="flex-row flex-wrap justify-between">
            {emotions.map((emotion, index) => (
              <TouchableOpacity
                key={index}
                className="w-[22%] items-center mb-4"
                activeOpacity={0.7}
                onPress={() => setSelectedEmotion(emotion.name)}
              >
                <BlurView
                  intensity={80}
                  tint="light"
                  className="w-16 h-16 items-center justify-center"
                  style={{
                    borderRadius: 9999,
                    overflow: 'hidden',
                    borderWidth: 1,
                    borderColor: selectedEmotion === emotion.name ? '#f472b6' : 'rgba(1, 1, 1, 0.08)',
                    backgroundColor: selectedEmotion === emotion.name 
                      ? 'rgba(244, 114, 182, 0.1)' 
                      : 'rgba(255, 255, 255, 0.4)',
                  }}
                >
                  <FontAwesome name={emotion.icon as any} size={24} color={emotion.color} />
                </BlurView>
                <Text className="text-sm text-gray-700 font-medium mt-2 text-center">
                  {emotion.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

         {/* Voice Recordings Display */}
         {voiceRecordings.length > 0 && (
            <View className="mb-8">
              <Text className="text-lg font-semibold text-gray-800 mb-4">Voice Notes</Text>
              {voiceRecordings.map((recording) => (
                <BlurView
                  key={recording.id}
                  intensity={80}
                  tint="light"
                  className="rounded-2xl border border-black/5 overflow-hidden bg-white/40 mb-3"
                >
                  <View className="p-4 flex-row items-center">
                    <View className="bg-pink-100 p-3 rounded-full mr-4">
                      <FontAwesome name="microphone" size={16} color="#f472b6" />
                    </View>
                    <View className="flex-1">
                      <Text className="text-gray-800 font-medium">Voice Note</Text>
                      <Text className="text-gray-600 text-sm">
                        Duration: {Math.floor(recording.duration / 60)}:{(recording.duration % 60).toString().padStart(2, '0')}
                      </Text>
                    </View>
                    <TouchableOpacity onPress={()=> handleVoiceRecordingDelete(recording.id)} className="p-2 mr-4">
                      <FontAwesome name="trash" size={16} color="#f472b6" />
                    </TouchableOpacity>
                    <TouchableOpacity className="p-2">
                      <FontAwesome name="play" size={16} color="#f472b6" />
                    </TouchableOpacity>
                  </View>
                </BlurView>
              ))}
            </View>
          )}

        {/* Thought Entry */}
        <View className="mb-8">
          <BlurView
            intensity={80}
            tint="light"
            className="rounded-2xl border border-black/5 overflow-hidden bg-white/40"
          >
            <View className="p-4">
              <TextInput
                placeholder="Start typing your thoughts here..."
                placeholderTextColor="#9ca3af"
                value={thoughts}
                onChangeText={setThoughts}
                multiline
                className="text-gray-800 text-base leading-6"
                style={{
                  minHeight: 100,
                  textAlignVertical: 'top',
                }}
              />
              
              <View className="flex-row justify-between items-center mt-4">
                <View className="flex-row">
                  <TouchableOpacity className="mr-6 bg-gray-200 p-3 rounded-full">
                    <FontAwesome name="image" size={20} color="#3b82f6" />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => setShowVoiceModal(true)} className="bg-gray-200 py-3 px-4  rounded-full">
                    <FontAwesome name="microphone" size={20} color="#f472b6" />
                  </TouchableOpacity>
                </View>
                
                <TouchableOpacity
                  className="bg-pink-400 rounded-xl py-3 px-6"
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
            intensity={80}
            tint="light"
            className="rounded-2xl border border-black/5 overflow-hidden bg-white/40"
          >
            <View className="p-6">
              <View className="flex-row items-center justify-between mb-4">
                <View className="flex-row items-center">
                  <View className="bg-pink-100 p-3 rounded-full">
                    <FontAwesome name="bed" size={20} color="#f472b6" />
                  </View>
                  <Text className="text-xl font-bold text-gray-800 ml-3">Sleep</Text>
                </View>
                <Feather name="chevron-down" size={24} color="#6b7280" />
              </View>
              
              <Text className="text-base text-gray-600 mb-4">How was your sleep last night?</Text>
              
              <View className="h-2 bg-gray-200 rounded-full mb-2">
                <View className="h-2 bg-pink-300 rounded-full" style={{ width: `${(parseFloat(sleepHours) / 12) * 100}%`}} />
              </View>
              <View className="flex-row justify-between mb-6">
                <Text className="text-sm text-gray-500">Poor</Text>
                <Text className="text-sm text-gray-500">Excellent</Text>
              </View>
              
              <View className="flex-row items-center justify-between">
                <Text className="text-base text-gray-700 font-medium">Hours</Text>
                <View className="flex-row items-center">
                  <TouchableOpacity
                    onPress={() => adjustSleepHours(false)}
                    className="w-8 h-8 rounded-full bg-gray-200 border border-black/10 items-center justify-center"
                  >
                    <Text className="text-gray-600 font-bold text-lg">
                      <Feather name="minus" size={18} color="#6b7280" />
                    </Text>
                  </TouchableOpacity>
                  <TextInput
                    className="text-lg font-semibold text-gray-800 mx-4 w-12 text-center"
                    value={sleepHours}
                    onChangeText={setSleepHours}
                    keyboardType="numeric"
                  />
                  <TouchableOpacity
                    onPress={() => adjustSleepHours(true)}
                    className="w-8 h-8 rounded-full bg-gray-200 border border-black/10 items-center justify-center"
                  >
                    <Text className="text-gray-600 font-bold text-lg">
                      <Feather name="plus" size={16} color="#6b7280" />
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </BlurView>
        </View>

        {/* Therapist Sharing */}
        <View className="mb-6">
          <BlurView
            intensity={80}
            tint="light"
            className="rounded-2xl border border-black/5 overflow-hidden bg-white/40"
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
                  trackColor={{ false: '#d1d5db', true: '#f472b6' }}
                  thumbColor={'#ffffff'}
                  ios_backgroundColor="#d1d5db"
                />
              </View>
            </View>
          </BlurView>
        </View>
      </View>
    </ScrollView>

              {/* Voice Recording Modal */}
              <VoiceRecordingModal
        visible={showVoiceModal}
        onClose={() => setShowVoiceModal(false)}
        onSave={handleVoiceRecordingSave}
      />
    </>
  );
};

export default MoodEntryPage;

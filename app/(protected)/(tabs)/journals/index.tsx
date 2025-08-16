import { View, Text, ScrollView, FlatList } from 'react-native';
import { BlurView } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FontAwesome } from '@expo/vector-icons';

const JournalsPage = () => {
  const insets = useSafeAreaInsets();

  const journalEntries = [
    {
      id: '1',
      date: '2024-03-15',
      title: 'A Good Day',
      excerpt: 'Today was a really good day. I felt happy and productive. I went for a walk in the park and enjoyed the sunshine...',
      mood: 'Happy',
    },
    {
      id: '2',
      date: '2024-03-14',
      title: 'Feeling a Bit Down',
      excerpt: 'I felt a bit sad today. I think it was because of the weather. I stayed indoors and watched a movie...',
      mood: 'Sad',
    },
    {
      id: '3',
      date: '2024-03-13',
      title: 'A Productive Day',
      excerpt: 'I was very productive today. I finished all my tasks and even had time to read a book. I felt very accomplished...',
      mood: 'Excited',
    },
    {
      id: '4',
      date: '2024-03-12',
      title: 'A Relaxing Evening',
      excerpt: 'I had a very relaxing evening. I took a long bath and listened to some calming music. It was just what I needed...',
      mood: 'Relaxed',
    },
  ];

  const renderJournalEntry = ({ item }: { item: any }) => (
    <View className="mb-4">
      <BlurView
        intensity={80}
        tint="light"
        className="rounded-2xl border border-black/5 overflow-hidden bg-white/30 p-4"
      >
        <Text className="text-sm text-gray-500 mb-1">{item.date}</Text>
        <Text className="text-lg font-bold text-gray-800 mb-2">{item.title}</Text>
        <Text className="text-base text-gray-700 mb-3" numberOfLines={2}>{item.excerpt}</Text>
        <View className="flex-row items-center">
          <FontAwesome name="smile-o" size={16} color="#f472b6" />
          <Text className="text-sm text-gray-600 ml-2">{item.mood}</Text>
        </View>
      </BlurView>
    </View>
  );

  return (
    <ScrollView
      className="flex-1 bg-transparent"
      contentContainerStyle={{ paddingTop: insets.top, paddingBottom: insets.bottom + 120 }}
      showsVerticalScrollIndicator={false}
    >
      <View className="px-6 pt-4">
        <FlatList
          data={journalEntries}
          renderItem={renderJournalEntry}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
        />
      </View>
    </ScrollView>
  );
};

export default JournalsPage;
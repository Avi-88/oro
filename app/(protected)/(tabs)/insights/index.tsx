import { View, Text, ScrollView, Dimensions } from 'react-native';
import { BlurView } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LineChart, PieChart } from 'react-native-chart-kit';

const InsightsPage = () => {
  const insets = useSafeAreaInsets();
  const screenWidth = Dimensions.get('window').width;

  const lineChartData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        data: [
          Math.random() * 5,
          Math.random() * 5,
          Math.random() * 5,
          Math.random() * 5,
          Math.random() * 5,
          Math.random() * 5,
          Math.random() * 5,
        ],
      },
    ],
  };

  const pieChartData = [
    { name: 'Happy', population: 21, color: '#f472b6', legendFontColor: '#374151', legendFontSize: 15 },
    { name: 'Excited', population: 15, color: '#ec4899', legendFontColor: '#374151', legendFontSize: 15 },
    { name: 'Relaxed', population: 25, color: '#e11d48', legendFontColor: '#374151', legendFontSize: 15 },
    { name: 'Sad', population: 10, color: '#be185d', legendFontColor: '#374151', legendFontSize: 15 },
    { name: 'Stressed', population: 29, color: '#9d174d', legendFontColor: '#374151', legendFontSize: 15 },
  ];

  const chartConfig = {
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    color: (opacity = 1) => `rgba(244, 114, 182, ${opacity})`,
    strokeWidth: 2,
    barPercentage: 0.5,
    useShadowColorFromDataset: false,
  };

  return (
    <ScrollView
      className="flex-1 bg-transparent"
      contentContainerStyle={{ paddingTop: insets.top + 80, paddingBottom: insets.bottom + 120 }}
      showsVerticalScrollIndicator={false}
    >
      <View className="px-6 pt-4">
        {/* Mood Trend Chart */}
        <View className="mb-8">
          <Text className="text-xl font-bold text-gray-800 mb-4">Weekly Mood Trend</Text>
          <View
            className="rounded-2xl border border-white/20 overflow-hidden flex justify-center items-center"
          >
            <LineChart
              data={lineChartData}
              width={screenWidth - 48}
              height={220}
              chartConfig={chartConfig}
              bezier
              style={{
                borderRadius: 16,
              }}
            />
          </View>
        </View>

        {/* Emotion Distribution Chart */}
        <View className="mb-8">
          <Text className="text-xl font-bold text-gray-800 mb-4">Emotion Distribution</Text>
          <BlurView
            intensity={80}
            tint="light"
            className="rounded-2xl border border-white/20 overflow-hidden bg-white/30 items-center justify-center"
          >
            <PieChart
              data={pieChartData}
              width={screenWidth - 48}
              height={220}
              chartConfig={chartConfig}
              accessor={"population"}
              backgroundColor={"transparent"}
              paddingLeft={"15"}
              center={[10, 0]}
              absolute
            />
          </BlurView>
        </View>
      </View>
    </ScrollView>
  );
};

export default InsightsPage;
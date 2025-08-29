import { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, Animated, TouchableOpacity, Image } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import RecordingModal from '../common/RecordingModal';

interface Step4Props {
  onDataChange: (data: { [key: string]: any }) => void;
  data: { [key: string]: any };
  onStepComplete: (isComplete: boolean) => void;
  isActive: boolean;
}

const Step4 = ({ onDataChange, data, onStepComplete, isActive }: Step4Props) => {
  const [note, setNote] = useState<string>('');
  const [voiceRecordings, setVoiceRecordings] = useState<any[]>([]);
  const [images, setImages] = useState<any[]>([]);
  const [showRecordingModal, setShowRecordingModal] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isActive) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        delay: 200,
        useNativeDriver: true,
      }).start();
    } else {
      fadeAnim.setValue(0);
    }
  }, [isActive, fadeAnim]);

  const handleNoteChange = (text: string) => {
    setNote(text);
    updateData({ note: text });
  };

  const handleVoiceRecording = (recording: any) => {
    const newRecordings = [...voiceRecordings, recording];
    setVoiceRecordings(newRecordings);
    updateData({ voiceRecordings: newRecordings });
  };

  const handleImageAdd = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (permissionResult.granted === false) {
      alert("Permission to access camera roll is required!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets[0]) {
      const newImages = [...images, result.assets[0]];
      setImages(newImages);
      updateData({ images: newImages });
    }
  };

  const updateData = (newData: any) => {
    const updatedData = { ...data, ...newData };
    onDataChange(updatedData);
    
    // Check if step is complete (has text, voice, or images)
    const hasContent = 
      (updatedData.note && updatedData.note.trim().length > 0) ||
      (updatedData.voiceRecordings && updatedData.voiceRecordings.length > 0) ||
      (updatedData.images && updatedData.images.length > 0);
    
    onStepComplete(hasContent);
  };

  const removeVoiceRecording = (index: number) => {
    const newRecordings = voiceRecordings.filter((_, i) => i !== index);
    setVoiceRecordings(newRecordings);
    updateData({ voiceRecordings: newRecordings });
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
    updateData({ images: newImages });
  };

  return (
    <Animated.View 
      className='w-full h-full flex justify-center items-center px-4'
      style={{ opacity: fadeAnim }}
    >
      <Text className='text-pink-400 text-center text-3xl font-bold mb-8'>
        Any additional thoughts or notes?
      </Text>
      
      <View className='w-full px-6'>
        {/* Text Input */}
        <View className='w-full relative bg-pink-100 px-4 py-6 rounded-xl min-h-32 mb-4'>
          {!note && (
            <Text className='absolute top-6 left-4 text-pink-300 font-semibold' style={{ letterSpacing: 1.2 }}>
              Write your thoughts here...
            </Text>
          )}
          <TextInput
            className='w-full text-pink-300 font-semibold tracking-wide'
            value={note}
            onChangeText={handleNoteChange}
            multiline={true}
            textAlignVertical="top"
            style={{ minHeight: 80 }}
          />
        </View>

        {/* Input Options */}
        <View className='flex-row justify-center space-x-4 mb-6'>
          <TouchableOpacity
            onPress={() => setShowRecordingModal(true)}
            className='flex-1 max-w-32 bg-pink-400/20 border border-pink-400 rounded-xl p-3 items-center justify-center'
            activeOpacity={0.7}
          >
            <FontAwesome name="microphone" size={18} color="#f472b6" />
            <Text className='text-pink-400 text-xs font-semibold mt-1'>Voice Note</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            onPress={handleImageAdd}
            className='flex-1 max-w-32 bg-pink-400/20 border border-pink-400 rounded-xl p-3 items-center justify-center'
            activeOpacity={0.7}
          >
            <FontAwesome name="camera" size={18} color="#f472b6" />
            <Text className='text-pink-400 text-xs font-semibold mt-1'>Add Photo</Text>
          </TouchableOpacity>
        </View>

        {/* Voice Recordings Display */}
        {voiceRecordings.length > 0 && (
          <View className='mb-4'>
            <Text className='text-pink-400 font-semibold mb-2'>Voice Notes:</Text>
            {voiceRecordings.map((recording, index) => (
              <View key={index} className='flex-row items-center bg-pink-50 p-3 rounded-lg mb-2'>
                <FontAwesome name="play-circle" size={24} color="#f472b6" />
                <Text className='flex-1 ml-3 text-pink-400 font-medium'>
                  Voice note {index + 1} ({recording.duration}s)
                </Text>
                <TouchableOpacity
                  onPress={() => removeVoiceRecording(index)}
                  className='p-1'
                >
                  <FontAwesome name="times" size={16} color="#ef4444" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}

        {/* Images Display */}
        {images.length > 0 && (
          <View className='mb-4'>
            <Text className='text-pink-400 font-semibold mb-2'>Images:</Text>
            <View className='flex-row flex-wrap'>
              {images.map((image, index) => (
                <View key={index} className='relative mr-2 mb-2'>
                  <Image
                    source={{ uri: image.uri }}
                    className='w-16 h-16 rounded-lg'
                    resizeMode="cover"
                  />
                  <TouchableOpacity
                    onPress={() => removeImage(index)}
                    className='absolute -top-1 -right-1 bg-red-500 rounded-full w-5 h-5 items-center justify-center'
                  >
                    <FontAwesome name="times" size={10} color="white" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </View>
        )}
      </View>

      {/* Recording Modal */}
      <RecordingModal
        visible={showRecordingModal}
        onClose={() => setShowRecordingModal(false)}
        onSave={handleVoiceRecording}
      />
    </Animated.View>
  );
};

export default Step4;
import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  Modal, 
  Animated, 
  Dimensions,
  StatusBar 
} from 'react-native';
import { BlurView } from 'expo-blur';
import { FontAwesome, Feather } from '@expo/vector-icons';
import { Audio } from 'expo-av';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const VoiceRecordingModal = ({ visible, onClose, onSave }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [hasRecording, setHasRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  
  // Animation values
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const waveAmplitudes = useRef(Array(60).fill(0).map(() => new Animated.Value(0.1))).current;
  const slideUpAnim = useRef(new Animated.Value(screenHeight)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  
  // Timer and audio refs
  const timerRef = useRef(null);
  const recordingRef = useRef(null);
  const soundRef = useRef(null);
  const levelCheckRef = useRef(null);

  useEffect(() => {
    if (visible) {
      // Animate modal in
      Animated.parallel([
        Animated.spring(slideUpAnim, {
          toValue: 0,
          useNativeDriver: true,
          tension: 10,
          friction: 8,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // Reset state when modal closes
      setIsRecording(false);
      setIsPaused(false);
      setRecordingTime(0);
      setHasRecording(false);
      setIsPlaying(false);
      setAudioLevel(0);
      slideUpAnim.setValue(screenHeight);
      fadeAnim.setValue(0);
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      if (levelCheckRef.current) {
        clearInterval(levelCheckRef.current);
        levelCheckRef.current = null;
      }
    }
  }, [visible]);

  // Real-time audio level monitoring effect
  useEffect(() => {
    if (isRecording && !isPaused) {
      
      // Start subtle pulse animation
      const pulse = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.05 + audioLevel * 0.1,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
        ])
      );
      pulse.start();

      // Update waveform based on actual audio level or fallback animation
      const updateWaveform = () => {
        const baseLevel = 0.3;
        const maxLevel = 1.0;
        
        // Always create fallback animation for now to ensure visibility
        const effectiveLevel = 0.4 + Math.random() * 0.4;
        const normalizedLevel = Math.max(baseLevel, Math.min(maxLevel, effectiveLevel));
        
        waveAmplitudes.forEach((anim, index) => {
          // Create more natural wave pattern
          const distance = Math.abs(index - waveAmplitudes.length / 2);
          const falloff = Math.max(0.3, 1 - (distance / (waveAmplitudes.length / 2)) * 0.5);
          const variation = Math.random() * 0.3 + 0.7; // Add some randomness
          const targetHeight = (normalizedLevel * falloff * variation);
          
          Animated.timing(anim, {
            toValue: targetHeight,
            duration: 120 + Math.random() * 80,
            useNativeDriver: true,
          }).start();
        });
      };

      // Start timer - clear any existing timer first
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);

      // Start waveform updates
      if (levelCheckRef.current) {
        clearInterval(levelCheckRef.current);
      }
      levelCheckRef.current = setInterval(updateWaveform, 150);

      return () => {
        pulse.stop();
        if (timerRef.current) {
          clearInterval(timerRef.current);
        }
        if (levelCheckRef.current) {
          clearInterval(levelCheckRef.current);
        }
      };
    } else {
      pulseAnim.setValue(1);
      waveAmplitudes.forEach(anim => anim.setValue(0.2));
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (levelCheckRef.current) {
        clearInterval(levelCheckRef.current);
      }
    }
  }, [isRecording, isPaused]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartRecording = async () => {
    try {
      // Request permissions first
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== 'granted') {
        alert('Permission to access microphone is required!');
        return;
      }

      // Set audio mode with minimal iOS configuration to avoid conflicts
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      // Start with basic high quality preset to avoid iOS issues
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY,
        (status) => {
          if (status.metering !== undefined) {
            // Convert from dB to a 0-1 scale for visualization
            const normalizedLevel = Math.max(0, Math.min(1, (status.metering + 160) / 160));
            setAudioLevel(normalizedLevel);
          }
        },
        100 // Update interval in ms
      );

      recordingRef.current = recording;
      setIsRecording(true);
      setIsPaused(false);
      setHasRecording(false);
      setRecordingTime(0); // Reset timer when starting new recording
      
    } catch (error) {
      console.error('Failed to start recording', error);
      
      // Reset audio mode on error
      try {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: false,
          playsInSilentModeIOS: false,
        });
      } catch (resetError) {
        console.error('Failed to reset audio mode', resetError);
      }
      
      // Show user-friendly error message
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      alert(`Recording failed: ${errorMessage}. Please check microphone permissions and try again.`);
    }
  };

  const handleStopRecording = async () => {
    try {
      if (recordingRef.current) {
        await recordingRef.current.stopAndUnloadAsync();
        setIsRecording(false);
        setIsPaused(false);
        setHasRecording(true);
        setAudioLevel(0);
        
        // Stop the timer
        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }
        if (levelCheckRef.current) {
          clearInterval(levelCheckRef.current);
          levelCheckRef.current = null;
        }
      }
    } catch (error) {
      console.error('Failed to stop recording', error);
    }
  };

  const handlePauseResume = async () => {
    try {
      if (recordingRef.current) {
        if (isPaused) {
          await recordingRef.current.startAsync();
        } else {
          await recordingRef.current.pauseAsync();
        }
        setIsPaused(!isPaused);
      }
    } catch (error) {
      console.error('Failed to pause/resume recording', error);
    }
  };

  const handlePlayPause = async () => {
    try {
      if (isPlaying) {
        if (soundRef.current) {
          await soundRef.current.pauseAsync();
          setIsPlaying(false);
        }
      } else {
        if (recordingRef.current) {
          const uri = recordingRef.current.getURI();
          const { sound } = await Audio.Sound.createAsync({ uri });
          soundRef.current = sound;
          await sound.playAsync();
          setIsPlaying(true);
          
          sound.setOnPlaybackStatusUpdate((status) => {
            if (status.isLoaded && status.didJustFinish) {
              setIsPlaying(false);
            }
          });
        }
      }
    } catch (error) {
      console.error('Failed to play/pause', error);
    }
  };

  const handleSave = async () => {
    try {
      let uri = null;
      if (recordingRef.current) {
        uri = recordingRef.current.getURI();
      }
      onSave && onSave({ 
        duration: recordingTime, 
        uri: uri,
        timestamp: new Date().toISOString()
      });
      onClose();
    } catch (error) {
      console.error('Failed to save recording', error);
    }
  };

  const handleClose = async () => {
    try {
      // Stop any ongoing recording
      if (isRecording && recordingRef.current) {
        await recordingRef.current.stopAndUnloadAsync();
      }
      
      // Stop any playing sound
      if (soundRef.current) {
        await soundRef.current.stopAsync();
        await soundRef.current.unloadAsync();
      }
      
      // Clear intervals
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (levelCheckRef.current) {
        clearInterval(levelCheckRef.current);
      }
    } catch (error) {
      console.error('Error cleaning up audio:', error);
    }
    
    onClose();
  };

  const renderWaveform = () => {
    const centerIndex = Math.floor(waveAmplitudes.length / 2);
    
    return (
      <View className="flex-row items-center justify-center h-32 px-4">
        {waveAmplitudes.map((anim, index) => {
          const distanceFromCenter = Math.abs(index - centerIndex);
          const maxDistance = Math.floor(waveAmplitudes.length / 2);
          const widthScale = Math.max(0.4, 1 - (distanceFromCenter / maxDistance) * 0.3);
          
          return (
            <Animated.View
              key={index}
              style={{
                backgroundColor: isRecording ? '#f472b6' : '#f8bfd4', // pink-400 or pink-200
                borderRadius: 2,
                marginHorizontal: 1,
                width: Math.max(2, 3 * widthScale),
                height: 60, // Fixed height for base
                minHeight: 8,
                maxHeight: 80,
                transform: [
                  { 
                    scaleY: anim
                  }
                ],
                opacity: isRecording ? 0.9 : 0.4,
              }}
            />
          );
        })}
      </View>
    );
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={handleClose}
    >
      <StatusBar backgroundColor="rgba(0,0,0,0.5)" barStyle="light-content" />
      <Animated.View 
        className="flex-1 bg-black/50"
        style={{ opacity: fadeAnim }}
      >
        <TouchableOpacity 
          className="flex-1" 
          activeOpacity={1} 
          onPress={handleClose}
        >
          <Animated.View
            className="absolute bottom-0 w-full bg-white rounded-t-3xl"
            style={{
              transform: [{ translateY: slideUpAnim }],
              minHeight: screenHeight * 0.4,
            }}
          >
            <TouchableOpacity activeOpacity={1}>
              {/* Handle bar */}
              <View className="items-center pt-3 pb-6">
                <View className="w-12 h-1 bg-gray-300 rounded-full" />
              </View>

              {/* Header */}
              <View className="px-6 mb-8">
                <View className="flex-row items-center justify-between">
                  <TouchableOpacity onPress={handleClose}>
                    <Feather name="x" size={24} color="#6b7280" />
                  </TouchableOpacity>
                  <Text className="text-lg font-semibold text-gray-800">
                    Voice Note
                  </Text>
                  <View className="w-6" />
                </View>
              </View>

              {/* Timer */}
              <View className="items-center mb-8">
                <Text className="text-4xl font-bold text-gray-800 mb-2">
                  {formatTime(recordingTime)}
                </Text>
                <Text className="text-gray-500">
                  {isRecording && !isPaused ? 'Recording...' : 
                   isPaused ? 'Paused' : 
                   hasRecording ? 'Ready to save' : 'Say whats on your mind'}
                </Text>
              </View>

              {/* Waveform */}
              <View className="px-6 mb-12">
                <BlurView
                  intensity={20}
                  tint="light"
                  className="rounded-2xl border border-gray-100 overflow-hidden bg-gray-50/50"
                >
                  <View className="p-2">
                    {renderWaveform()}
                  </View>
                </BlurView>
              </View>

              {/* Controls */}
              <View className="px-6 mb-8">
                {!hasRecording ? (
                  // Recording controls
                  <View className="flex-row items-center justify-center space-x-8">
                    {isRecording && (
                      <TouchableOpacity
                        onPress={handlePauseResume}
                        className="w-16 h-16 mx-4 bg-gray-200 rounded-full items-center justify-center"
                      >
                        <FontAwesome 
                          name={isPaused ? "play" : "pause"} 
                          size={20} 
                          color="#6b7280" 
                        />
                      </TouchableOpacity>
                    )}

                    {/* Main record button */}
                    <TouchableOpacity
                      onPress={isRecording ? handleStopRecording : handleStartRecording}
                      className='mx-4'
                      activeOpacity={0.8}
                    >
                      <Animated.View
                        className={`rounded-full items-center justify-center ${
                          isRecording ? 'bg-red-500' : 'bg-pink-400'
                        }`}
                        style={{
                          width: isRecording ? 72 : 80,
                          height: isRecording ? 72 : 80,
                          transform: [{ scale: isRecording ? pulseAnim : 1 }]
                        }}
                      >
                        {isRecording ? (
                          <View className="w-6 h-6 bg-white rounded-sm" />
                        ) : (
                          <FontAwesome name="microphone" size={28} color="white" />
                        )}
                      </Animated.View>
                    </TouchableOpacity>
                  </View>
                ) : (
                  // Playback controls
                  <View className="flex-row items-center justify-center space-x-4">
                    <TouchableOpacity
                      onPress={() => {
                        setHasRecording(false);
                        setRecordingTime(0);
                      }}
                      className="w-14 h-14 bg-gray-200 rounded-full items-center justify-center"
                    >
                      <FontAwesome name="trash" size={20} color="#ef4444" />
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={handleSave}
                        className="w-20 h-20 bg-green-500 mx-6 rounded-full items-center justify-center"
                    >
                        <FontAwesome name="check" size={20} color="white" />
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={handlePlayPause}
                      className="w-14 h-14 bg-gray-200 rounded-full items-center justify-center"
                    >
                        <FontAwesome 
                            name={isPlaying ? "pause" : "play"} 
                            size={20} 
                            color="black"
                            style={{ marginLeft: isPlaying ? 0 : 3 }}
                         />
                      
                    </TouchableOpacity>
                  </View>
                )}
              </View>

              {/* Action buttons */}
              {/* {hasRecording && (
                <View className="px-6 pb-8">
                  <TouchableOpacity
                    onPress={handleSave}
                    className="bg-pink-400 rounded-xl py-4 items-center"
                    activeOpacity={0.8}
                  >
                    <Text className="text-white font-semibold text-lg">
                      Add to Journal Entry
                    </Text>
                  </TouchableOpacity>
                </View>
              )} */}
            </TouchableOpacity>
          </Animated.View>
        </TouchableOpacity>
      </Animated.View>
    </Modal>
  );
};

export default VoiceRecordingModal;
import React from 'react';
import { View, Text } from 'react-native';

const Step3 = () => {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>You're all set!</Text>
      <Text style={{ fontSize: 16, textAlign: 'center', marginBottom: 40 }}>
        You can now start your journey with Oro.
      </Text>
    </View>
  );
};

export default Step3;
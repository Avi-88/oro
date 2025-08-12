import { View, Text } from 'react-native';

const AccountPage = () => {
  return (
    <View className='flex-1 items-center justify-center bg-transparent'>
      <Text className='text-white text-xl font-semibold'>Account</Text>
      <Text className='text-gray-300 mt-2'>Your account settings</Text>
    </View>
  );
};

export default AccountPage;
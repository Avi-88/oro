import { useClerk } from '@clerk/clerk-expo'
import * as Linking from 'expo-linking'
import { Text, TouchableOpacity } from 'react-native'

interface SignOutButtonProps {
  buttonClasses? : string
  textClasses? : string
}

export const SignOutButton = ({buttonClasses, textClasses} : SignOutButtonProps) => {
  const { signOut } = useClerk()
  const handleSignOut = async () => {
    try {
      await signOut()
      Linking.openURL(Linking.createURL('/login'))
    } catch (err) {
      console.error(JSON.stringify(err, null, 2))
    }
  }
  return (
    <TouchableOpacity className={buttonClasses} onPress={handleSignOut}>
      <Text className={textClasses}>Sign out</Text>
    </TouchableOpacity>
  )
}
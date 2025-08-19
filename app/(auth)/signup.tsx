import Onboarding from '../../components/common/Onboarding';
import { useSignUp } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';

const SignupScreen = () => {
  const { isLoaded, signUp, setActive } = useSignUp();
  const router = useRouter();

  const handleSignUp = async (data: any) => {
    if (!isLoaded) {
      return;
    }
    try {
      const { email, password, nickName } = data;

      await signUp.create({
        username: nickName,
        emailAddress: email,
        password,
      });

      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
      router.push('/(auth)/login');

    } catch (err) {
      console.error(JSON.stringify(err, null, 2));
    }
  };

  return <Onboarding onFinish={handleSignUp} />;
};

export default SignupScreen;
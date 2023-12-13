import { useNavigation } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as React from 'react';
import { ForgotPasswordScreen } from '../../screens/auth/forgotPasswordScreen';
import LoginScreen from '../../screens/auth/loginScreen';
import RegisterScreen from '../../screens/auth/registerScreen';
import { VerifyPasswordScreen } from '../../screens/auth/verifyPasswordScreen';
import { AuthContext } from '../../services/auth/context/authContext';

export type AuthStackParamList = {
  MainScreen: undefined;
  LoginScreen: undefined;
  RegisterScreen: undefined;
  ForgotPasswordScreen: undefined;
  VerifyPasswordScreen: {
    passwordToken: string;
  };
};

const AuthStack = createStackNavigator<AuthStackParamList>();

export const AuthStackNavigator = () => {
  const { hadleDynamicLink, forgotPasswordVerifyToken, dynamicUrl } = React.useContext(AuthContext);
  const [passwordToken, setPasswordToken] = React.useState<string>('');
  const navigation = useNavigation<any>();
  React.useEffect(() => {
    hadleDynamicLink();
    if (dynamicUrl) {
      const verificationEmail = dynamicUrl.url.split('token=')[1];
      setPasswordToken(verificationEmail);
      const verifyToken = async () => {
        const verify = await forgotPasswordVerifyToken(verificationEmail);
        if (verify) {
          navigation.navigate('VerifyPasswordScreen');
        }
      };
      verifyToken();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dynamicUrl]);

  return (
    <AuthStack.Navigator
      initialRouteName="LoginScreen"
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: 'white' },
      }}>
      <AuthStack.Screen name="LoginScreen" component={LoginScreen} />
      <AuthStack.Screen name="RegisterScreen" component={RegisterScreen} />
      <AuthStack.Screen name="ForgotPasswordScreen" component={ForgotPasswordScreen} />
      <AuthStack.Screen
        name="VerifyPasswordScreen"
        initialParams={{
          passwordToken,
        }}
        component={VerifyPasswordScreen}
      />
    </AuthStack.Navigator>
  );
};

export default AuthStackNavigator;

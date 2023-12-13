import React, { useContext, useState } from 'react';
import { StatusBar, StyleSheet, TouchableOpacity, Dimensions, Image } from 'react-native';
import { Text, Input, Button, Block } from 'galio-framework';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '../../navigators/Auth/auth.navigator';
import { useForm } from '../../hooks/useForms';
import { PermissionsContext } from '../../services/auth/context/permissionsContext';
import { AuthContext } from '../../services/auth/context/authContext';
// import MobyLogo from '../../assets/moby-svg.svg';
import GoogleIcon from '../../assets/googleIcon.svg';
// import AppleIcon from '../../assets/appleIcon.svg';
import { moderateScale } from 'react-native-size-matters';
import { GraphQLErrors, NormalError } from '../../interfaces/graphqlErrors.interface';
import { SafeAreaView } from 'react-native-safe-area-context';
// import Recaptcha, { RecaptchaHandles } from 'react-native-recaptcha-that-works';
import ConfirmGoogleCaptcha from 'react-native-google-recaptcha-v2';
import Config from 'react-native-config';

type LoginScreenProps = StackNavigationProp<AuthStackParamList, 'RegisterScreen'>;
const width = Dimensions.get('window').width;

export const LoginScreen = () => {
  const navigation = useNavigation<LoginScreenProps>();
  const { signIn, signInWithGoogle } = useContext(AuthContext);

  const { askLocationPermission } = useContext(PermissionsContext);
  const { form, onChange } = useForm({ email: '', password: '' });
  const [isLoading, setisLoading] = useState(false);
  const [formErrors, setFormErrors] = useState<GraphQLErrors[]>([]);
  const [submitErrors, setSubmitErrors] = useState<NormalError | null>();
  const [showErrors, setShowErrors] = useState<boolean>(false);
  const [errorCount, seterrorCount] = useState<number>(0);
  const recaptcha = React.useRef<any>();
  const siteKey = Config.SITE_KEY;
  const baseUrl = Config.BASE_URL;

  const Login = async () => {
    setisLoading(true);
    try {
      const { email, password } = form;
      setShowErrors(false);
      await signIn({ email, password });
      askLocationPermission();
      setisLoading(false);
    } catch (error: GraphQLErrors[] | NormalError | any) {
      setShowErrors(true);
      if (Array.isArray(error)) {
        setFormErrors(error);
        setSubmitErrors(null);
      } else {
        setFormErrors([]);
        setSubmitErrors(error);
      }
      seterrorCount(prev => prev + 1);
      setisLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    setisLoading(true);
    try {
      await signInWithGoogle();
      askLocationPermission();
      setisLoading(false);
    } catch (error) {
      console.log('login google', error);
      setisLoading(false);
    }
  };

  const onMessage = (event: any) => {
    if (event && event.nativeEvent.data) {
      if (['cancel', 'error', 'expired'].includes(event.nativeEvent.data)) {
        recaptcha.current?.hide();
        return;
      } else {
        setTimeout(() => {
          recaptcha.current?.hide();
          Login();
          // do what ever you want here
        }, 1000);
      }
    }
  };

  // const onVerify = (token: string) => {
  //   console.log('success!', token);
  // };

  // const onExpire = () => {
  //   console.warn('expired!');
  // };

  // const send = () => {
  //   console.log('send!');
  //   console.log('recaptcha', recaptcha.current);
  //   recaptcha.current?.show();
  // };

  return (
    <Block style={styles.mainContainer}>
      <StatusBar translucent backgroundColor="transparent" />
      <SafeAreaView>
        <Block
          top
          style={{
            alignSelf: 'center',
            justifyContent: 'center',
            height: 100,
            marginHorizontal: moderateScale(30),
            marginTop: moderateScale(40),
          }}>
          {/* <MobyLogo color={'blue'} width={moderateScale(300)} height={moderateScale(300)} /> */}
          <Image source={require('../../assets/logoOriginal.png')} resizeMode={'contain'} style={{ width: moderateScale(220), height: moderateScale(150) }} />
        </Block>
        <Block>
          <Block middle style={{ marginHorizontal: moderateScale(30) }}>
            <Text size={15} color="gray">
              Inicia sesión o registrate y
            </Text>
            <Text size={30} style={{ marginTop: 5, marginBottom: 20, fontWeight: '800' }} color="black">
              ¡Empieza a viajar!
            </Text>
          </Block>

          <Block style={{ marginHorizontal: moderateScale(30) }}>
            <Input
              placeholder="Correo electrónico"
              placeholderTextColor="gray"
              type="email-address"
              onChangeText={value => onChange(value, 'email')}
              style={styles.inputField}
              color="black"
              autoCapitalize="none"
              editable={!isLoading}
            />
            {formErrors
              .find(e => e.property === 'email')
              ?.errors.map((error, index) => (
                <Block row middle style={{ display: showErrors ? 'flex' : 'none' }}>
                  <Text key={index} color="red" size={11}>
                    * {error.slice(0, 1).toUpperCase() + error.slice(1, error.length)}
                  </Text>
                </Block>
              ))}
            <Input
              placeholder="Contraseña"
              placeholderTextColor="gray"
              password
              BlockPass
              viewPass
              onChangeText={value => onChange(value, 'password')}
              style={styles.inputField}
              color="black"
              autoCapitalize="none"
              editable={!isLoading}
            />
            {formErrors
              .find(e => e.property === 'password')
              ?.errors.map((error, index) => (
                <Block row middle style={{ display: showErrors ? 'flex' : 'none' }}>
                  <Text key={index} color="red" size={11}>
                    * {error.slice(0, 1).toUpperCase() + error.slice(1, error.length)}
                  </Text>
                </Block>
              ))}
            <Block bottom style={{ paddingVertical: 10 }}>
              <Text
                size={15}
                onPress={() => navigation.navigate('ForgotPasswordScreen')}
                color="#ffae3b"
                style={{ alignSelf: 'center', marginVertical: 5 }}
                bold>
                Restablecer contraseña
              </Text>
            </Block>
            <Button
              shadowless
              style={styles.button}
              onPress={() => {
                if (errorCount >= 2) {
                  recaptcha.current.show();
                  return;
                }
                Login();
              }}
              color="#ffae3b"
              loading={isLoading}
              disabled={isLoading}>
              <Text color="black" bold>
                Ingresar
              </Text>
            </Button>
            {/* <Block flex middle top style={{ marginTop: 100 }}> */}
            <ConfirmGoogleCaptcha
              ref={recaptcha}
              siteKey={siteKey}
              baseUrl={baseUrl}
              languageCode="es"
              onMessage={onMessage}
              cancelButtonText="Cancelar"
              style={{ backgroundColor: 'red' }}
            />
            {/* </Block> */}
            {/* <Button title="Send" onPress={send} /> */}

            {submitErrors && (
              <Block row middle style={{ display: showErrors ? 'flex' : 'none' }}>
                <Text color="red" size={11}>
                  {submitErrors.error}
                </Text>
              </Block>
            )}
          </Block>
          <Block
            style={{
              borderBottomWidth: 1,
              borderColor: 'lightgray',
              width: width,
              marginTop: 25,
              marginBottom: 20,
              marginRight: 0,
              paddingHorizontal: 0,
            }}
          />
          <Text size={15} color="gray" style={{ alignSelf: 'center', marginVertical: 10 }}>
            o inicia sesión con Redes Sociales
          </Text>
          <Block style={{ alignSelf: 'center', flexDirection: 'row' }}>
            <Button style={[styles.socialWebsButtons, { borderRadius: 50 }]} onPress={() => loginWithGoogle()}>
              <GoogleIcon />
            </Button>
            {/* <Button
              onlyIcon
              icon="sc-facebook"
              iconFamily="EvilIcons"
              iconSize={30}
              iconColor="#4867aa"
              style={[styles.socialWebsButtons, { marginHorizontal: 10 }]}
              onPress={() => signInWithFacebook()}
            /> */}
            {/* {Platform.OS === 'ios' && (
              <Button style={[styles.socialWebsButtons, { borderRadius: 50 }]}>
                <AppleIcon />
              </Button>
            )} */}
          </Block>
          <Block
            bottom
            style={{
              alignSelf: 'center',
              justifyContent: 'flex-end',
              marginBottom: 30,
            }}>
            <TouchableOpacity onPress={() => navigation.navigate('RegisterScreen')} style={{ alignSelf: 'center', marginTop: 20 }}>
              <Text color="black">
                {' '}
                No tengo cuenta{' '}
                <Text color="#ffae3b" bold>
                  Registrarme
                </Text>{' '}
              </Text>
            </TouchableOpacity>
          </Block>
        </Block>
      </SafeAreaView>
    </Block>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    alignContent: 'center',
    justifyContent: 'center',
    // marginHorizontal: moderateScale(30),
  },
  inputField: {
    borderColor: '#ffae3b',
    borderRadius: 10,
    height: moderateScale(55),
  },
  button: {
    width: '100%',
    alignSelf: 'center',
    height: moderateScale(50),
    borderRadius: 10,
  },
  socialWebsButtons: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
    width: 35,
    height: 35,
    backgroundColor: '#fff',
  },
});

export default LoginScreen;

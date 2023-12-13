import React, { useContext, useState } from 'react';
import { Linking, StyleSheet, TouchableOpacity } from 'react-native';
import { Block, Button, Input, Text } from 'galio-framework';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '../../navigators/Auth/auth.navigator';
import { useNavigation } from '@react-navigation/native';
import { useForm } from '../../hooks/useForms';
import { AuthContext } from '../../services/auth/context/authContext';
import { PermissionsContext } from '../../services/auth/context/permissionsContext';
import { moderateScale } from 'react-native-size-matters';
import GoogleIcon from '../../assets/googleIcon.svg';
// import AppleIcon from '../../assets/appleIcon.svg';
import { ScrollView } from 'react-native-gesture-handler';
import { GraphQLErrors, NormalError } from '../../interfaces/graphqlErrors.interface';
import CheckBox from '@react-native-community/checkbox';

type RegisterScreenProps = StackNavigationProp<AuthStackParamList, 'LoginScreen'>;

export const RegisterScreen = () => {
  const navigation = useNavigation<RegisterScreenProps>();
  const { signUp, signIn } = useContext(AuthContext);
  const [checkBox, setCheckBox] = useState<boolean>(false);
  const { form, onChange } = useForm({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    birthday: '6135323355',
  });
  const [isLoading, setisLoading] = useState<boolean | undefined>(false);
  const { askLocationPermission } = useContext(PermissionsContext);
  const [formErrors, setFormErrors] = useState<GraphQLErrors[]>([]);
  const [submitErrors, setSubmitErrors] = useState<NormalError | null>();
  const [showErrors, setShowErrors] = useState<boolean>(false);
  // const [errorCount, seterrorCount] = useState<number>(0);
  const termsLink = 'https://movy.com.ve';
  const handleSubmit = async () => {
    setisLoading(true);
    try {
      const { email, password } = form;
      const signedUp = await signUp(form);
      if (signedUp) {
        askLocationPermission();
        await signIn({ email, password });
        setisLoading(false);
      }
    } catch (error: GraphQLErrors[] | NormalError | any) {
      setShowErrors(true);
      if (Array.isArray(error)) {
        setFormErrors(error);
        setSubmitErrors(null);
      } else {
        setFormErrors([]);
        setSubmitErrors(error);
      }
      setisLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Block style={styles.labelContainer}>
        <Text size={20} style={styles.label}>
          Registrate
        </Text>
        <Text size={20} style={styles.label}>
          para empezar a viajar.
        </Text>
      </Block>
      <Block flex style={styles.body}>
        <Block flex style={styles.form}>
          <Input
            placeholder="Nombres"
            placeholderTextColor="black"
            onChangeText={value => onChange(value, 'firstName')}
            style={styles.inputField}
            color="#595657"
            editable={!isLoading}
            autoCapitalize="none"
          />
          {formErrors
            .find(e => e.property === 'firstName')
            ?.errors.map((error, index) => (
              <Block row middle style={{ display: showErrors ? 'flex' : 'none' }}>
                <Text key={index} color="red" size={11}>
                  * {error.slice(0, 1).toUpperCase() + error.slice(1, error.length)}
                </Text>
              </Block>
            ))}
          <Input
            placeholder="Apellidos"
            placeholderTextColor="black"
            onChangeText={value => onChange(value, 'lastName')}
            style={styles.inputField}
            color="#595657"
            editable={!isLoading}
            autoCapitalize="none"
          />
          {formErrors
            .find(e => e.property === 'lastName')
            ?.errors.map((error, index) => (
              <Block row middle style={{ display: showErrors ? 'flex' : 'none' }}>
                <Text key={index} color="red" size={11}>
                  * {error.slice(0, 1).toUpperCase() + error.slice(1, error.length)}
                </Text>
              </Block>
            ))}
          <Input
            placeholder="Correo electrónico"
            placeholderTextColor="black"
            type="email-address"
            onChangeText={value => onChange(value, 'email')}
            style={styles.inputField}
            color="#595657"
            editable={!isLoading}
            autoCapitalize="none"
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
            placeholderTextColor="black"
            password
            viewPass
            onChangeText={value => onChange(value, 'password')}
            style={styles.inputField}
            color="#595657"
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
          <Input
            placeholder="Confirmar Contraseña"
            placeholderTextColor="black"
            password
            viewPass
            onChangeText={value => onChange(value, 'confirmPassword')}
            style={styles.inputField}
            color="#595657"
            editable={!isLoading}
          />
          {formErrors
            .find(e => e.property === 'passwordConfirm')
            ?.errors.map((error, index) => (
              <Block row middle style={{ display: showErrors ? 'flex' : 'none' }}>
                <Text key={index} color="red" size={11}>
                  * {error.slice(0, 1).toUpperCase() + error.slice(1, error.length)}
                </Text>
              </Block>
            ))}
          <Block row middle style={{ paddingVertical: 10 }}>
            <CheckBox
              disabled={false}
              value={checkBox}
              boxType="square"
              style={{
                width: moderateScale(10),
                height: moderateScale(10),
                // marginTop: 5,
                marginRight: 10,
                padding: 10,
              }}
              onCheckColor="#ffab3b"
              onTintColor="#ffab3b"
              tintColor="#ffab3b"
              tintColors={{ true: '#ffab3b', false: '#ffab3b' }}
              onValueChange={() => {
                setCheckBox(!checkBox);
              }}
            />
            <Text
              size={12}
              color="black
            ">
              Acepto los
            </Text>
            <Text
              onPress={async () => {
                await Linking.openURL(termsLink);
              }}
              size={12}
              color="black"
              style={styles.link}>
              términos y condiciones
            </Text>
            <Text
              size={12}
              style={{ marginLeft: 5 }}
              color="black"
            >
              de movy app
            </Text>
          </Block>
          <Block row>
            <Button
              color="#ffae3b"
              style={[styles.button, { marginBottom: submitErrors ? 5 : 20 }]}
              onPress={handleSubmit}
              loading={isLoading}
              disabled={isLoading}>
              <Text style={styles.buttonText}>Registrarse</Text>
            </Button>
          </Block>
          {submitErrors && submitErrors?.error && (
            <Block row middle>
              <Block row middle style={{ display: showErrors ? 'flex' : 'none' }}>
                <Text color="red" size={11}>
                  {submitErrors.error}
                </Text>
              </Block>
            </Block>
          )}
          <Block>
            <Text bold>O inicia sesión con Redes Sociales</Text>
            <Block style={{ alignSelf: 'center', flexDirection: 'row', marginVertical: moderateScale(10) }}>
              <Button style={{ ...styles.socialWebsButtons, borderRadius: 50 }}>
                <GoogleIcon />
              </Button>
              {/* <Button
                onlyIcon
                icon="sc-facebook"
                iconFamily="EvilIcons"
                iconSize={30}
                iconColor="#4867aa"
                style={{ ...styles.socialWebsButtons, marginHorizontal: 10 }}
              /> */}
              {/* {Platform.OS === 'ios' && (
                <Button style={{ ...styles.socialWebsButtons, borderRadius: 50 }}>
                  <AppleIcon />
                </Button>
              )} */}
            </Block>
          </Block>
        </Block>
      </Block>
      <Block style={{ position: 'absolute', alignSelf: 'center', bottom: 30 }} row>
        <TouchableOpacity onPress={() => navigation.navigate('LoginScreen')} style={{ alignSelf: 'center', marginTop: 50 }}>
          <Text color="black">
            {' '}
            Tengo una cuenta <Text style={styles.underline}>Iniciar Sesión</Text>{' '}
          </Text>
        </TouchableOpacity>
      </Block>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    marginHorizontal: moderateScale(30),
  },
  body: {
    flex: 1,
    marginVertical: 50,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  form: {
    alignItems: 'center',
    flex: 1,
    marginTop: moderateScale(-40),
  },
  labelContainer: {
    marginTop: moderateScale(40),
  },
  label: {
    fontWeight: '500',
    color: '#595657',
  },
  footer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputField: {
    height: moderateScale(55),
    borderColor: '#ffae3b',
    borderRadius: 10,
  },
  button: {
    width: '100%',
    height: moderateScale(50),
    borderRadius: 10,
    backgroundColor: '#ffae3b',
    alignItems: 'center',
    justifyContent: 'center',
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
  buttonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
  },
  underline: {
    textDecorationLine: 'underline',
    color: '#ffae3b',
  },
  link: {
    fontWeight: 'bold',
    textDecorationLine: 'underline',
    textDecorationColor: 'black',
    marginLeft: 5,
  },
});

export default RegisterScreen;

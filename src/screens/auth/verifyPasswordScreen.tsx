import React, { useState } from 'react';
import { Image, Modal, Pressable, StatusBar, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useForm } from '../../hooks/useForms';
import { Text, Input, Button, Block } from 'galio-framework';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '../../navigators/Auth/auth.navigator';
import { moderateScale } from 'react-native-size-matters';
import ExitIcon from '../../assets/icons/feather/exit.svg';
import { AuthContext } from '../../services/auth/context/authContext';
import { GraphQLErrors, NormalError } from '../../interfaces/graphqlErrors.interface';

type VerifyPasswordScreenProps = StackNavigationProp<AuthStackParamList, 'VerifyPasswordScreen'>;

export const VerifyPasswordScreen = ({ route }: any) => {
  const navigation = useNavigation<VerifyPasswordScreenProps>();
  const { forgotPasswordToken, resetPassword } = React.useContext(AuthContext);
  const { form, onChange } = useForm({ newPassword: '', newPasswordConfirm: '' });
  const [isLoading, setisLoading] = useState(false);
  const [verifyModal, setVerifyModal] = useState(false);
  const [formErrors, setFormErrors] = useState<GraphQLErrors[]>([]);
  const [submitErrors, setSubmitErrors] = useState<NormalError | null>();

  const changePassword = async () => {
    try {
      const { newPassword, newPasswordConfirm } = form;
      const email = forgotPasswordToken.data.forgotPasswordVerifyToken.email;
      setisLoading(true);
      await resetPassword(email, newPassword, newPasswordConfirm, route.params.passwordToken);
      setisLoading(false);
      setVerifyModal(true);
      setTimeout(() => {
        navigation.navigate('LoginScreen');
        setVerifyModal(false);
      }, 3000);
    } catch (error: GraphQLErrors[] | NormalError | any) {
      console.log('errores en vista', error);
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

  React.useEffect(() => {
    console.log('token', route.params.passwordToken);
    // console.log('forgotPasswordToken', forgotPasswordToken);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Block style={styles.mainContainer}>
      <StatusBar translucent backgroundColor="transparent" />
      <Block top style={{ paddingTop: 30 }}>
        <TouchableOpacity onPress={() => navigation.navigate('LoginScreen')}>
          <ExitIcon color={'black'} />
        </TouchableOpacity>
      </Block>
      <Block style={{ flex: 2, alignSelf: 'center', justifyContent: 'center', width: '100%' }}>
        <Block
          style={{
            alignSelf: 'center',
            justifyContent: 'flex-end',
            marginHorizontal: moderateScale(30),
          }}>
          <Image
            source={require('../../assets/logoOriginal.png')}
            resizeMode={'contain'}
            style={{ width: moderateScale(150), height: moderateScale(120), top: moderateScale(-30) }}
          />
        </Block>
        <Input
          placeholder="Nueva contraseña"
          placeholderTextColor="black"
          password
          BlockPass
          viewPass
          iconColor="gray"
          onChangeText={value => onChange(value, 'newPassword')}
          style={styles.inputField}
          color="#595657"
          autoCapitalize="none"
          editable={!isLoading}
        />
        <Input
          placeholder="Repetir contraseña"
          placeholderTextColor="black"
          password
          BlockPass
          viewPass
          iconColor="gray"
          onChangeText={value => onChange(value, 'newPasswordConfirm')}
          style={styles.inputField}
          color="#595657"
          autoCapitalize="none"
          editable={!isLoading}
        />
        {formErrors
          .find(e => e.property === 'newPassword')
          ?.errors.map((error, index) => (
            <Block row middle>
              <Text key={index} color="red" size={11}>
                * {error.slice(0, 1).toUpperCase() + error.slice(1, error.length)}
              </Text>
            </Block>
          ))}
        {formErrors
          .find(e => e.property === 'newPasswordConfirm')
          ?.errors.map((error, index) => (
            <Block row middle>
              <Text key={index} color="red" size={11}>
                * {error.slice(0, 1).toUpperCase() + error.slice(1, error.length)}
              </Text>
            </Block>
          ))}
        {submitErrors && (
          <Block row middle>
            <Text color="red" size={15}>
              {submitErrors.error}
            </Text>
          </Block>
        )}
        <Button onPress={changePassword} shadowless style={styles.button} color="#ffae3b" loading={isLoading} disabled={isLoading}>
          <Text color="black" bold>
            Restablecer contraseña
          </Text>
        </Button>
      </Block>

      <Modal visible={verifyModal} nativeID="1" animationType="fade" transparent>
        <Pressable onPress={() => setVerifyModal(false)} style={styles.modalContainer}>
          <Block style={styles.modalSubcontainer}>
            <Text color="black" style={styles.textAling} size={20} bold>
              Su contraseña ha sido restablecida.
            </Text>
          </Block>
        </Pressable>
      </Modal>
    </Block>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    alignContent: 'center',
    justifyContent: 'center',
    marginHorizontal: moderateScale(30),
  },
  textAling: {
    textAlign: 'center',
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
    marginBottom: 20,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(1,1,1, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalSubcontainer: {
    width: moderateScale(330),
    // height: moderateScale(600),
    alignSelf: 'center',
    backgroundColor: 'white',
    paddingVertical: moderateScale(20),
    paddingHorizontal: moderateScale(10),
    borderRadius: 20,
  },
});

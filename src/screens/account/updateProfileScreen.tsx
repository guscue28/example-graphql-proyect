import React, { useEffect } from 'react';
import { Block, Button, Input, Text } from 'galio-framework';
import { Dimensions, Image, Modal, StyleSheet, TextInput, TouchableOpacity, Keyboard, Pressable, View, ActivityIndicator } from 'react-native';
import { AuthContext } from '../../services/auth/context/authContext';
//Libraries
import { CameraOptions, ImageLibraryOptions, launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { moderateScale } from 'react-native-size-matters';
import PhoneInput from 'react-native-phone-input';
import { ScrollView } from 'react-native-gesture-handler';
import SelectDropdown from 'react-native-select-dropdown';
//Icons
import CameraIcon from '../../assets/icons/camara.svg';
import GaleryIcon from '../../assets/icons/galeria.svg';
import { ReactNativeFile } from 'apollo-upload-client';
import * as mime from 'react-native-mime-types';
import { User, UserIdentificationNumberTypes } from '../../services/user/user.interface';
import { GraphQLErrors, NormalError } from '../../interfaces/graphqlErrors.interface';

const width = Dimensions.get('window').width;
const identificationTypesArray = ['V', 'J', 'P', 'E'];

export const UpdateProfileScreen = ({ navigation }: any) => {
  const { user, updateUser } = React.useContext(AuthContext);
  const [image, setImage] = React.useState<string | undefined>(user?.picture ? user.picture : 'https://picsum.photos/200/200');
  const [imageSelected, setImageSelected] = React.useState<ReactNativeFile | null>(null);
  const [firstName, setFirstName] = React.useState<string>('');
  const [lastName, setLastName] = React.useState<string | undefined>('');
  const [phoneNumber, setPhoneNumber] = React.useState<string | undefined>('');
  const [email, setEmail] = React.useState<string | undefined>('');
  const [idNumber, setIdNumber] = React.useState<string | undefined>('');
  const [idNumberType, setIdNumberType] = React.useState<string | undefined>('');
  const [oldPassword, setOldPassword] = React.useState<string | undefined>('');
  const [newPassword, setNewPassword] = React.useState<string | undefined>('');
  const [verifyNewPAssword, setverifyNewPAssword] = React.useState<string | undefined>('');
  const [showModal, setShowModal] = React.useState<boolean>(false);
  const [updateModal, setUpdateModal] = React.useState<boolean>(false);
  const [imagePicker, setImagePicker] = React.useState<boolean>(false);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [showErrors, setShowErrors] = React.useState<boolean>(false);
  const [formErrors, setFormErrors] = React.useState<GraphQLErrors[]>([]);
  const [submitErrors, setSubmitErrors] = React.useState<NormalError | null>();
  const [errorCount, seterrorCount] = React.useState<number>(0);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [keyboardStatus, setKeyboardStatus] = React.useState<boolean>(false);
  const numberRef = React.useRef<any>(null);

  const openImagePicker = async () => {
    const options: ImageLibraryOptions = {
      mediaType: 'photo',
      includeBase64: true,
      quality: 0.5,
    };
    setImagePicker(false);
    const result = await launchImageLibrary(options);
    if (result.didCancel) {
      setImage(user?.picture ? user.picture : 'https://picsum.photos/200/200');
    } else if (result.errorCode) {
      console.log('Error: ', result.errorMessage);
    } else if (result.assets && result.assets.length && result.assets[0].fileSize! > 1048576) {
      console.log('Error: ', 'File size is too big');
    } else if (result.assets && result.assets.length && result.assets[0].fileSize! < 1048576) {
      const res: ReactNativeFile = generateRNFile(result.assets[0].uri!, `profile-${user?._id}`);
      setImageSelected(res);
      setImage(result.assets[0].uri);
    }
  };
  const openCamera = async () => {
    const options: CameraOptions = {
      mediaType: 'photo',
      includeBase64: true,
      cameraType: 'front',
    };
    setImagePicker(false);
    const result = await launchCamera(options);
    if (result.didCancel) {
      setImage(user?.picture ? user.picture : 'https://picsum.photos/200/200');
    } else if (result.errorCode) {
      console.log('Error: ', result.errorMessage);
    }
    const imagePicked = result.assets?.map((el: any) => {
      const res: ReactNativeFile = generateRNFile(el.uri, `profile-${user?._id}`);
      setImageSelected(res);
      setImage(el.uri);
    });
    setImagePicker(false);
    return imagePicked;
  };
  const generateRNFile = (uri: string, name: string) => {
    return new ReactNativeFile({
      uri,
      type: mime.lookup(uri) || 'image',
      name,
    });
  };

  const _keyboardDidHide = () => {
    setKeyboardStatus(false);
  };

  const updateData = async () => {
    try {
      setLoading(true);
      setUpdateModal(true);
      const data: User = {
        firstName,
        lastName,
        phoneNumber,
        idNumber,
        idNumberType,
      };
      await updateUser(data, imageSelected);
      setLoading(false);
      setTimeout(() => {
        setUpdateModal(false);
      }, 2000);
      setTimeout(() => {
        navigation.goBack();
      }, 2500);
    } catch (error: GraphQLErrors[] | NormalError | any) {

      setUpdateModal(false);
      setLoading(false);
      setShowErrors(true);
      if (Array.isArray(error)) {
        setFormErrors(error);
        setSubmitErrors(null);
      } else {
        setFormErrors([]);
        setSubmitErrors(error);
      }
      seterrorCount(prev => prev + 1);
    }
  };

  useEffect(() => {
    console.log(user);
    setFirstName(user?.firstName!);
    setLastName(user?.lastName);
    setPhoneNumber(user?.phoneNumber);
    setEmail(user?.email);
    setIdNumber(user?.idNumber);
    setIdNumberType(user?.idNumberType);
    Keyboard.addListener('keyboardDidHide', _keyboardDidHide);
  }, [user]);

  return (
    <Block style={styles.container}>
      <ScrollView>
        <Modal animationType="slide" nativeID="1" transparent visible={showModal}>
          <Pressable onPress={() => Keyboard.dismiss()} style={styles.modalContainer}>
            <Block style={styles.modalSubcontainer}>
              <Block style={styles.modalPasswordInputContainer}>
                <Text size={14} bold color="gray" style={[styles.titleText, styles.modalPasswordInputLabel]}>
                  Contraseña Actual
                </Text>
                <Input
                  BlockPass
                  viewPass
                  password
                  placeholderTextColor="black"
                  keyboardType="default"
                  textContentType="password"
                  style={[styles.textName, styles.modalPasswordInput]}
                  value={oldPassword}
                  onChangeText={(val: string) => {
                    setOldPassword(val);
                    // console.log('creditCarRef', creditCarRef.current);
                  }}
                  autoCapitalize="none"
                  // onSubmitEditing={() => cityRef.current.focus()}
                />
                <Text size={14} bold color="gray" style={[styles.titleText, styles.modalPasswordInputLabel]}>
                  Contraseña Nueva
                </Text>
                <Input
                  BlockPass
                  viewPass
                  password
                  placeholderTextColor="black"
                  keyboardType="default"
                  textContentType="password"
                  style={[styles.textName, styles.modalPasswordInput]}
                  value={newPassword}
                  onChangeText={(val: string) => {
                    setNewPassword(val);
                    // console.log('creditCarRef', creditCarRef.current);
                  }}
                  autoCapitalize="none"
                  // onSubmitEditing={() => cityRef.current.focus()}
                />
                <Text size={14} bold color="gray" style={[styles.titleText, styles.modalPasswordInputLabel]}>
                  Validar Contraseña Nueva
                </Text>
                <Input
                  BlockPass
                  viewPass
                  password
                  placeholderTextColor="black"
                  keyboardType="default"
                  textContentType="password"
                  style={[styles.textName, styles.modalPasswordInput]}
                  value={verifyNewPAssword}
                  onChangeText={(val: string) => {
                    setverifyNewPAssword(val);
                  }}
                  autoCapitalize="none"
                />
              </Block>

              <Block row right style={styles.btnSectionContainer}>
                <TouchableOpacity
                  style={styles.btnContainer}
                  onPress={() => {
                    setShowModal(false);
                  }}>
                  <Text color="gray" style={styles.btnText}>
                    Cancelar
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.btnContainer}
                  // disabled={isValidFiscal()}
                  onPress={async () => {
                    setShowModal(false);
                  }}>
                  <Text color="black" bold style={styles.btnText}>
                    Aceptar
                  </Text>
                </TouchableOpacity>
              </Block>
            </Block>
          </Pressable>
        </Modal>

        <Modal animationType="slide" nativeID="2" transparent visible={updateModal}>
          <Block style={styles.modalContainer}>
            <Block style={styles.modalSubcontainer}>
              {loading ? (
                <ActivityIndicator style={styles.modalTextName} size={'large'} />
              ) : (
                <Text style={styles.modalTextName} color="black" size={20}>
                  Tus datos se actualizaron correctamente
                </Text>
              )}
            </Block>
          </Block>
        </Modal>

        <Modal animationType="slide" nativeID="3" transparent visible={imagePicker}>
          <Pressable onPress={() => setImagePicker(false)} style={styles.imageModalContainer}>
            <Block style={styles.imageModalSubcontainer}>
              <Block style={styles.imageModalTitle}>
                <Text color="black" size={14} bold>
                  Cambiar foto de perfil
                </Text>
              </Block>
              <Block row right>
                <Block space="between" middle style={styles.imageModalContainerButton}>
                  <TouchableOpacity
                    style={styles.imageBtn}
                    onPress={() => {
                      openCamera();
                    }}>
                    <CameraIcon width={20} height={20} />
                  </TouchableOpacity>
                  <Text color="gray" size={13} style={styles.imageModalButtonTitle}>
                    Cámara
                  </Text>
                </Block>
                <Block space="between" middle style={styles.imageModalContainerButton}>
                  <TouchableOpacity
                    style={styles.imageBtn}
                    onPress={() => {
                      openImagePicker();
                    }}>
                    <GaleryIcon fill="black" color={'black'} width={20} height={20} />
                  </TouchableOpacity>
                  <Text color="gray" size={13} style={styles.imageModalButtonTitle}>
                    Galeria
                  </Text>
                </Block>
              </Block>
            </Block>
          </Pressable>
        </Modal>

        <Block style={styles.header}>
          <Block style={styles.headerContent}>
            <Block middle>
              <TouchableOpacity
                onPress={() => {
                  setImagePicker(true);
                }}>
                <Image
                  source={{
                    uri: image ? image : user?.picture,
                  }}
                  style={styles.avatar}
                />
              </TouchableOpacity>
            </Block>
            <View style={styles.imagebutton}>
              <CameraIcon style={styles.imageIcon} width={20} height={20} />
            </View>
          </Block>
        </Block>
        <Block style={styles.sections}>
          <Text size={14} color="lightgray" style={styles.titleText}>
            Nombre
          </Text>
          <TextInput
            placeholderTextColor="lightgray"
            keyboardType="default"
            textContentType="name"
            style={styles.textName}
            value={firstName}
            onChangeText={(val: string) => {
              setFirstName(val);
              // console.log('creditCarRef', creditCarRef.current);
            }}
            autoCapitalize="none"
            // onSubmitEditing={() => cityRef.current.focus()}
          />
          <Text size={14} color="lightgray" style={styles.titleText}>
            Apellido
          </Text>
          <TextInput
            placeholderTextColor="lightgray"
            keyboardType="default"
            textContentType="name"
            style={styles.textName}
            value={lastName}
            onChangeText={(val: string) => {
              setLastName(val);
              // console.log('creditCarRef', creditCarRef.current);
            }}
            autoCapitalize="none"
            // onSubmitEditing={() => cityRef.current.focus()}
          />
        </Block>
        <Block style={styles.separator} />
        <Block style={styles.sections}>
          <Text size={14} bold color="gray" style={styles.titleText}>
            Documento de identidad
          </Text>
          <View style={{ flexDirection: 'row', justifyContent: 'flex-start' }}>
            <SelectDropdown
              defaultValue={user?.idNumberType ? user.idNumberType : identificationTypesArray[0]}
              data={identificationTypesArray}
              buttonStyle={{ width: 50, height: 40, marginLeft: 10, marginTop: 10, borderRadius: 6 }}
              onSelect={index => {
                if (index === 'J') {
                  return setIdNumberType(UserIdentificationNumberTypes.RIF);
                } else if (index === 'V') {
                  return setIdNumberType(UserIdentificationNumberTypes.CI);
                } else if (index === 'P') {
                  return setIdNumberType(UserIdentificationNumberTypes.PASSPORT);
                } else {
                  return setIdNumberType(UserIdentificationNumberTypes.FOREIGN);
                }
              }}
              buttonTextAfterSelection={selectedItem => {
                return selectedItem;
              }}
              rowTextForSelection={item => {
                return item;
              }}
            />
            <TextInput
              placeholderTextColor="lightgray"
              keyboardType="default"
              textContentType="name"
              style={styles.textName}
              value={idNumber}
              onChangeText={(val: string) => {
                setIdNumber(val);
              }}
              autoCapitalize="none"
            />
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
            <Text>
              {formErrors
                .find(e => e.property === 'idNumber')
                ?.errors.map((error, index) => (
                  <Block row middle style={{ display: showErrors ? 'flex' : 'none' }}>
                    <Text key={index} color="red" size={11}>
                      * {error.slice(0, 1).toUpperCase() + error.slice(1, error.length)}
                    </Text>
                  </Block>
                ))}
            </Text>
          </View>
        </Block>
        <Block style={styles.sections}>
          <Text size={14} bold color="gray" style={styles.titleText}>
            Número de Teléfono
          </Text>
          <PhoneInput
            initialValue={'+58'}
            ref={numberRef}
            initialCountry={'ves'}
            offset={20}
            pickerButtonColor="white"
            onChangePhoneNumber={(val: any) => {
              setPhoneNumber(val);
            }}
            textProps={{
              keyboardType: 'numeric',
              defaultValue: user?.phoneNumber ? user.phoneNumber : '',
            }}
            style={styles.phoneInput}
            textStyle={styles.phoneInputText}
            confirmText="Confirmar"
            confirmTextStyle={styles.selectorText}
            cancelText="Cancelar"
            cancelTextStyle={styles.selectorText}
          />

          <Text size={14} bold color="gray" style={styles.titleText}>
            Correo electrónico
          </Text>
          <TextInput
            placeholderTextColor="lightgray"
            keyboardType="default"
            textContentType="name"
            style={styles.textName}
            value={email}
            onChangeText={(val: string) => {
              setEmail(val);
              // console.log('creditCarRef', creditCarRef.current);
            }}
            autoCapitalize="none"
            // onSubmitEditing={() => cityRef.current.focus()}
          />
          <Text size={14} bold color="gray" style={styles.titleText}>
            Contraseña
          </Text>
          <Block row space="between">
            <TextInput
              placeholderTextColor="black"
              placeholder="*********"
              keyboardType="default"
              textContentType="password"
              style={styles.textName}
              value={'*********'}
              editable={false}
              autoCapitalize="none"
              // onSubmitEditing={() => cityRef.current.focus()}
            />
            <TouchableOpacity onPress={() => setShowModal(true)} style={styles.changePasswordBtn}>
              <Text color="blue" size={13} style={styles.changePasswordButton}>
                Cambiar Contraseña
              </Text>
            </TouchableOpacity>
          </Block>
        </Block>
        <Block style={styles.separator} />
        <Block row middle>
          <Button onPress={() => updateData()} size={'large'} style={styles.updateBtn}>
            <Text color="black" bold size={16}>
              Actualizar
            </Text>
          </Button>
        </Block>
        <View style={{ height: moderateScale(60) }} />
      </ScrollView>
    </Block>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 5,
    backgroundColor: '#fff',
  },
  headerContent: {
    marginBottom: 5,
  },
  sections: {
    paddingHorizontal: moderateScale(30),
    paddingVertical: moderateScale(10),
    width: '100%',
  },
  separator: {
    width: width,
    borderBottomWidth: 1,
    borderBottomColor: 'lightgray',
    marginBottom: 10,
  },
  avatar: {
    width: 110,
    height: 110,
    borderRadius: 20,
    borderWidth: 4,
    marginBottom: 10,
  },
  titleText: {
    // fontFamily: 'Montserrat-Bold',
    // fontSize: 14,
    marginTop: 10,
  },
  textName: {
    // borderBottomWidth: 1,
    // borderBottomColor: 'lightgray',
    height: 35,
    paddingLeft: 0,
    color: 'black',
    marginTop: 10,
    paddingVertical: 5,
    fontSize: 18,
  },
  changePasswordButton: {
    textDecorationLine: 'underline',
    textDecorationColor: '#1855a8',
  },
  modalPasswordInputLabel: {
    paddingVertical: 10,
  },
  modalPasswordInput: {
    height: moderateScale(50),
    borderBottomWidth: 1,
    borderBottomColor: 'lightgray',
    borderWidth: 0,
    borderRadius: 0,
    marginTop: 0,
  },
  modalPasswordInputContainer: {
    paddingHorizontal: moderateScale(20),
    paddingVertical: moderateScale(20),
    width: '100%',
  },
  modalTextName: {
    // borderBottomWidth: 1,
    // borderBottomColor: 'lightgray',
    paddingVertical: 10,
    paddingHorizontal: 20,
    fontSize: 18,
    justifyContent: 'center',
    alignSelf: 'center',
    textAlign: 'center',
  },
  phoneInput: {
    // fontFamily: 'Montserrat-Regular',
    paddingVertical: 5,
    height: 50,
    marginLeft: 10,
    marginTop: -1,
    color: 'black',
  },
  phoneInputText: {
    height: 50,
    // fontFamily: 'Montserrat-Regular',
    color: 'black',
    backgroundColor: 'white',
  },
  changePasswordBtn: {
    marginLeft: moderateScale(-100),
    paddingVertical: moderateScale(15),
  },
  updateBtn: {
    marginTop: 20,
    backgroundColor: '#ffae3b',
    paddingVertical: 10,
    marginHorizontal: 30,
    borderRadius: 10,
  },

  //Modal
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
    paddingHorizontal: 10,
    borderRadius: 20,
    marginTop: moderateScale(20),
  },
  btnContainer: {
    paddingVertical: 10,
    width: moderateScale(70),
    height: 40,
    marginTop: 10,
    marginBottom: 20,
    borderRadius: 10,
  },
  btnText: {
    flex: 1,
    justifyContent: 'center',
    alignSelf: 'center',
    // fontFamily: 'Montserrat-Bold',
  },
  btnSectionContainer: {
    // marginLeft: -20,
    paddingHorizontal: 30,
    justifyContent: 'center',
    alignSelf: 'flex-end',
  },
  containerInputs: {
    paddingHorizontal: moderateScale(10),
    marginTop: moderateScale(10),
  },
  //Image Picker Modal
  imageModalContainer: {
    flex: 1,
    backgroundColor: 'rgba(1,1,1, 0.5)',
    alignItems: 'center',
    justifyContent: 'flex-end',
    width: width,
  },
  imageModalSubcontainer: {
    width: width,
    height: moderateScale(180),
    alignSelf: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 10,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    marginTop: moderateScale(20),
  },
  imageModalTitle: {
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  imageModalContainerButton: {
    paddingVertical: 10,
    marginHorizontal: 10,
  },
  imageModalButtonTitle: {
    marginVertical: 5,
    // fontFamily: 'Montserrat-Regular',
  },
  imageBtn: {
    paddingHorizontal: 25,
    // marginHorizontal: 20,
    backgroundColor: '#ffcc8a',
    width: 70,
    height: 70,
    borderRadius: 100,
    alignContent: 'center',
    justifyContent: 'center',
  },
  imagebutton: {
    backgroundColor: '#ffae3b',
    width: 30,
    height: 30,
    borderRadius: 50,
    alignContent: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: moderateScale(70),
    right: moderateScale(120),
  },
  imageIcon: {
    alignSelf: 'center',
  },
  selectorText: {
    color: 'black',
    textDecorationLine: 'underline',
    textDecorationColor: 'black',
    fontWeight: 'bold',
  },
  sectionIdDoc: {
    justifyContent: 'space-between',
  },
  dropdownStyles: {
    width: 30,
  },
});

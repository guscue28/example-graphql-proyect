import * as React from 'react';
import { StyleSheet, Dimensions, Modal, SectionList, TouchableOpacity, FlatList, Platform, ImageBackground } from 'react-native';
import { useForm } from '../../hooks/useForms';
import { Block, Text, Button, Input } from 'galio-framework';
import { FinancingComponent } from '../../components/financing/financing.component';
// import { StackNavigationProp } from '@react-navigation/stack';
// import { MyProfileParamList } from '../../navigators/Account/account.navigator';
// import { AuthContext } from '../../services/auth/context/authContext';
// import { useNavigation } from '@react-navigation/native';
// import DateTimePicker from '@react-native-community/datetimepicker';
import DatePicker from 'react-native-date-picker';

import { moderateScale } from 'react-native-size-matters';
import SelectDropdown from 'react-native-select-dropdown';
import moment from 'moment';
import CrownIcon from '../../assets/icons/corona.svg';
import FinancingIcon from '../../assets/icons/financing.svg';
import DiscountIcon from '../../assets/icons/discount.svg';
import HairCutIcon from '../../assets/icons/hairCut.svg';
import TalkingIcon from '../../assets/icons/talking.svg';
import CarChargerIcon from '../../assets/icons/carCharger.svg';
import ExitIcon from '../../assets/icons/feather/exit.svg';
import CalendarIcon from '../../assets/icons/calendarYellow.svg';
import PaperClipIcon from '../../assets/icons/paperclip.svg';
import { ScrollView, TextInput } from 'react-native-gesture-handler';
import { AuthContext } from '../../services/auth/context/authContext';

// type MembershipScreenProps = StackNavigationProp<MyProfileParamList>;
const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

export const MembershipScreen = () => {
  // const navigation = useNavigation<MembershipScreenProps>();
  const { user } = React.useContext(AuthContext);
  const { form, onChange } = useForm({ name: '', birthdate: new Date(), documentType: '', documentNumber: '', phoneNumber: '', fiscalAddress: '' });
  const [financingLoading, setFinancingLoading] = React.useState(false);
  // const [membership, setMembership] = React.useState<boolean>();
  const [financingModal, setFinancingModal] = React.useState<boolean>(false);
  const [journeyDate, setJourneyDate] = React.useState<Date>(new Date());
  const [showDatePicker, setShowDatePicker] = React.useState<boolean>(false);
  const [ciRiValues, setciRiValues] = React.useState<string>('V');
  const [nameFocus, setNameFocus] = React.useState<boolean>(false);
  const [documentNumberFocus, setDocumentNumberFocus] = React.useState<boolean>(false);
  const [phoneNumberFocus, setPhoneNumberFocus] = React.useState<boolean>(false);
  const [fiscalAddressFocus, setFiscalAddressFocus] = React.useState<boolean>(false);
  const [showError, setShowError] = React.useState<boolean>(false);
  const [errorString, setErrorString] = React.useState<string>('');

  const financingPlans = [
    {
      image: require('../../assets/vehicles/coupe.png'),
      price: '16,900',
    },
    {
      image: require('../../assets/vehicles/suv.png'),
      price: '25,900',
    },
    {
      image: require('../../assets/vehicles/sedan.png'),
      price: '20,900',
    },
  ];
  const ciRifValuesSelec = ['V', 'E', 'J', 'P', 'G', 'C'];

  const applyFinancing = async () => {
    setFinancingLoading(true);
    try {
      const { name, birthdate, documentType, documentNumber, phoneNumber, fiscalAddress } = form;
      const numberReg = new RegExp('^[0-9]+$');
      const leterReg = new RegExp('^[ñíóáéú a-zA-Z ]+$');
      if (name === '' || documentNumber === '' || fiscalAddress === '') {
        setShowError(true);
        setErrorString('Todos los campos son obligatorios');
        setFinancingLoading(false);
        return;
      }
      if (leterReg.test(name) === false) {
        setShowError(true);
        setErrorString('El nombre solo puede contener letras');
        setFinancingLoading(false);
        return;
      }
      if (moment().diff(moment(birthdate, 'YYYY-MM-DD'), 'years') < 18) {
        setShowError(true);
        setErrorString('El cliente debe ser mayor de edad');
        setFinancingLoading(false);
        return;
      }
      if (numberReg.test(documentNumber) === false) {
        setShowError(true);
        setErrorString('El número de documento debe contener solo números');
        setFinancingLoading(false);
        return;
      }
      if (numberReg.test(phoneNumber) === false) {
        setShowError(true);
        setErrorString('El número de teléfono debe ser válido');
        setFinancingLoading(false);
        return;
      }
      console.log('form', name, birthdate, documentType, documentNumber, phoneNumber, fiscalAddress);
      setShowError(false);
      setErrorString('');
      setTimeout(() => {
        setFinancingLoading(false);
        setFinancingModal(false);
        form.name = '';
        form.documentNumber = '';
        form.phoneNumber = '';
        form.fiscalAddress = '';
      }, 2000);
    } catch (error) {
      console.log(error);
    }
  };
  const handleDatePicked = async (date: Date) => {
    setShowDatePicker(false);
    setJourneyDate(date);
    onChange(date, 'birthdate');
  };

  const components = [
    {
      data: [
        <>
          <Block row style={{ paddingHorizontal: 20 }}>
            <Block style={styles.financingIcon}>
              <FinancingIcon width={30} height={30} />
            </Block>
            <Block style={{ marginLeft: 10 }}>
              <Text numberOfLines={3} bold size={15} color="black">
                Financiamiento
              </Text>
              <Text size={13} color="black" style={{ textAlign: 'justify', width: '40%' }}>
                Elija el tipo de financiamiento al que desea aplicar, llene sus datos, cargue sus documentos y toque aplicar.
              </Text>
            </Block>
          </Block>
        </>,
      ],
    },
    {
      data: [
        <>
          <Block style={{ marginTop: 20 }}>
            <FlatList
              horizontal={true}
              data={financingPlans}
              nestedScrollEnabled
              showsHorizontalScrollIndicator={false}
              renderItem={({ item, index }: any) => <FinancingComponent item={item} index={index} total={financingPlans.length} mapScreen={false} />}
            />
          </Block>
        </>,
      ],
    },
    {
      data: [
        <>
          <Block style={{ marginTop: 20, paddingHorizontal: 22 }}>
            <Text bold size={15} color="black">
              Llena los datos del beneficiario
            </Text>
          </Block>
          <Block flex style={styles.body}>
            <Block flex style={styles.form}>
              <Input
                placeholder="Nombre Completo"
                placeholderTextColor={nameFocus ? 'black' : 'gray'}
                onPressIn={() => {
                  setNameFocus(true);
                  setDocumentNumberFocus(false);
                  setPhoneNumberFocus(false);
                  setFiscalAddressFocus(false);
                }}
                onChangeText={value => {
                  onChange(value, 'name');
                }}
                style={styles.inputField}
                color="black"
                // editable={!isLoading}
                autoCapitalize="none"
              />
              {/* <Input
                placeholder="Fecha de Nacimiento"
                placeholderTextColor={moment(journeyDate).format('DD/MM/YYYY') === '' ? 'gray' : 'black'}
                value={moment(journeyDate).format('DD/MM/YYYY')}
                onChangeText={value => onChange(value, 'name')}
                style={styles.inputField}
                color="black"
                // editable={!isLoading}
                autoCapitalize="none"
              /> */}
              <Block
                row
                style={{
                  width: '100%',
                  borderRadius: moderateScale(10),
                  borderColor: '#ffae3b',
                  borderWidth: 1,
                  backgroundColor: 'white',
                  height: moderateScale(45),
                }}>
                <TextInput
                  placeholder="Fecha de Nacimiento"
                  placeholderTextColor={moment(journeyDate).format('DD/MM/YYYY') === '' ? 'gray' : 'black'}
                  value={moment(journeyDate).format('DD/MM/YYYY')}
                  onChangeText={value => onChange(value, 'name')}
                  // editable={!isLoading}
                  autoCapitalize="none"
                  editable={false}
                  style={{
                    color: 'black',
                    paddingHorizontal: 20,
                    width: '85%',
                    borderTopLeftRadius: moderateScale(10),
                    borderBottomLeftRadius: moderateScale(10),
                  }}
                />
                <TouchableOpacity
                  onPress={() => {
                    setShowDatePicker(!showDatePicker);
                    setNameFocus(false);
                    setDocumentNumberFocus(false);
                    setPhoneNumberFocus(false);
                    setFiscalAddressFocus(false);
                  }}
                  // color="#ffecd2"
                  style={styles.calendarButton}>
                  <CalendarIcon width={moderateScale(25)} height={moderateScale(25)} />
                </TouchableOpacity>
                <DatePicker
                  modal
                  mode="date"
                  androidVariant="iosClone"
                  confirmText="Confirmar"
                  cancelText="Cancelar"
                  textColor={Platform.OS === 'ios' ? 'white' : 'black'}
                  title="Seleccione la fecha"
                  open={showDatePicker}
                  date={journeyDate}
                  onConfirm={date => {
                    handleDatePicked(date);
                    // handleDatePicked(event, value);
                  }}
                  onCancel={() => {
                    setShowDatePicker(!showDatePicker);
                  }}
                />
              </Block>
              <Block
                row
                style={{
                  width: '100%',
                  borderRadius: moderateScale(10),
                  borderColor: '#ffae3b',
                  borderWidth: 1,
                  backgroundColor: 'white',
                  height: moderateScale(45),
                  marginTop: moderateScale(10),
                }}>
                <SelectDropdown
                  data={ciRifValuesSelec}
                  onSelect={(val: string) => {
                    setciRiValues(val);
                  }}
                  buttonTextAfterSelection={selectedItem => {
                    return selectedItem;
                  }}
                  rowTextForSelection={item => {
                    return item;
                  }}
                  defaultButtonText={ciRiValues ? ciRiValues : 'V'}
                  defaultValue={ciRiValues ? ciRiValues : 'V'}
                  buttonStyle={styles.dropdownSelec}
                  rowStyle={{ backgroundColor: '#ffecd1' }}
                />
                <TextInput
                  // placeholder={`${ciRiValues} - Cedula de indentidad`}
                  placeholder={
                    ciRiValues === 'V'
                      ? 'V - Cedula de indentidad'
                      : ciRiValues === 'E'
                      ? 'E - Cedula de extranjeria'
                      : ciRiValues === 'J'
                      ? 'J - RIF'
                      : ciRiValues === 'P'
                      ? 'Pasaporte'
                      : 'Ingrese el tipo de documento'
                  }
                  placeholderTextColor={documentNumberFocus ? 'black' : 'gray'}
                  onPressIn={() => {
                    setDocumentNumberFocus(true);
                    setNameFocus(false);
                    setPhoneNumberFocus(false);
                    setFiscalAddressFocus(false);
                  }}
                  onChangeText={value => onChange(value, 'documentNumber')}
                  // editable={!isLoading}
                  autoCapitalize="none"
                  style={{
                    color: 'black',
                    paddingHorizontal: 20,
                    width: '85%',
                    borderTopLeftRadius: moderateScale(10),
                    borderBottomLeftRadius: moderateScale(10),
                  }}
                />
              </Block>
              {/* </Block> */}
              <Input
                placeholder="Número de Teléfono"
                placeholderTextColor={phoneNumberFocus ? 'black' : 'gray'}
                onPressIn={() => {
                  setPhoneNumberFocus(true);
                  setDocumentNumberFocus(false);
                  setNameFocus(false);
                  setFiscalAddressFocus(false);
                }}
                onChangeText={value => onChange(value, 'phoneNumber')}
                style={styles.inputField}
                color="black"
                type="phone-pad"
                // editable={!isLoading}
                autoCapitalize="none"
              />
              <Input
                placeholder="Dirección fiscal"
                placeholderTextColor={fiscalAddressFocus ? 'black' : 'gray'}
                onPressIn={() => {
                  setFiscalAddressFocus(true);
                  setNameFocus(false);
                  setDocumentNumberFocus(false);
                  setPhoneNumberFocus(false);
                }}
                onChangeText={value => onChange(value, 'fiscalAddress')}
                style={styles.inputField}
                color="black"
                // editable={!isLoading}
                autoCapitalize="none"
              />
              {showError && (
                <Block row middle style={{ display: showError ? 'flex' : 'none' }}>
                  <Text color="red" size={11}>
                    {errorString}
                  </Text>
                </Block>
              )}
              <Block style={{ borderBottomWidth: 1, borderColor: 'lightgray', width: width, marginTop: 20, marginBottom: 20 }} />
              <TouchableOpacity style={styles.bodyContentItem}>
                <Block style={{ paddingVertical: 10 }}>
                  <Block row style={{ marginLeft: 20, borderColor: 'white' }}>
                    <PaperClipIcon width={20} height={20} style={{ marginTop: moderateScale(3) }} />
                    <Text color="#ffae3b" bold style={styles.bodyContentItemText}>
                      Subir archivos
                    </Text>
                  </Block>
                </Block>
              </TouchableOpacity>
              <Button
                onPress={() => applyFinancing()}
                color="#ffae3b"
                loading={financingLoading}
                style={{ borderRadius: 10, justifyContent: 'center', alignSelf: 'center', marginTop: 20, width: width / 1.2 }}>
                <Text color="black" size={16} bold>
                  Aplicar
                </Text>
              </Button>
            </Block>
          </Block>
        </>,
      ],
    },
  ];

  return (
    <>
      <ScrollView style={styles.container}>
        <Block top style={{ padding: 20 }}>
          {user?.userMembership ? (
            <Block row style={{ marginTop: 10 }}>
              <Text color="gray" size={13} bold>
                Fecha de corte:
              </Text>
              <Text color="black" size={13} bold style={{ marginLeft: 5 }}>
                {/* {moment(user.membership!.expirationDate).format('DD/MM/YYYY')} */}
                {moment().format('DD/MM/YYYY')}
              </Text>
            </Block>
          ) : null}
        </Block>
        <Block middle style={{}}>
          <ImageBackground source={require('../../assets/memberhipCard.png')} style={styles.imageBackground}>
            <Block row>
              <Block style={{ paddingHorizontal: 20, paddingVertical: 10 }}>
                <Text color="white" size={26} style={{ fontWeight: '800', width: '50%' }}>
                  Membresía movy
                </Text>
                <Text color="white" size={12} style={{ textAlign: 'justify', width: '51%', marginTop: moderateScale(5) }}>
                  Canjea tus beneficios escanenado el código QR de tu nuestros aliados
                </Text>
              </Block>
              <CrownIcon style={{ position: 'absolute', top: moderateScale(20), right: moderateScale(10) }} />
            </Block>
            <Block style={{ position: 'relative', bottom: moderateScale(0) }}>
              <Button
                color="white"
                style={{
                  borderRadius: 20,
                  justifyContent: 'center',
                  alignSelf: 'center',
                  width: moderateScale(200),
                  height: moderateScale(40),
                }}>
                <Text color="#ffae3b" size={16} bold>
                  {user?.userMembership ? 'Renovar' : 'Comprar'}
                </Text>
              </Button>
            </Block>
          </ImageBackground>
        </Block>
        <Block top style={{ paddingHorizontal: 20, width: '100%' }}>
          <Text color="black" size={18} style={{ fontWeight: '600', marginTop: 20, paddingHorizontal: moderateScale(6) }}>
            Beneficios de la membresía
          </Text>
          <Text color="black" size={16} style={{ width: '90%', textAlign: 'justify', marginTop: 15, paddingHorizontal: moderateScale(5) }}>
            Toca alguno de los beneficios disponibles para poder canjearlo
          </Text>
        </Block>
        <Block top row style={{ paddingHorizontal: moderateScale(5), paddingVertical: moderateScale(20) }}>
          <Button onPress={() => setFinancingModal(true)} color="#fff3e1" style={{ width: 60, height: 60, borderRadius: 15, marginLeft: moderateScale(20) }}>
            <FinancingIcon width={30} height={30} />
          </Button>
          <Button color="#fff3e1" style={{ width: 60, height: 60, borderRadius: 15, marginLeft: moderateScale(50) }}>
            <DiscountIcon width={30} height={30} />
          </Button>
          <Button color="#fff3e1" style={{ width: 60, height: 60, borderRadius: 15, marginLeft: moderateScale(50) }}>
            <HairCutIcon width={30} height={30} />
          </Button>
        </Block>
        <Block top row style={{ paddingHorizontal: 6 }}>
          <Button color="#fff3e1" style={{ width: 60, height: 60, borderRadius: 15, marginLeft: moderateScale(20) }}>
            <TalkingIcon width={30} height={30} />
          </Button>
          <Button color="#fff3e1" style={{ width: 60, height: 60, borderRadius: 15, marginLeft: moderateScale(50) }}>
            <CarChargerIcon width={30} height={30} />
          </Button>
        </Block>
        <Modal visible={financingModal} nativeID="1" animationType="slide" transparent>
          <Block style={styles.modalContainer}>
            <Block style={styles.modalSubcontainer}>
              <Block bottom style={{ paddingHorizontal: 10, paddingBottom: 10, paddingTop: 20 }}>
                <TouchableOpacity
                  onPress={() => {
                    setFinancingModal(false);
                    setNameFocus(false);
                    setDocumentNumberFocus(false);
                    setPhoneNumberFocus(false);
                    setFiscalAddressFocus(false);
                    setShowError(false);
                  }}>
                  <ExitIcon color={'black'} width={20} height={20} />
                </TouchableOpacity>
              </Block>
              <SectionList
                scrollEventThrottle={0}
                bounces={false}
                stickyHeaderHiddenOnScroll
                sections={components}
                renderItem={({ item }) => item}
                keyExtractor={(_, index) => `FinancingSection-${index}`}
              />
            </Block>
          </Block>
        </Modal>
        <Block style={{ height: moderateScale(70) }} />
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: height,
    // paddingBottom: 20,
  },
  imageBackground: {
    width: moderateScale(width / 1.2),
    height: moderateScale(180),
    marginBottom: 10,
    // backgroundColor: 'red',
    borderRadius: Platform.OS === 'ios' ? 20 : 20,
    overflow: 'hidden',
  },
  walletBalance: {
    paddingTop: 35,
    paddingHorizontal: 20,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(1,1,1, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalSubcontainer: {
    position: 'absolute',
    height: height,
    backgroundColor: '#fff5e5',
    zIndex: 99,
    bottom: 0,
    borderTopRightRadius: 25,
    borderTopLeftRadius: 25,
    paddingVertical: 20,
  },
  financingIcon: {
    width: 60,
    height: 60,
    borderRadius: 15,
    marginLeft: moderateScale(0),
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  body: {
    marginTop: 50,
    paddingHorizontal: 20,

    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  form: {
    alignItems: 'center',
    marginTop: moderateScale(-40),
    width: '100%',
  },
  inputField: {
    height: moderateScale(45),
    borderColor: '#ffae3b',
    borderWidth: 1,
    borderRadius: 10,
  },
  inputFieldDocument: {
    height: moderateScale(45),
    borderColor: '#ffae3b',
    borderWidth: 1,
    borderRadius: 10,
    paddingLeft: moderateScale(60),
  },
  calendar: {
    color: 'red',
  },
  dropdownSelec: {
    width: '15%',
    height: moderateScale(43),
    backgroundColor: '#ffecd1',
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
  },
  bodyContentItem: {
    width: width / 1.2,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderColor: '#ffae3b',
    borderWidth: 1,
    borderRadius: 10,
    shadowOffset: {
      width: 10,
      height: 10,
    },
    shadowColor: '#ffae3b',
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  calendarButton: {
    width: '15%',
    height: moderateScale(43),
    backgroundColor: '#ffecd2',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderTopRightRadius: moderateScale(10),
    borderBottomRightRadius: moderateScale(10),
  },
  bodyContentItemText: {
    marginTop: moderateScale(3),
    fontSize: 16,
    marginLeft: 20,
  },
});

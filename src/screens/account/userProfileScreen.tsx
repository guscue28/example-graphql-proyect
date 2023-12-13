import React, { useContext, useRef } from 'react';
import { Image, StyleSheet, TouchableOpacity, Dimensions, FlatList, Modal, ScrollView, TextInput, SectionList, Platform, ImageBackground } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Block, Text, Button, Icon, Input } from 'galio-framework';
import { CreditCardInput } from 'react-native-credit-card-input-plus';
import { MyProfileParamList } from '../../navigators/Account/account.navigator';
import { AuthContext } from '../../services/auth/context/authContext';
import { CreditCardComponent } from '../../components/credit-cards/creditCardCard';
import { AirbnbRating } from 'react-native-ratings';
//Assets
import LogoutIcon from '../../assets/icons/feather/log-out.svg';
import FavoriteDriversIcon from '../../assets/icons/favoriteDrivers-yellow.svg';
import MyDirectionsIcon from '../../assets/icons/myDirections-yellow.svg';
import MyTravelsIcon from '../../assets/icons/viajes-yellow.svg';
import CrownIcon from '../../assets/icons/corona.svg';
import ExitIcon from '../../assets/icons/feather/exit.svg';
import ChevronDown from '../../assets/icons/feather/chevron-down.svg';
import BankData from '../../assets/VenezuelaBank/data.json';
// import ExitIcon from '../../assets/icons/feather/exit.svg';
// import { CreditCard } from '../../interfaces/user.interface';
import { CreditCardHolder, RechargeWalletInput } from '../../interfaces/payments.interface';
import { moderateScale } from 'react-native-size-matters';
import { UserRoles } from '../../services/user/user.interface';
import moment from 'moment';
import { MapContext } from '../../services/map/context/mapContext';
import { PaymentMethods } from '../../services/map/map.interface';
import { useForm } from '../../hooks/useForms';
import { getGraphqlError } from '../../helpers';
import SelectDropdown from 'react-native-select-dropdown';
import { GraphQLErrors, NormalError } from '../../interfaces/graphqlErrors.interface';

type UserProfileScreenProps = StackNavigationProp<MyProfileParamList>;
const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

export const UserProfileScreen = ({ route }: any) => {
  const navigation = useNavigation<UserProfileScreenProps>();
  const sectionListRef = useRef<SectionList<any>>(null);
  const { user, logOut, rechargeWallet } = useContext(AuthContext);
  const { cleanTravel, openPaymentMethod, paymentMethod } = useContext(MapContext);
  const [modalOpen, setModalOpen] = React.useState<boolean>(false);
  // const [paymentMethods, setPaymentMethods] = React.useState<boolean>(false);
  const [paymentSteph, setPaymentSteph] = React.useState<number>(0);
  const [sendPaymentLoading, setSendPaymentLoading] = React.useState<boolean>(false);
  const [myWallet, setMyWallet] = React.useState<boolean>(true);
  const [membership, setMembership] = React.useState<boolean>(false);
  const [selectPaymentModal, setSelectPaymentModal] = React.useState<boolean>(false);
  const [paymentMountModal, setPaymentMountModal] = React.useState<boolean>(false);
  const { form, onChange } = useForm({ mount: 0, countOwner: '', email: '', description: '', phoneNumber: 0 });
  const [formErrors, setFormErrors] = React.useState<GraphQLErrors[]>([]);
  const [submitErrors, setSubmitErrors] = React.useState<NormalError | null>();
  const [showError, setShowError] = React.useState<boolean>(false);
  const [errorString, setErrorString] = React.useState<string>('');
  const [movilExtensionsValues, setMovilExtensionsValues] = React.useState<string>('414');
  const [bankName, setBankName] = React.useState<string>('');

  // const [membershipEmpty, setMembershipEmpty] = React.useState<boolean>(true);
  const [creditCard, setCreditCard] = React.useState<CreditCardHolder>({
    number: '',
    billingDetails: {
      city: '',
      addressLine1: '',
      addressLine2: '',
      postalCode: '',
    },
    cardHolderName: '',
    cvc: '',
    expiry: '',
    brand: '',
    nameRef: '',
  });
  const creditCarRef = React.useRef<any>(null);

  const [testCard, setTestCard] = React.useState<CreditCardHolder[]>([
    {
      nameRef: 'Banesco Panama',
      cardHolderName: 'Gustavo E',
      cvc: '1234',
      brand: 'visa',
      expiry: '12/02',
      number: '1234',
    },
  ]);

  const banks = BankData;
  const movilExtensions = ['414', '424', '412', '416', '426'];

  const sendRechargeWallet = async () => {
    setSendPaymentLoading(true);
    try {
      const { mount, countOwner, email, description } = form;
      if (mount === 0 || countOwner === '' || description === '') {
        setShowError(true);
        setErrorString('Todos los campos son obligatorios');
        setSendPaymentLoading(false);
        return;
      }
      setShowError(false);
      setErrorString('');
      const data: RechargeWalletInput = {
        amount: Number(mount),
        email: email,
        paymentMethod: paymentMethod.selected,
        name: countOwner,
        reference: description,
      };
      await rechargeWallet(data);
      setPaymentSteph(0);
      setSendPaymentLoading(false);
      setPaymentMountModal(false);
      openPaymentMethod(false, route.name, '');
      sendReceiptData();
      onChange(0, 'mount');
      onChange('', 'countOwner');
      onChange('', 'description');
      onChange('', 'email');
      onChange(0, 'phoneNumber');
    } catch (error: GraphQLErrors[] | NormalError | any) {
      setShowError(true);
      if (Array.isArray(error)) {
        setFormErrors(error);
        setSubmitErrors(null);
      } else {
        setFormErrors([]);
        setSubmitErrors(error);
      }
      setSendPaymentLoading(false);
    }
  };

  const sendMovilPayment = async () => {
    setSendPaymentLoading(true);
    try {
      const numberReg = new RegExp('^[0-9]+$');
      if (bankName === '' || form.phoneNumber === 0 || movilExtensionsValues === '' || form.description === '') {
        setShowError(true);
        setSendPaymentLoading(false);
        setSendPaymentLoading(false);
        return setErrorString('Todos los campos son obligatorios');
      }
      if (numberReg.test(String(form.phoneNumber)) === false || String(form.phoneNumber).length < 7) {
        setShowError(true);
        setSendPaymentLoading(false);
        return setErrorString('Número de teléfono inválido');
      }
      setShowError(false);
      setErrorString('');
      setSendPaymentLoading(false);
      // onChange(0, 'mount');
      // onChange('', 'countOwner');
      // onChange('', 'description');
      // onChange('', 'email');
      // onChange(0, 'phoneNumber');
    } catch (error) {
      console.log(error);
      setSendPaymentLoading(false);
      getGraphqlError(error);
    }
  };

  const sendReceiptData = () => {
    const { mount, countOwner, email, description } = form;
    navigation.navigate('RechargeWalletReceipt', { mount, countOwner, email, description });
  };

  React.useEffect(() => {
    if (user?.roles?.includes(UserRoles.CLIENT)) {
      route.params && route.params.payment ? setSelectPaymentModal(true) : setSelectPaymentModal(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [route]);

  const components = [
    {
      data: [
        <>
          <Block style={styles.header}>
            <Block row space="between" style={{ marginTop: -10 }}>
              <TouchableOpacity
                onPress={() => {
                  cleanTravel();
                  logOut();
                }}>
                <LogoutIcon color={'gray'} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => navigation.navigate('UpdateProfileScreen')}>
                <Icon size={25} name="edit" family="Ionicons" color="grey" />
              </TouchableOpacity>
            </Block>
            <Block style={styles.headerContent}>
              <Block middle>
                <Image
                  source={{
                    uri: user?.picture ? user.picture : 'https://picsum.photos/200/200',
                  }}
                  style={styles.avatar}
                />
              </Block>
              <Block row middle>
                <Text color="black" size={20} bold>
                  {user?.firstName}
                </Text>
                <Text color="black" size={20} bold style={{ marginLeft: 10 }}>
                  {user?.lastName}
                </Text>
              </Block>
              <Block middle style={{ marginTop: 10 }}>
                <Text numberOfLines={1} size={16} color="gray">
                  {user?.email}
                </Text>
              </Block>
              {/* <Text style={styles.email}>{user?.email}</Text> */}
              <Block row style={{ marginBottom: 10, marginTop: 10 }}>
                <Text
                  size={16}
                  color="gray"
                  style={{
                    textAlign: 'center',
                    width: '50%',
                  }}>
                  {user?.phoneNumber ? user.phoneNumber : 'Ingrese su número de teléfono'}
                </Text>
                <Text
                  size={16}
                  color="gray"
                  style={{
                    textAlign: 'center',
                    width: '50%',
                    marginLeft: 10,
                  }}>
                  {user?.idNumber ? `${user.idNumberType} - ${user.idNumber}` : 'Ingrese su documento de identidad'}
                </Text>
              </Block>
              <Block>
                <AirbnbRating
                  count={5}
                  size={16}
                  showRating={false}
                  defaultRating={user?.ratingAverage}
                  isDisabled={true}
                  selectedColor="#ffae3b"
                  starContainerStyle={{
                    paddingHorizontal: 10,
                    paddingVertical: 5,
                  }}
                />
              </Block>
            </Block>
          </Block>
          <Block style={{ width: width, borderBottomWidth: 1, borderBottomColor: 'lightgray', marginBottom: 10 }} />
        </>,
      ],
    },
    {
      data: [
        <>
          <Block middle style={styles.body}>
            <Block style={styles.bodyContent}>
              {user && user.roles!.some((rol: UserRoles) => rol === 'DRIVER') ? null : (
                <TouchableOpacity onPress={() => navigation.navigate('ViewFavoritesRidersScreen')} style={[styles.bodyContentItem, { marginBottom: 15 }]}>
                  <Block style={{ paddingVertical: 10 }}>
                    <Block row style={{ marginLeft: 20 }}>
                      <FavoriteDriversIcon width={25} height={25} />
                      <Text color="#ffae3b" bold style={styles.bodyContentItemText}>
                        Conductores favoritos
                      </Text>
                    </Block>
                  </Block>
                </TouchableOpacity>
              )}

              <TouchableOpacity onPress={() => navigation.navigate('ViewJourniesScreen')} style={styles.bodyContentItem}>
                <Block style={{ paddingVertical: 10 }}>
                  <Block row style={{ marginLeft: 20, borderColor: 'white' }}>
                    <MyTravelsIcon width={25} height={25} />
                    <Text color="#ffae3b" bold style={styles.bodyContentItemText}>
                      Mis viajes
                    </Text>
                  </Block>
                </Block>
              </TouchableOpacity>

              {user && user.roles!.some((rol: UserRoles) => rol === 'CLIENT') ? (
                <TouchableOpacity onPress={() => navigation.navigate('ViewMyLocationsScreen')} style={[styles.bodyContentItem, { marginTop: 15 }]}>
                  <Block style={{ paddingVertical: 10 }}>
                    <Block row style={{ marginLeft: 20 }}>
                      <MyDirectionsIcon width={25} height={25} />
                      <Text color="#ffae3b" bold style={styles.bodyContentItemText}>
                        Direcciones guardadas
                      </Text>
                    </Block>
                  </Block>
                </TouchableOpacity>
              ) : null}

              <TouchableOpacity onPress={() => navigation.navigate('TermsAndConditionsScreen')} style={[styles.bodyContentItem, { marginTop: 15 }]}>
                <Block style={{ paddingVertical: 10 }}>
                  <Block row style={{ marginLeft: 20, borderColor: 'white' }}>
                    {/* <MyTravelsIcon width={25} height={25} /> */}
                    <Icon family="Entypo" name="info" color="#ffae3b" size={25} />
                    <Text color="#ffae3b" bold style={styles.bodyContentItemText}>
                      Términos y condiciones
                    </Text>
                  </Block>
                </Block>
              </TouchableOpacity>
            </Block>
          </Block>
        </>,
      ],
    },
    {
      data: [
        <>
          <Block middle>
            <ScrollView horizontal style={{ marginHorizontal: 20 }}>
              <TouchableOpacity
                onPress={() => {
                  sectionListRef.current?.scrollToLocation({
                    animated: true,
                    sectionIndex: components.length - 1,
                    itemIndex: 0,
                  });
                  setMyWallet(true);
                  // setPaymentMethods(false);
                  setMembership(false);
                }}>
                <Text color={myWallet ? '#222222' : 'lightgray'} size={16} bold style={styles.listPaymentMethods}>
                  Mi wallet
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  sectionListRef.current?.scrollToLocation({
                    animated: true,
                    sectionIndex: components.length - 1,
                    itemIndex: 0,
                  });
                  setMembership(true);
                  // setPaymentMethods(false);
                  setMyWallet(false);
                }}>
                <Text color={membership ? '#222222' : 'lightgray'} size={16} bold style={styles.listPaymentMethods}>
                  Membresia
                </Text>
              </TouchableOpacity>

              {/* <TouchableOpacity
              onPress={() => {
                sectionListRef.current?.scrollToLocation({
                  animated: true,
                  sectionIndex: components.length - 1,
                  itemIndex: 0,
                });
                setPaymentMethods(true);
                setMyWallet(false);
                setMembership(false);
              }}>
              <Text color={paymentMethods ? '#222222' : 'lightgray'} size={16} bold style={styles.listPaymentMethods}>
                Otros métodos de Pago
              </Text>
            </TouchableOpacity> */}
            </ScrollView>
          </Block>

          <Block style={{ alignSelf: 'center', paddingBottom: 25 }}>
            {myWallet ? (
              <TouchableOpacity onPress={() => navigation.navigate('MyWalletScreen')}>
                <ImageBackground source={require('../../assets/walletCard.png')} resizeMode="cover" style={styles.imageBackground}>
                  <Block style={styles.walletBalance}>
                    <Text size={30} bold color="#ffae3b">
                      ${user?.wallet?.balance.toFixed(2)}
                    </Text>
                    <Text color="white" size={10} style={styles.walletText}>
                      Paga los viajes con tu wallet
                    </Text>
                    <Text color="white" size={10}>
                      de forma rápida y segura
                    </Text>
                  </Block>
                  <Block style={styles.walletButton}>
                    <Button
                      onPress={() => {
                        setSelectPaymentModal(true);
                      }}
                      color="#ffae3b"
                      style={styles.walletRechargeButton}>
                      <Text color="white" size={16} bold>
                        Recargar
                      </Text>
                    </Button>
                  </Block>
                </ImageBackground>
              </TouchableOpacity>
            ) : null}
            {membership ? (
              user?.userMembership ? (
                <Block>
                  <ImageBackground source={require('../../assets/memberhipCard.png')} style={styles.imageBackground}>
                    <Block row>
                      <Block style={{ paddingHorizontal: 20, paddingVertical: 10 }}>
                        <Text color="white" size={26} style={{ fontWeight: '800', width: '50%' }}>
                          Tu membresía
                        </Text>
                        <Text color="white" size={12} style={{ textAlign: 'justify', width: '51%', marginTop: moderateScale(10) }}>
                          Canjea tus beneficios escanenado el código QR de tu nuestros aliados
                        </Text>
                      </Block>
                      <CrownIcon style={{ position: 'absolute', top: moderateScale(20), right: moderateScale(10) }} />
                    </Block>
                    <Block style={{ paddingHorizontal: 20 }}>
                      <Text color="white" size={13} style={{ marginTop: 10 }}>
                        Tu membresía vence:
                      </Text>
                      <Text color="black" size={13} bold style={{ marginTop: 5 }}>
                        {moment().format('DD/MM/YYYY')}
                      </Text>
                    </Block>
                    {/* {moment(user.membership!.expirationDate).format('DD/MM/YYYY')} */}
                    <Block style={{ position: 'absolute', bottom: moderateScale(10), right: moderateScale(10) }}>
                      <Button
                        onPress={() => navigation.navigate('MembershipScreen')}
                        color="white"
                        style={{
                          borderRadius: 20,
                          justifyContent: 'center',
                          alignSelf: 'center',
                          marginTop: 20,
                          width: moderateScale(120),
                          height: moderateScale(40),
                        }}>
                        <Text color="#ffae3b" size={16} bold>
                          Canjear
                        </Text>
                      </Button>
                    </Block>
                  </ImageBackground>
                </Block>
              ) : (
                <Block style={{ marginBottom: 30, width: '70%', padding: 20 }}>
                  <Text size={15} color="gray" style={{ textAlign: 'center' }}>
                    Usted no posee una membresia activa ¿Desea obtener una?
                  </Text>
                  <Button
                    onPress={() => navigation.navigate('MembershipScreen')}
                    color="#ffae3b"
                    style={{ borderRadius: 20, justifyContent: 'center', alignSelf: 'center', marginTop: 20 }}>
                    <Text color="white" size={16} bold>
                      Obtener
                    </Text>
                  </Button>
                </Block>
              )
            ) : null}
            {/* {paymentMethods ? (
              <FlatList
                data={testCard}
                scrollEnabled={false}
                nestedScrollEnabled
                renderItem={({ item }) => <CreditCardComponent item={item} mapScreen={false} />}
                ListEmptyComponent={() => (
                  <Block style={styles.emptyContainer}>
                    <Text color="gray" size={16} style={styles.emptyText}>
                      Agregue su tarjeta de credito
                    </Text>
                  </Block>
                )}
                ListFooterComponent={() => (
                  <Block style={{ paddingHorizontal: 20, marginBottom: 40 }}>
                    <TouchableOpacity onPress={() => setModalOpen(true)} style={styles.btnAddContainer}>
                      <Text size={20} color="black">
                        +
                      </Text>
                    </TouchableOpacity>
                  </Block>
                )}
              />
            ) : null} */}
          </Block>
        </>,
      ],
    },
  ];
  return (
    <>
      <SectionList
        ref={sectionListRef}
        scrollEventThrottle={0}
        bounces={false}
        stickyHeaderHiddenOnScroll
        style={[styles.container]}
        sections={components}
        renderItem={({ item }) => item}
        keyExtractor={(_, index) => `ProfileSection-${index}`}
      />
      <Modal animationType="slide" nativeID="1" transparent visible={modalOpen}>
        <Block style={styles.modalContainer}>
          <Block style={styles.modalSubcontainer}>
            <ScrollView>
              <Block style={styles.containerInputs}>
                <CreditCardInput
                  autoFocus={true}
                  placeholders={{
                    number: '',
                    expiry: '',
                    cvc: '',
                    postalCode: '',
                    name: '',
                  }}
                  ref={creditCarRef}
                  onChange={(val: any) => {
                    setCreditCard({
                      ...creditCard,
                      number: val.values.number,
                      expiry: val.values.expiry,
                      cvc: val.values.cvc,
                      cardHolderName: val.values.name,
                      brand: val.values.type,
                    });
                  }}
                  cardScale={0}
                  allowScroll={true}
                  horizontalScroll={false}
                  requiresName
                  requiresCVC
                  // cardImageFront={require('../../../assets/Tarjeta-Frontal.png')}
                  // cardImageBack={require('../../../assets/Tarjeta-Reverso.png')}
                  labels={{
                    name: 'Nombre del Titular',
                    number: 'Número',
                    expiry: 'Fecha de Vencimiento',
                    cvc: 'Número de Seguridad',
                  }}
                  // cardFontFamily="Montserrat-Bold"
                  labelStyle={{
                    color: 'gray',
                    // fontFamily: 'Montserrat-Bold',
                    marginTop: 20,
                    width: 200,
                  }}
                  inputContainerStyle={{
                    borderBottomColor: 'transparent',
                  }}
                  inputStyle={styles.textInput}
                />
                <Block style={{ paddingHorizontal: moderateScale(20), width: '100%' }}>
                  <Text size={14} bold color="gray" style={styles.modalTitleText}>
                    Nombre de referencia
                  </Text>
                  <TextInput
                    placeholderTextColor="lightgray"
                    keyboardType="default"
                    textContentType="name"
                    style={styles.textName}
                    value={creditCard.nameRef}
                    onChangeText={(val: string) => {
                      setCreditCard({ ...creditCard, nameRef: val });
                      // console.log('creditCarRef', creditCarRef.current);
                    }}
                    autoCapitalize="none"
                  />
                </Block>
              </Block>
              <Block row right style={styles.btnSectionContainer}>
                <TouchableOpacity
                  style={styles.btnContainer}
                  onPress={() => {
                    setModalOpen(false);
                    setPaymentMountModal(true);
                    setCreditCard({
                      number: '',
                      billingDetails: {
                        city: '',
                        addressLine1: '',
                        addressLine2: '',
                        postalCode: '',
                      },
                      cardHolderName: '',
                      cvc: '',
                      expiry: '',
                      nameRef: '',
                      brand: '',
                    });
                  }}>
                  <Text color="gray" style={styles.btnText}>
                    Cancelar
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.btnContainer}
                  // disabled={isValidFiscal()}
                  onPress={async () => {
                    // await saveCreditCard();
                    creditCard.number = creditCard.number.slice(creditCard.number.length - 4);
                    testCard.push(creditCard);
                    setTestCard(testCard);
                    setModalOpen(false);
                    setPaymentMountModal(true);
                    setCreditCard({
                      number: '',
                      billingDetails: {
                        city: '',
                        addressLine1: '',
                        addressLine2: '',
                        postalCode: '',
                      },
                      cardHolderName: '',
                      cvc: '',
                      expiry: '',
                      brand: '',
                      nameRef: '',
                    });
                  }}>
                  <Text color="black" bold style={styles.btnText}>
                    Aceptar
                  </Text>
                </TouchableOpacity>
              </Block>
            </ScrollView>
          </Block>
        </Block>
      </Modal>

      <Modal animationType="slide" nativeID="1" transparent visible={selectPaymentModal}>
        <Block style={styles.selectPaymentMethodModal}>
          <Block style={styles.selectPaymentMethodModalContainer}>
            <Block bottom style={{ marginBottom: 20 }}>
              <TouchableOpacity
                onPress={async () => {
                  setSelectPaymentModal(false);
                }}>
                <ExitIcon color="black" />
              </TouchableOpacity>
            </Block>
            <Block top style={{ paddingRight: moderateScale(50), marginBottom: 10 }}>
              <Text p color="black" bold>
                Elige el método de pago para recargar tu wallet
              </Text>
            </Block>
            <Block>
              <TouchableOpacity
                onPress={() => {
                  setPaymentSteph(1);
                  openPaymentMethod(true, route.name, 'ZELLE');
                  setSelectPaymentModal(false);
                }}
                style={{ width: '100%', marginVertical: 10 }}>
                <Block top row space="between">
                  <Image
                    source={require('../../assets/paymentMethods/zelle.png')}
                    resizeMethod="auto"
                    style={{ width: moderateScale(35), height: moderateScale(35) }}
                  />
                  <Text size={18} color="black" style={{ marginLeft: moderateScale(10), marginTop: moderateScale(5) }}>
                    Zelle
                  </Text>
                </Block>
              </TouchableOpacity>
            </Block>
            {/* <Block>
              <TouchableOpacity
                onPress={() => {
                  // setPaymentSteph(1);
                  setPaymentMountModal(true);
                  openPaymentMethod(true, route.name, 'CREDIT_CARD');
                  setSelectPaymentModal(false);
                }}
                style={{ width: '100%', marginVertical: 10 }}>
                <Block top row space="between">
                  <Image
                    source={require('../../assets/paymentMethods/credit_Card_Icon.png')}
                    resizeMode="contain"
                    style={{ width: moderateScale(30), height: moderateScale(30), marginLeft: moderateScale(3) }}
                  />
                  <Text size={18} color="black" style={{ marginLeft: moderateScale(10), marginTop: moderateScale(3) }}>
                    Credit Card
                  </Text>
                </Block>
              </TouchableOpacity>
            </Block> */}
            <Block>
              <TouchableOpacity
                onPress={() => {
                  // setPaymentSteph(1);
                  setPaymentMountModal(true);
                  openPaymentMethod(true, route.name, 'MOVILE_PAY');
                  setSelectPaymentModal(false);
                }}
                style={{ width: '100%', marginVertical: 10 }}>
                <Block top row space="between">
                  <Image
                    source={require('../../assets/paymentMethods/pago_Movil_Icon.png')}
                    resizeMode="contain"
                    style={{ width: moderateScale(35), height: moderateScale(35) }}
                  />
                  <Text size={18} color="black" style={{ marginLeft: moderateScale(10), marginTop: moderateScale(5) }}>
                    Pago Movil
                  </Text>
                </Block>
              </TouchableOpacity>
            </Block>
            {/* <Block>
              <TouchableOpacity
                onPress={() => {
                  // setPaymentSteph(1);
                  setPaymentMountModal(true);
                  openPaymentMethod(true, route.name, 'PAYPAL');
                  setSelectPaymentModal(false);
                }}
                style={{ width: '100%', marginVertical: 10 }}>
                <Block top row space="between">
                  <Image
                    source={require('../../assets/paymentMethods/paypal_Icon.png')}
                    resizeMethod="auto"
                    style={{ width: moderateScale(35), height: moderateScale(35) }}
                  />
                  <Text size={18} color="black" style={{ marginLeft: moderateScale(10), marginTop: moderateScale(5) }}>
                    Paypal
                  </Text>
                </Block>
              </TouchableOpacity>
            </Block> */}
          </Block>
        </Block>
      </Modal>

      <Modal animationType="slide" nativeID="1" transparent visible={paymentMountModal && paymentSteph === 0}>
        <Block style={styles.modalContainer}>
          <Block style={styles.modalSubcontainer}>
            <Block bottom style={{ marginBottom: 5 }}>
              <TouchableOpacity
                onPress={async () => {
                  setPaymentMountModal(false);
                  openPaymentMethod(false, route.name, '');
                  onChange(0, 'mount');
                  setSelectPaymentModal(true);
                }}>
                <ExitIcon color="black" />
              </TouchableOpacity>
            </Block>
            {paymentMethod.selected === PaymentMethods.PAYPAL && (
              <Block middle>
                <Image
                  source={require('../../assets/paymentMethods/paypal_logo.png')}
                  resizeMode="contain"
                  style={{ width: moderateScale(150), height: moderateScale(75), marginTop: moderateScale(-20), marginBottom: moderateScale(10) }}
                />
              </Block>
            )}
            {paymentMethod.selected === PaymentMethods.CREDIT_CARD && (
              <Block middle row style={{ marginTop: moderateScale(-10), marginBottom: moderateScale(20) }}>
                <Image
                  source={require('../../assets/paymentMethods/visa_logo.png')}
                  resizeMode="contain"
                  style={{ width: moderateScale(80), height: moderateScale(40) }}
                />
                <Block style={styles.between} />
                <Image
                  source={require('../../assets/paymentMethods/mastercard_no_letters_logo.png')}
                  resizeMode="contain"
                  style={{ width: moderateScale(60), height: moderateScale(30) }}
                />
              </Block>
            )}
            {paymentMethod.selected === PaymentMethods.PAYPAL ||
              (paymentMethod.selected === PaymentMethods.MOVILE_PAY && (
                <Block style={{ paddingHorizontal: moderateScale(50), marginBottom: 10 }}>
                  <Text color="black" style={styles.textAlignment}>
                    Ingrese el monto en Dólares que desea recargar en su wallet
                  </Text>
                </Block>
              ))}
            {paymentMethod.selected === PaymentMethods.CREDIT_CARD && (
              <Block style={{ paddingHorizontal: moderateScale(50), marginBottom: 10 }}>
                <Text color="black" style={styles.textAlignment}>
                  Ingrese el monto a recargar y seleccione la tarjeta con la que desea pagar o añada una
                </Text>
              </Block>
            )}
            <Block style={{ width: '100%', paddingHorizontal: 15 }}>
              <Input
                placeholder="Monto a recargar"
                placeholderTextColor="black"
                onChangeText={value => {
                  onChange(value, 'mount');
                }}
                type="numeric"
                style={styles.inputField}
                color="black"
                // editable={!isLoading}
                autoCapitalize="none"
              />
            </Block>
            {showError && (
              <Block row middle style={{ display: showError ? 'flex' : 'none' }}>
                <Text color="red" size={11}>
                  {errorString}
                </Text>
              </Block>
            )}
            {paymentMethod.selected === PaymentMethods.CREDIT_CARD && (
              <Block>
                <FlatList
                  data={testCard}
                  scrollEnabled={false}
                  nestedScrollEnabled
                  renderItem={({ item }) => <CreditCardComponent item={item} mapScreen={true} />}
                  ListEmptyComponent={() => (
                    <Block style={styles.emptyContainer}>
                      <Text color="gray" size={16} style={styles.emptyText}>
                        Agregue su tarjeta de credito
                      </Text>
                    </Block>
                  )}
                  ListFooterComponent={() => (
                    <Block top style={{ paddingHorizontal: 20 }}>
                      <TouchableOpacity
                        onPress={() => {
                          setPaymentMountModal(false);
                          setModalOpen(true);
                        }}
                        style={styles.btnAddContainer}>
                        <Text size={16} color="#ffae3b" bold>
                          + Añadir nueva
                        </Text>
                      </TouchableOpacity>
                    </Block>
                  )}
                />
              </Block>
            )}
            <Block middle style={{ paddingHorizontal: moderateScale(100), marginBottom: 10 }}>
              <Button
                onPress={() => {
                  if (form.mount === 0) {
                    setShowError(true);
                    setSendPaymentLoading(false);
                    return setErrorString('Porfavor indique el monto a recargar');
                  }
                  if (paymentMethod.selected === PaymentMethods.PAYPAL || paymentMethod.selected === PaymentMethods.CREDIT_CARD) {
                    setPaymentMountModal(false);
                    openPaymentMethod(false, route.name, '');
                    onChange(0, 'mount');
                    setPaymentSteph(0);
                    setSelectPaymentModal(true);
                    return;
                  }
                  setShowError(false);
                  setErrorString('');
                  setPaymentSteph(1);
                }}
                color="#ffae3b"
                style={{ borderRadius: 10, justifyContent: 'center', alignSelf: 'center', marginTop: 10, width: width / 1.3 }}>
                {paymentMethod.selected === PaymentMethods.PAYPAL ? (
                  <Block row middle>
                    <Text color="black" size={18} bold>
                      Pagar con
                    </Text>
                    <Image
                      source={require('../../assets/paymentMethods/paypal_short.png')}
                      resizeMode="contain"
                      style={{ width: moderateScale(100), height: moderateScale(50), marginLeft: moderateScale(10) }}
                    />
                  </Block>
                ) : (
                  <Text color="black" size={16} bold>
                    Continuar
                  </Text>
                )}
              </Button>
            </Block>
          </Block>
        </Block>
      </Modal>

      <Modal animationType="slide" nativeID="1" transparent visible={paymentMethod.modal && paymentMethod.view === route.name && paymentSteph === 1}>
        <Block style={styles.modalContainer}>
          <Block style={styles.modalSubcontainer}>
            <Block bottom>
              <TouchableOpacity
                onPress={async () => {
                  if (paymentMethod.selected === PaymentMethods.ZELLE) {
                    setPaymentSteph(0);
                    openPaymentMethod(false, route.name, '');
                    setSelectPaymentModal(true);
                  } else {
                    setPaymentSteph(0);
                    onChange(0, 'mount');
                  }
                }}>
                <ExitIcon color="black" />
              </TouchableOpacity>
            </Block>
            {paymentMethod.selected === PaymentMethods.ZELLE && (
              <Block middle style={{ paddingHorizontal: moderateScale(40), marginBottom: 10 }}>
                <Image
                  source={require('../../assets/paymentMethods/big_zelle_logo.png')}
                  resizeMode="contain"
                  style={{ width: moderateScale(100), height: moderateScale(50), marginBottom: moderateScale(20) }}
                />
                <Text color="black" style={styles.textAlignment}>
                  Por favor, realice una transferencia por Zelle al siguiente correo:
                </Text>
                <Text color="black" bold>
                  movypagodirecto@gmail.com
                </Text>
                <Text color="black" style={styles.textAlignment}>
                  con el monto que desea recargar en su wallet y luego toque el botón de continuar para verificar su transferencia.
                </Text>
                <Block middle style={{ paddingHorizontal: moderateScale(100), marginBottom: 10 }}>
                  <Button
                    onPress={() => setPaymentSteph(2)}
                    color="#ffae3b"
                    style={{ borderRadius: 10, justifyContent: 'center', alignSelf: 'center', marginTop: 20, width: width / 1.3 }}>
                    <Text color="black" size={16} bold>
                      Continuar
                    </Text>
                  </Button>
                </Block>
              </Block>
            )}
            {paymentMethod.selected === PaymentMethods.CREDIT_CARD && (
              <Block middle>
                <Text>Credit</Text>
              </Block>
            )}
            {paymentMethod.selected === PaymentMethods.MOVILE_PAY && (
              <Block middle style={{ paddingHorizontal: moderateScale(30), marginBottom: 10 }}>
                <Image
                  source={require('../../assets/paymentMethods/bancamiga_logo.png')}
                  resizeMode="contain"
                  style={{ width: moderateScale(200), height: moderateScale(100), marginTop: moderateScale(-20) }}
                />
                <Text color="black" style={[styles.textAlignment, { marginTop: moderateScale(-10) }]}>
                  Realice un pago móvil de <Text bold>Bs. {form.mount * 6}</Text> con los siguientes datos y presione el botón de continuar para verificar su
                  pago.
                </Text>
                <Text color="black" style={{ textAlign: 'justify', marginTop: moderateScale(10) }}>
                  N˚ de <Text bold>Teléfono: 0424- 233.44.80</Text>
                </Text>
                <Block top style={{ paddingHorizontal: moderateScale(18) }}>
                  <Text color="black" style={{ textAlign: 'justify', marginTop: moderateScale(10) }}>
                    ID: <Text bold>J - 2387894489</Text>
                  </Text>
                </Block>
                <Block top style={{ paddingHorizontal: moderateScale(18) }}>
                  <Text color="black" style={{ textAlign: 'justify', marginTop: moderateScale(10) }}>
                    Banco: <Text bold>Bancamiga</Text>
                  </Text>
                </Block>
                <Block middle style={{ paddingHorizontal: moderateScale(100), marginBottom: 10 }}>
                  <Button
                    onPress={() => setPaymentSteph(2)}
                    color="#ffae3b"
                    style={{ borderRadius: 10, justifyContent: 'center', alignSelf: 'center', marginTop: 20, width: width / 1.5 }}>
                    <Text color="black" size={16} bold>
                      Continuar
                    </Text>
                  </Button>
                </Block>
              </Block>
            )}
            {paymentMethod.selected === PaymentMethods.PAYPAL && (
              <Block middle>
                <Text>Paypal</Text>
              </Block>
            )}
          </Block>
        </Block>
      </Modal>

      <Modal animationType="slide" nativeID="1" transparent visible={paymentSteph === 2}>
        <Block style={styles.modalContainer}>
          <Block style={styles.modalSubcontainer}>
            <Block bottom>
              <TouchableOpacity
                onPress={async () => {
                  setPaymentSteph(1);
                }}>
                <ExitIcon color="black" />
              </TouchableOpacity>
            </Block>
            {paymentMethod.selected === PaymentMethods.ZELLE && (
              <Block middle>
                <Image
                  source={require('../../assets/paymentMethods/big_zelle_logo.png')}
                  resizeMode="contain"
                  style={{ width: moderateScale(90), height: moderateScale(45), marginBottom: moderateScale(20) }}
                />
                <Block style={{ paddingHorizontal: moderateScale(60), marginBottom: 10 }}>
                  <Text color="black" style={styles.textAlignment}>
                    Complete los datos para verificar su recarga.
                  </Text>
                </Block>
                <Block style={{ width: '100%', paddingHorizontal: 15 }}>
                  <Input
                    placeholder="Monto a recargar"
                    placeholderTextColor="black"
                    onChangeText={value => {
                      onChange(value, 'mount');
                    }}
                    type="numeric"
                    style={styles.inputField}
                    color="black"
                    // editable={!isLoading}
                    autoCapitalize="none"
                  />
                  <Input
                    placeholder="Titular de la cuenta"
                    placeholderTextColor="black"
                    onChangeText={value => {
                      onChange(value, 'countOwner');
                    }}
                    style={styles.inputField}
                    color="black"
                    // editable={!isLoading}
                    autoCapitalize="none"
                  />
                  <Input
                    placeholder="Correo"
                    placeholderTextColor="black"
                    onChangeText={value => {
                      onChange(value, 'email');
                    }}
                    style={styles.inputField}
                    color="black"
                    // editable={!isLoading}
                    autoCapitalize="none"
                  />
                  {formErrors
                    .find(e => e.property === 'email')
                    ?.errors.map((error, index) => (
                      <Block row middle style={{ display: showError ? 'flex' : 'none' }}>
                        <Text key={index} color="red" size={11}>
                          * {error.slice(0, 1).toUpperCase() + error.slice(1, error.length)}
                        </Text>
                      </Block>
                    ))}
                  <Input
                    placeholder="Descripción"
                    placeholderTextColor="black"
                    onChangeText={value => {
                      onChange(value, 'description');
                    }}
                    style={styles.inputField}
                    color="black"
                    // editable={!isLoading}
                    autoCapitalize="none"
                  />
                </Block>
                {submitErrors && (
                  <Block row middle style={{ display: showError ? 'flex' : 'none' }}>
                    <Text color="red" size={11}>
                      {submitErrors.error}
                    </Text>
                  </Block>
                )}
                {showError && (
                  <Block row middle style={{ display: showError ? 'flex' : 'none' }}>
                    <Text color="red" size={11}>
                      {errorString}
                    </Text>
                  </Block>
                )}
                <Block middle style={{ paddingHorizontal: moderateScale(100), marginBottom: 10 }}>
                  <Button
                    onPress={() => {
                      sendRechargeWallet();
                    }}
                    color="#ffae3b"
                    disabled={sendPaymentLoading}
                    loading={sendPaymentLoading}
                    style={{ borderRadius: 10, justifyContent: 'center', alignSelf: 'center', marginTop: 20, width: width / 1.3 }}>
                    <Text color="black" size={16} bold>
                      Verificar
                    </Text>
                  </Button>
                </Block>
              </Block>
            )}
            {paymentMethod.selected === PaymentMethods.MOVILE_PAY && (
              <Block middle>
                <Image
                  source={require('../../assets/paymentMethods/bancamiga_logo.png')}
                  resizeMode="contain"
                  style={{ width: moderateScale(170), height: moderateScale(85), marginTop: moderateScale(-20) }}
                />
                <Block style={{ paddingHorizontal: moderateScale(60), marginBottom: 10, marginTop: moderateScale(-10) }}>
                  <Text color="black" style={styles.textAlignment}>
                    Complete los datos para verificar su recarga
                  </Text>
                </Block>
                <Block style={{ width: '100%', paddingHorizontal: 15 }}>
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
                      data={movilExtensions}
                      onSelect={(val: string) => {
                        setMovilExtensionsValues(val);
                      }}
                      buttonTextAfterSelection={(selectedItem: any) => {
                        return selectedItem;
                      }}
                      rowTextForSelection={(item: any) => {
                        return item;
                      }}
                      defaultButtonText={movilExtensionsValues}
                      defaultValue={movilExtensionsValues}
                      buttonStyle={styles.dropdownSelec}
                      rowStyle={{ backgroundColor: '#ffecd1' }}
                      renderDropdownIcon={() => <ChevronDown color={'#edb76d'} width={20} height={20} />}
                    />
                    <TextInput
                      placeholder="Número de Teléfono"
                      placeholderTextColor="black"
                      onChangeText={value => onChange(value, 'phoneNumber')}
                      keyboardType="numeric"
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
                  <Block
                    style={{
                      width: '100%',
                      borderRadius: moderateScale(10),
                      borderColor: '#ffae3b',
                      borderWidth: 1,
                      backgroundColor: 'white',
                      height: moderateScale(45),
                      marginTop: moderateScale(20),
                    }}>
                    <SelectDropdown
                      data={banks}
                      onSelect={(val: any) => {
                        setBankName(val.nombre);
                      }}
                      buttonTextAfterSelection={(selectedItem: any) => {
                        // console.log(selectedItem.codigo);

                        return selectedItem.nombre;
                      }}
                      rowTextForSelection={(item: any) => {
                        return item.nombre;
                      }}
                      defaultButtonText="Seleccione su banco"
                      // defaultValue={banks.name}
                      buttonStyle={styles.selecBanksDropDown}
                      rowStyle={{ backgroundColor: '#ffecd1' }}
                      renderDropdownIcon={() => <ChevronDown color={'#edb76d'} width={20} height={20} />}
                    />
                  </Block>
                  <Block style={{ marginTop: 10 }}>
                    <Input
                      placeholder="Últimos 4 dígitos del recibo"
                      placeholderTextColor="black"
                      onChangeText={value => {
                        onChange(value, 'description');
                      }}
                      style={styles.inputField}
                      color="black"
                      // editable={!isLoading}
                      autoCapitalize="none"
                    />
                  </Block>
                  {showError && (
                    <Block row middle style={{ display: showError ? 'flex' : 'none' }}>
                      <Text color="red" size={11}>
                        {errorString}
                      </Text>
                    </Block>
                  )}
                  <Block middle style={{ paddingHorizontal: moderateScale(100), marginBottom: 10 }}>
                    <Button
                      onPress={() => sendMovilPayment()}
                      color="#ffae3b"
                      disabled={sendPaymentLoading}
                      loading={sendPaymentLoading}
                      style={{ borderRadius: 10, justifyContent: 'center', alignSelf: 'center', marginTop: 10, width: width / 1.3 }}>
                      <Text color="black" size={16} bold>
                        Verificar
                      </Text>
                    </Button>
                  </Block>
                </Block>
              </Block>
            )}
          </Block>
        </Block>
      </Modal>
    </>
    // <ScrollView nestedScrollEnabled style={styles.container}>

    //   <Block style={{ width: width, borderBottomWidth: 1, borderBottomColor: 'lightgray' }} />

    //   <Block style={{ width: width, borderBottomWidth: 1, borderBottomColor: 'lightgray', marginBottom: 10 }} />

    // </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    height: height,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 5,
    backgroundColor: '#fff',
  },
  headerContent: {
    marginBottom: 5,
  },
  avatar: {
    width: 130,
    height: 130,
    borderRadius: 20,
    borderWidth: 4,
    marginBottom: 10,
  },
  body: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#fff',
  },
  bodyContent: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  bodyContentItem: {
    width: width / 1.2,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
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
  bodyContentItemText: {
    fontSize: 18,
    marginLeft: 20,
  },
  btnAddContainer: {
    justifyContent: 'center',
    alignSelf: 'flex-end',
    paddingVertical: 10,
  },
  emptyContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    textAlign: 'center',
    marginBottom: 20,
    paddingHorizontal: 20,
    paddingVertical: 20,
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
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 20,
    marginTop: moderateScale(20),
  },
  iconItemHeaderModal: {
    paddingVertical: 15,
    paddingHorizontal: 15,
    tintColor: 'black',
    // marginTop: moderateScale(-90),
  },
  btnHeaderContainer: {
    justifyContent: 'center',
    alignSelf: 'flex-end',
    borderColor: 'transparent',
    alignItems: 'center',
    width: 40,
    height: 40,
    position: 'absolute',
    top: 0,
    right: 0,
  },
  containerInputs: {
    paddingHorizontal: moderateScale(10),
    marginTop: moderateScale(10),
  },
  modalTitle: {
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: 10,
    // fontFamily: 'Montserrat-Bold',
  },
  modalTitleText: {
    // fontFamily: 'Montserrat-Bold',
    // fontSize: 14,
    marginTop: 10,
    marginLeft: 12,
  },
  textInput: {
    borderBottomWidth: 1,
    borderBottomColor: 'lightgray',
    // fontFamily: 'Montserrat-Regular',
    height: 35,
    width: moderateScale(300),
    color: 'grey',
    marginTop: 10,
    paddingVertical: 5,
    fontSize: 20,
  },
  textName: {
    borderBottomWidth: 1,
    borderBottomColor: 'lightgray',
    height: 35,
    width: moderateScale(250),
    color: 'grey',
    marginTop: 10,
    paddingVertical: 5,
    marginLeft: 10,
    fontSize: 20,
  },
  btnSectionContainer: {
    // marginLeft: -20,
    paddingHorizontal: 30,
    justifyContent: 'center',
    alignSelf: 'flex-end',
  },
  btnContainer: {
    paddingVertical: 10,
    width: moderateScale(70),
    height: 40,
    marginTop: 20,
    marginBottom: 20,
    // marginLeft: 20,
    // flex: 1,
    // justifyContent: 'center',
    // alignSelf: 'flex-end',
    borderRadius: 10,
  },
  btnText: {
    flex: 1,
    justifyContent: 'center',
    alignSelf: 'center',
    // fontFamily: 'Montserrat-Bold',
  },
  imageBackground: {
    width: moderateScale(width / 1.2),
    height: moderateScale(180),
    marginBottom: moderateScale(25),
    borderRadius: Platform.OS === 'ios' ? 20 : 20,
    overflow: 'hidden',
  },
  walletBalance: {
    paddingTop: 10,
    paddingHorizontal: 20,
  },
  walletText: {
    marginTop: 10,
  },
  walletButton: {
    position: 'absolute',
    bottom: moderateScale(10),
    right: moderateScale(10),
  },
  walletRechargeButton: {
    borderRadius: 20,
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: 20,
    width: moderateScale(120),
    height: moderateScale(40),
  },
  listPaymentMethods: {
    paddingHorizontal: 5,
    paddingVertical: 10,
  },
  selectPaymentMethodModal: {
    flex: 1,
    // position: 'absolute',
    // alignItems: 'center',
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(1,1,1, 0.5)',
    width: '100%',
    zIndex: 99,
    bottom: 0,
  },

  selectPaymentMethodModalContainer: {
    backgroundColor: 'white',
    paddingVertical: 25,
    paddingHorizontal: 30,
    borderTopRightRadius: 25,
    borderTopLeftRadius: 25,
  },
  textAlignment: {
    textAlign: 'center',
  },
  inputField: {
    height: moderateScale(45),
    borderColor: '#ffae3b',
    borderWidth: 1,
    borderRadius: 10,
  },
  dropdownSelec: {
    width: '28%',
    height: moderateScale(43),
    backgroundColor: '#ffecd1',
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
  },
  selecBanksDropDown: {
    width: '100%',
    height: moderateScale(43),
    backgroundColor: '#ffecd1',
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
  },
  between: {
    borderLeftWidth: 1,
    borderLeftColor: 'lightgray',
    height: '80%',
    marginLeft: moderateScale(20),
    marginRight: moderateScale(20),
  },
});

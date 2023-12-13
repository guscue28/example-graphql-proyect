import React, { useContext, useEffect, useRef } from 'react';
import {
  Alert,
  Dimensions,
  Image,
  Pressable,
  LogBox,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  TouchableHighlight,
  ActivityIndicator,
  FlatList,
  TextInput,
  ScrollView,
} from 'react-native';
import { Modal as RnModal } from 'react-native';
import { Button, Icon, Text, Block, Input } from 'galio-framework';
import IconBadge from 'react-native-icon-badge';
import { useLocation } from '../../hooks/useLocation';
import { Location as mapLocation } from '../../services/map/map.interface';
import mainStyle from '../../themes/mainTheme';
import MapView from 'react-native-maps';
import { AirbnbRating } from 'react-native-ratings';
import PuntodeLlegada from '../../assets/from_to_icon.svg';
import FromTo from '../../assets/from-to-black.svg';
import { moderateScale } from 'react-native-size-matters';
import { useMutation, useSubscription } from '@apollo/client';
import {
  SUB_TO_DRIVERS_LOCATION,
  // SUB_TO_DRIVERS_LOCATION,
  UPDATE_USER_LOCATION,
} from '../../services/map/map.graphql';
import { AllVehicleTypesConfig, CreateFavoriteLocationInput, FavoriteLocation, User, UserOnlineStatuses, UserRoles } from '../../services/user/user.interface';
const width = Dimensions.get('window').width;
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
// import MobyYellowIcon from '../../assets/moby-logo-yellow.svg';
import MessagesIcon from '../../assets/icons/messages.svg';
import ExitIcon from '../../assets/icons/feather/exit.svg';
import TimeIcon from '../../assets/icons/time.svg';
import DistanceIcon from '../../assets/icons/distance.svg';
import CartIcon from '../../assets/search_vehiculo.illustration.svg';
import DolarIcon from '../../assets/icons/dolar.svg';
import Dolar2Icon from '../../assets/icons/dolar2.svg';
import CalendarIcon from '../../assets/icons/calendar.svg';
import ReloadWallet from '../../assets/icons/recarga-wallet.svg';
import ArrowIcon from '../../assets/icons/arrows/up.svg';
import LeftArrowIcon from '../../assets/icons/arrows/left.svg';
import RightArrowIcon from '../../assets/icons/arrows/right.svg';
// import ReturnLeftIcon from '../../assets/icons/arrows/return-left.svg';
// import ReturnRightIcon from '../../assets/icons/arrows/return-right.svg';
import SlightLeftIcon from '../../assets/icons/arrows/slight-left.svg';
import SlightRightIcon from '../../assets/icons/arrows/slight-right.svg';
import RampLeftIcon from '../../assets/icons/arrows/ramp-left.svg';
import RampRightIcon from '../../assets/icons/arrows/ramp-right.svg';
import LinearGradient from 'react-native-linear-gradient';
import { CustomMapView } from '../../components/map/map.component';
import Config from 'react-native-config';
import { AppConfigContext } from '../../services/appConfig/context/appConfigContext';
import 'moment/locale/es-us';
import { AuthContext } from '../../services/auth/context/authContext';
import { CreditCardComponent } from '../../components/credit-cards/creditCardCard';
// import _ from 'lodash';
import Swiper from 'react-native-swiper';
import Tooltip from 'react-native-walkthrough-tooltip';
import * as mime from 'react-native-mime-types';
import { ReactNativeFile } from 'apollo-upload-client';
import { TravelStatuses, TravelTypes } from '../../interfaces/travel.interface';
import { MapContext } from '../../services/map/context/mapContext';
import moment from 'moment';
import DatePicker from 'react-native-date-picker';

import { navigationRef } from '../../../App';
import { Pagination } from '../../interfaces/pagination.interface';
import { FavoriteLocationsComponent } from '../../components/favorite-location/favoriteLocation.component';
import { useForm } from '../../hooks/useForms';
import SelectDropdown from 'react-native-select-dropdown';
import { useOrientation } from '../../hooks/useOrientation';
import { MapDirectionsResponse } from 'react-native-maps-directions';
import { MapViewDirectionsResult, Steps } from '../../interfaces/direcctionInterfaces';
import Tts from 'react-native-tts';
import * as Progress from 'react-native-progress';
Tts.setDefaultLanguage('es-US');
LogBox.ignoreLogs(['new NativeEventEmitter']); // Ignore log notification by message

const height = Dimensions.get('window').height;
const responsiveHeight = 40;

export const MapScreen = ({ navigation, route }: any) => {
  const { appConfig, vehicleTypes } = useContext(AppConfigContext);
  const {
    user,
    changeUserOnlineStatus,
    showTooltip,
    loadingStatus,
    hideTab,
    getMyFavoriteDrivers,
    getMyFavoriteLocations,
    deleteFavoriteLocation,
    createFavoriteLocations,
    favoriteLocations,
    favoriteLocationsCount,
  } = useContext(AuthContext);
  const GOOGLE_MAPS_APIKEY = Config.GOOGLE_MAPS_API_KEY_ENV;
  const mapRef = useRef<MapView>(null);
  const intervalPosition = useRef<any>(null);
  // const magnetometerRef = useRef<any>(null);
  const nameInput = useRef<TextInput>(null);
  const {
    driverApplications,
    currentTravel,
    travelRider,
    travelModal,
    confirmTravelModal,
    vehiclesConfirm,
    driverModal,
    finalPosition,
    initPosition,
    routeDistance,
    routeDuration,
    onRoadDriverModal,
    vehiclePreSelected,
    vehicleSelected,
    magnetometerState,
    // nearbyDrivers,
    nearbyDriversState,
    mapSnapshot,
    vehicles,
    vehiclesPreSelected,
    totalMount,
    vehicleDistance,
    vehicleDuration,
    result,
    searchModal,
    processingPaymentModal,
    inmediateCarrer,
    creditCardSelected,
    paymentMethod,
    scheduleTravelConfirmModal,
    vehicleSchedule,
    instructions,
    intervalCount,
    getCurrentTravel,
    createNewTravel,
    createScheduledTravel,
    acceptTravelRider,
    startTravel,
    finishTravel,
    cancelTravel,
    rejectTravel,
    clearTravelRider,
    updateMagnetometer,
    selectionedDriver,
    setNearbyDrivers,
    updateInitPosition,
    updateFinalPosition,
    updateCurrentTravelData,
    searchTravel,
    // refetchDrivers,
    getNearbyDrivers,
    openSearchModal,
    openTravelModal,
    closeVehiclesConfirm,
    openVehiclesConfirm,
    setVehiclePreSelected,
    openPaymentMethod,
    updateTravelRider,
    setOnRoadDriverModal,
    setResult,
    setMapSnapshot,
    openDriverModal,
    setCreditCardSelected,
    checkRateTravel,
    closeScheduleTravelModal,
    closeModals,
    scheduleTravel,
    setVehicleSchedule,
    selectSheduleTravel,
    startScheduledTravel,
    finishScheduledTravel,
    cancelScheduledTravel,
    // driverCancelScheduledTravel,
  } = useContext(MapContext);
  const orientation = useOrientation();
  const { userLocation, coordstoText, textToCoords, followUserLocation, stopFollowUserLocation, getCurrentLocation } = useLocation();
  const [loadingCalculate, setLoadingCalculate] = React.useState<boolean>(false);
  const [registerScheduleTravel, setRegisterScheduleTravel] = React.useState<boolean>(false);
  const [myLocationsModal, setMyLocationsModal] = React.useState<boolean>(false);
  const [myLocationsAutocomplete, setMyLocationsAutocomplete] = React.useState<boolean>(false);
  const [locationName, setLocationName] = React.useState<string>('');
  const [locationType, setLocationType] = React.useState<string>('OTHER');
  const [notDriverModal, setNotDriverModal] = React.useState<boolean>(false);
  const [journeyDate, setJourneyDate] = React.useState<Date>(new Date());
  const [initialTime, setInitialTime] = React.useState<Date>(new Date());
  const [showDatePicker, setShowDatePicker] = React.useState<boolean>(false);
  const [showTimePicker, setShowTimePicker] = React.useState<boolean>(false);
  const [loadingText, setLoadingText] = React.useState<boolean>(false);
  const [coordinatesToClient, setCoordinatesToClient] = React.useState<Array<{ latitude: number; longitude: number }>>([]);
  const [coordinatesToDestination, setCoordinatesToDestination] = React.useState<Array<{ latitude: number; longitude: number }>>([]);
  const [driversNotFoundModal, setDriversNotFoundModal] = React.useState<boolean>(false);
  const [fiscalInfoModalShow, setFiscalInfoModalShow] = React.useState<boolean>(false);
  const { form, onChange } = useForm({ name: '', documentType: '', documentNumber: '', fiscalAddress: '' });
  const [ciRiValues, setciRiValues] = React.useState<string>('V');
  const ciRifValuesSelec = ['V', 'E', 'J', 'P', 'G', 'C'];
  const [showError, setShowError] = React.useState<boolean>(false);
  const [loadingTravel, setLoadingNewTravel] = React.useState<boolean>(false);
  const [errorString, setErrorString] = React.useState<string>('');
  const [acceptTravelLoading, setAcceptTravelLoading] = React.useState<boolean>(false);
  const [startTravelLoading, setStartTravelLoading] = React.useState<boolean>(false);
  const [keepLocation, setKeepLocation] = React.useState<boolean>(false);
  const [keepLocationFinal, setKeepLocationFinal] = React.useState<string>('');
  const [messageModal, setMessageModal] = React.useState<{ title: string; message: string; show: boolean }>({
    title: '',
    message: '',
    show: false,
  });

  const [actualInstruction, setActualInstruction] = React.useState<Steps>({
    distance: {
      text: '',
      value: 0,
    },
    duration: {
      text: '',
      value: 0,
    },
    instructions: '',
    maneuver: '',
    end_location: { lat: 0, lng: 0 },
    start_location: { lat: 0, lng: 0 },
    html_instructions: '',
    polyline: { points: '' },
    travel_mode: '',
  });
  const [mute, setMute] = React.useState<boolean>(false);
  const myLocationString = React.useRef<string>('');
  // const [testCard, setTestCard] = React.useState<CreditCardHolder[]>([
  //   {
  //     nameRef: 'Banesco Panama',
  //     cardHolderName: 'Gustavo E',
  //     cvc: '1234',
  //     brand: 'visa',
  //     expiry: '12/02',
  //     number: '1234',
  //   },
  // ]);
  // useEffect(() => {
  //   // console.log('useEffect', nearbyDriversState);
  //   // console.log('vehiclesPreSelected', vehiclePreSelected);
  //   // console.log('routeInfo', `${routeDistance} km`, `${routeDuration} min`);
  // }, [nearbyDriversState, routeDistance, routeDuration, vehiclePreSelected]);

  const acceptTravel = async () => {
    setAcceptTravelLoading(true);
    const err = await acceptTravelRider(travelRider.travel!._id);
    if (err) {
      setAcceptTravelLoading(false);
      setMessageModal({
        title: 'Error',
        message: 'Ocurrio un error al aceptar el viaje',
        show: true,
      });
      return;
    }
    setAcceptTravelLoading(false);
    clearTravelRider();
    // hideTab(true);
  };

  const cancelTravelRider = async () => {
    // console.log('cancelTravelRider', travelRider.travel ? travelRider.travel._id : currentTravel!._id);
    let err;
    const travel = travelRider.travel ? travelRider.travel : currentTravel;
    if (travel?.travelType === TravelTypes.NORMAL) {
      err = await cancelTravel(travel!._id);
    } else {
      err = await cancelScheduledTravel(travel!._id);
    }
    if (err) {
      setMessageModal({
        title: 'Error',
        message: 'Ocurrio un error al cancelar el viaje',
        show: true,
      });
      return;
    }
    // hideTab(false);
    setMessageModal({
      title: 'Viaje cancelado',
      message: 'El viaje ha sido cancelado',
      show: true,
    });
  };

  const travelRiderState = async () => {
    let title = '';
    let subtitle = '';
    let err: any;
    console.log(currentTravel!.travelType, currentTravel!.travelStatus);

    if (currentTravel!.travelType === TravelTypes.NORMAL) {
      if (currentTravel!.travelStatus === TravelStatuses.ACCEPTED_AND_ON_WAY) {
        title = 'Viaje iniciado';
        subtitle = 'El viaje ha sido iniciado con éxito';
        err = await startTravel(currentTravel!._id);
      } else if (currentTravel!.travelStatus === TravelStatuses.STARTED) {
        console.log('ha iniciado');

        title = 'Viaje Finalizado';
        subtitle = 'El viaje ha sido finalizado con éxito';
        err = await finishTravel(currentTravel!._id);
      }
    } else {
      if (currentTravel!.travelStatus === TravelStatuses.ACCEPTED_AND_ON_WAY) {
        title = 'Viaje iniciado';
        subtitle = 'El viaje ha sido iniciado con éxito';
        err = await startScheduledTravel(currentTravel!._id);
      } else if (currentTravel!.travelStatus === TravelStatuses.STARTED) {
        title = 'Viaje Finalizado';
        subtitle = 'El viaje ha sido finalizado con éxito';
        err = await finishScheduledTravel(currentTravel!._id);
      }
    }
    if (err) {
      console.log('err', err);
      setMessageModal({
        title: 'Error',
        message: 'Ocurrio un error al cambiar el estado del viaje',
        show: true,
      });
      return;
    }
    if (title === 'Viaje Finalizado') {
      setOnRoadDriverModal(false);
      // navigation.navigate('FinishTravel', currentTravel);
    } else {
      setMessageModal({
        title: title,
        message: subtitle,
        show: true,
      });
    }
  };
  const [updateUserLocation]: any = useMutation(UPDATE_USER_LOCATION, {
    variables: {
      latitude: userLocation.latitude,
      longitude: userLocation.longitude,
      compassDegrees: magnetometerState,
    },
  });
  // console.log('nearbyDrivers', nearbyDrivers);

  const fitToCoordinates = (res: MapDirectionsResponse | MapViewDirectionsResult) => {
    if (mapRef.current) {
      mapRef.current.fitToCoordinates(
        currentTravel
          ? currentTravel.travelStatus === TravelStatuses.ACCEPTED_AND_ON_WAY
            ? [...coordinatesToClient, ...coordinatesToDestination]
            : currentTravel.travelStatus === TravelStatuses.STARTED
            ? coordinatesToDestination
            : res.coordinates
          : res.coordinates,
        {
          edgePadding: {
            right: 30,
            bottom: 100,
            left: 30,
            top: 100,
          },
          animated: true,
        },
      );
    }
  };
  const fitToUserLocation = () => {
    if (mapRef.current) {
      mapRef.current.fitToCoordinates([userLocation], {
        edgePadding: {
          right: 30,
          bottom: 50,
          left: 30,
          top: 100,
        },
        animated: true,
      });
    }
  };
  // const searchFavoritePosition = () => {
  //   navigation.navigate('CompleteFavoriteLocation', {
  //     address: finalPosition.text,
  //     location: finalPosition.coords,
  //   });
  // };
  const selectDriver = async (usr: User, distance: number, duration: number, openModal: boolean = true) => {
    try {
      let finalPrice = 0;
      const pricesVehicleType = usr.vehicle?.vehicleType;
      if (pricesVehicleType) {
        const priceInKm = routeDistance * pricesVehicleType.pricePerKM;
        const priceInMin = routeDuration * pricesVehicleType.pricePerMIN;
        const average = priceInKm + priceInMin / 2;
        if (average < pricesVehicleType.minimumFare) {
          finalPrice = pricesVehicleType.minimumFare;
        } else {
          finalPrice = average;
        }
      }
      selectionedDriver(openModal, usr, distance, duration, finalPrice, !openModal);
      setLoadingCalculate(false);
    } catch (error) {
      console.log('error', error);
    }
  };

  useEffect(() => {
    followUserLocation();
    return () => {
      stopFollowUserLocation();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useSubscription(SUB_TO_DRIVERS_LOCATION, {
    variables: {
      users: nearbyDriversState && nearbyDriversState.length ? nearbyDriversState.map((u: any) => u._id) : [],
    },
    skip: !nearbyDriversState || !nearbyDriversState.length,
    onSubscriptionData: ({ subscriptionData }) => {
      const updateNearbyDrivers = nearbyDriversState.length
        ? nearbyDriversState.map((u: User) => {
            if (u._id === subscriptionData.data.userLocationChanged._id) {
              return { ...u, location: subscriptionData.data.userLocationChanged.location };
            }
            return u;
          })
        : [];
      let selectionedVehicle: any;
      if (vehicleSelected) {
        if (subscriptionData.data.userLocationChanged._id === vehicleSelected._id) {
          selectionedVehicle = { ...vehicleSelected, location: subscriptionData.data.userLocationChanged.location };
        }
      }
      setNearbyDrivers(updateNearbyDrivers, selectionedVehicle);
    },
  });
  // const randomIntFromInterval = (min: number, max: number) => {
  //   // min and max included
  //   return Math.random() * (max - min + 1) + min;
  // };
  // React.useEffect(() => {
  //   const interval = setInterval(() => {
  //     // updateUserLocation();
  //     const updateNearbyDrivers = nearbyDriversState;
  //     if (updateNearbyDrivers.length) {
  //       console.log('updateNearbyDrivers', updateNearbyDrivers[0].location!.coordinates);

  //       updateNearbyDrivers[0].location!.coordinates![0] = randomIntFromInterval(66, 66);
  //       updateNearbyDrivers[0].location!.coordinates![1] = randomIntFromInterval(11, 11);
  //       setNearbyDrivers(updateNearbyDrivers, updateNearbyDrivers[0]);
  //     }
  //   }, 2000);
  //   return () => clearInterval(interval);

  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [nearbyDriversState]);

  const updateLocation = () => {
    getCurrentLocation().then(res => {
      updateUserLocation({
        variables: {
          latitude: res.latitude,
          longitude: res.longitude,
          compassDegrees: res.heading ? res.heading : 0,
        },
      });
      updateMagnetometer(res.heading ? res.heading : 0);
    });
  };

  React.useEffect(() => {
    intervalPosition.current = setInterval(() => {
      updateLocation();
    }, 20000);
    return () => {
      clearInterval(intervalPosition.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  // useEffect(() => {
  //   console.log('location', location);
  // }, [location]);

  useEffect(() => {
    if (userLocation && initPosition.text === 'Posición Actual') {
      // console.log('userLocation', userLocation);
      coordstoText(userLocation.latitude, userLocation.longitude).then(txt => {
        if (txt) {
          updateInitPosition({ text: txt, coords: userLocation });
          // setInitPosition(txt);
          if (mapRef.current) {
            mapRef.current.animateToRegion({
              latitude: userLocation.latitude,
              longitude: userLocation.longitude,
              latitudeDelta: 0.005,
              longitudeDelta: 0.005,
            });
          }
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [coordstoText, initPosition, userLocation]);

  const getData = async () => {
    const pagination: Pagination = {
      itemsPerPage: 10,
      page: 1,
      searchKey: '',
    };
    await getMyFavoriteDrivers(pagination);
    await getMyFavoriteLocations(pagination);
  };

  useEffect(() => {
    getCurrentTravel();
    if (user?.roles?.includes(UserRoles.CLIENT)) {
      getData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const updateTravelData = async () => {
    if (user && user.roles?.includes(UserRoles.CLIENT)) {
      updateCurrentTravelData(
        {
          text: currentTravel!.originString,
          coords: {
            latitude: currentTravel!.origin.coordinates[1],
            longitude: currentTravel!.origin.coordinates[0],
          },
        },
        {
          text: currentTravel!.destinationString,
          coords: {
            latitude: currentTravel!.destination.coordinates[1],
            longitude: currentTravel!.destination.coordinates[0],
          },
        },
        true,
        currentTravel!.distance,
        currentTravel!.estimatedTime,
        currentTravel!.driver ? false : true,
        currentTravel!.driver && currentTravel!.travelStatus !== TravelStatuses.FINISHED ? true : false,
        currentTravel && currentTravel.driver && currentTravel.driver,
      );
      if (currentTravel?.travelStatus === TravelStatuses.FINISHED) {
        navigation.navigate('FinishTravel', currentTravel);
      }
    } else if (user && user.roles?.includes(UserRoles.DRIVER)) {
      if (currentTravel?.travelStatus === TravelStatuses.FINISHED) {
        navigation.navigate('FinishTravel', currentTravel);
      }
    }
  };
  useEffect(() => {
    console.log('currentTravel from context, useEfect mapScree.tsx', currentTravel);
    if (currentTravel) {
      hideTab(false);
      updateTravelData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTravel]);
  useEffect(() => {
    checkRateTravel();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (currentTravel && coordinatesToClient.length && coordinatesToDestination.length) {
      fitToCoordinates({
        coordinates: [...coordinatesToClient, ...coordinatesToDestination],
        distance: currentTravel.distance,
        duration: currentTravel.estimatedTime,
        fares: [],
        legs: [],
        waypointOrder: [],
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTravel, coordinatesToClient, coordinatesToDestination]);

  // useEffect(() => {
  //   console.log('userLocation', userLocation);
  // }, [userLocation]);

  //METODO PARA SETEAR LA LOCACION FAVORITA COMO DESTINO
  const travelWithFavoriteLocation = (item: FavoriteLocation) => {
    setMyLocationsAutocomplete(true);
    myLocationString.current = item.locationString;
    updateFinalPosition({ text: myLocationString.current, coords: finalPosition.coords });
    setMyLocationsModal(false);
  };

  const onPressSearch = async () => {
    console.log('SEARCH PRESSED');

    setLoadingText(true);
    try {
      setLoadingCalculate(true);

      const final = await textToCoords(finalPosition.text);
      const init = await textToCoords(initPosition.text);

      setKeepLocation(true);
      setKeepLocationFinal(finalPosition.text);

      if (init.length && final.length) {
        searchTravel(
          {
            text: initPosition.text === '' ? 'Posición Actual' : initPosition.text,
            coords: {
              latitude: init[0].position.lat,
              longitude: init[0].position.lng,
            },
          },
          {
            text: finalPosition.text === '' ? 'Posición Actual' : finalPosition.text,
            coords: {
              latitude: final[0].position.lat,
              longitude: final[0].position.lng,
            },
          },
          true,
          false,
        );
        const drivers = await getNearbyDrivers(init[0].position.lat, init[0].position.lng);
        if (drivers && drivers.length) {
          hideTab(true);
        } else {
          // setDriversNotFoundModal(true);
          setVehicleSchedule(vehicleTypes[0]);
          calculateSheduleTravel(routeDistance, routeDuration, vehicleTypes[0]);
          setMessageModal({
            title: '',
            message: 'No se encontraron vehiculos en su zona',
            show: true,
          });
          setTimeout(() => {
            setMessageModal({
              title: '',
              message: '',
              show: false,
            });
            setNotDriverModal(true);
            hideTab(true);
            setLoadingCalculate(false);
          }, 1500);
        }
        setLoadingText(false);
        hideTab(true);
      }
    } catch (error: any) {
      console.log(error);

      setMessageModal({
        title: 'Ocurrió un error',
        message: error.message,
        show: true,
      });
      setLoadingText(false);
    }
  };

  const newTravel = async () => {
    setLoadingNewTravel(true);
    const origin: mapLocation = {
      coordinates: [initPosition.coords!.longitude, initPosition.coords!.latitude],
    };
    const destination: mapLocation = {
      coordinates: [finalPosition.coords!.longitude, finalPosition.coords!.latitude],
    };
    const estimatedTime = routeDuration;
    const distance = routeDistance;
    const driver = vehiclePreSelected!._id!;
    const vehicleType = vehiclePreSelected!.vehicle!.vehicleType._id!;

    let originString;
    if (initPosition.text === '' || initPosition.text === 'Posición Actual') {
      const text = await coordstoText(initPosition.coords!.latitude, initPosition.coords!.longitude);
      if (text) {
        originString = text;
      } else {
        originString = initPosition.text;
      }
    } else {
      originString = initPosition.text;
    }
    let destinationString;
    if (finalPosition.text === '' || finalPosition.text === 'Posición Actual') {
      const text = await coordstoText(finalPosition.coords!.latitude, finalPosition.coords!.longitude);
      if (text) {
        destinationString = text;
      } else {
        destinationString = finalPosition.text;
      }
    } else {
      destinationString = finalPosition.text;
    }
    const screenshot = new ReactNativeFile({
      uri: mapSnapshot,
      type: mime.lookup(mapSnapshot) || 'image',
      name: `screenShot-${new Date().getTime()}.png`,
    });
    try {
      await createNewTravel(origin, destination, distance, estimatedTime, driver, vehicleType!, originString, destinationString, screenshot);
      setLoadingNewTravel(false);
    } catch (error: any) {
      setMessageModal({
        title: 'Ocurrió un error',
        message: `No se pudo crear el viaje ${error.message}`,
        show: true,
      });
      console.log(error);
      setLoadingNewTravel(false);
    }
  };
  const newScheduleTravel = async () => {
    setLoadingNewTravel(true);
    const origin: mapLocation = {
      coordinates: [initPosition.coords!.longitude, initPosition.coords!.latitude],
    };
    const destination: mapLocation = {
      coordinates: [finalPosition.coords!.longitude, finalPosition.coords!.latitude],
    };
    const estimatedTime = routeDuration;
    const distance = routeDistance;
    // const driver = vehiclePreSelected!._id!;
    const vehicleType = vehicleSchedule!._id;
    let originString;
    if (initPosition.text === '' || initPosition.text === 'Posición Actual') {
      const text = await coordstoText(initPosition.coords!.latitude, initPosition.coords!.longitude);
      if (text) {
        originString = text;
      } else {
        originString = initPosition.text;
      }
    } else {
      originString = initPosition.text;
    }
    let destinationString;
    if (finalPosition.text === '' || finalPosition.text === 'Posición Actual') {
      const text = await coordstoText(finalPosition.coords!.latitude, finalPosition.coords!.longitude);
      if (text) {
        destinationString = text;
      } else {
        destinationString = finalPosition.text;
      }
    } else {
      destinationString = finalPosition.text;
    }
    const screenshot = new ReactNativeFile({
      uri: mapSnapshot,
      type: mime.lookup(mapSnapshot) || 'image',
      name: `screenShot-${new Date().getTime()}.png`,
    });
    const scheduledDate = new Date(`${moment(journeyDate).format('YYYY-MM-DD')}T${moment(initialTime).format('HH:mm:ss')}`);
    try {
      await createScheduledTravel(destination, destinationString, distance, estimatedTime, origin, originString, scheduledDate, vehicleType!, screenshot);
      setLoadingNewTravel(false);
      setNotDriverModal(false);
      hideTab(false);
    } catch (error: any) {
      setMessageModal({
        title: 'Ocurrió un error',
        message: `No se pudo programar el viaje ${error.message}`,
        show: true,
      });
      console.log(error);
      setLoadingNewTravel(false);
    }
  };

  const handleDatePicked = async (date: Date) => {
    // setShowDatePicker(false);
    setJourneyDate(date);
    // setDateReadable(date.toISOString().split('T')[0]);
  };

  const handleTimePicked = async (date: Date) => {
    // setShowTimePicker(false);
    setInitialTime(date);
    // setTimeReadable(date.toISOString().split('T')[1].split('.')[0]);
  };

  const goToChat = () => {
    closeModals();
    navigationRef.current.navigate(user?.roles?.includes(UserRoles.DRIVER) ? 'DriverTabNavigation' : 'TabNavigaton', {
      screen: 'MyMessagesTab',
      params: {
        screen: 'ChatScreen',
        params: {
          id: currentTravel!.chatId,
          enable: true,
          participants: [currentTravel!.driver, currentTravel!.client],
        },
      },
    });
  };

  const calculateSheduleTravel = async (distance: number, duration: number, vehicle?: AllVehicleTypesConfig) => {
    try {
      let finalPrice = 0;
      const pricesVehicleType = vehicleTypes.find(p => (vehicle ? p.name === vehicle.name : p.name === vehicleSchedule?.name));
      if (pricesVehicleType) {
        const priceInKm = routeDistance * pricesVehicleType.pricePerKM;
        const priceInMin = routeDuration * pricesVehicleType.pricePerMIN;
        const average = priceInKm + priceInMin / 2;
        if (average < pricesVehicleType.minimumFare) {
          finalPrice = pricesVehicleType.minimumFare;
        } else {
          finalPrice = average;
        }
      }
      selectSheduleTravel(distance, duration, finalPrice);
      setLoadingCalculate(false);
    } catch (error) {
      console.log('error', error);
    }
  };

  const createNewFavoriteLocation = async () => {
    const final = await textToCoords(finalPosition.text);
    if (final.length) {
      const destination: mapLocation = {
        coordinates: [final[0].position.lng, final[0].position.lat],
      };
      const payload: CreateFavoriteLocationInput = {
        name: locationName,
        type: locationType,
        location: destination,
        locationString: finalPosition.text,
      };
      setLoadingText(true);
      await createFavoriteLocations(payload);
      setLocationName('');
      setLoadingText(false);
    }
  };

  const removeFavoriteLocation = async (favoriteLocationId: string) => {
    await deleteFavoriteLocation(favoriteLocationId);
  };

  const editFavoriteLocations = async (favoriteLocationId: string) => {
    console.log('log', favoriteLocationId, locationName);
  };

  const saveFiscalInfo = async () => {
    const { name, documentType, documentNumber, fiscalAddress } = form;
    console.log('form', name, documentType, documentNumber, fiscalAddress);
    const numberReg = new RegExp('^[0-9]+$');
    if (name === '' || documentNumber === '' || fiscalAddress === '') {
      setShowError(true);
      return setErrorString('Todos los campos son obligatorios');
    }
    if (numberReg.test(documentNumber) === false) {
      setShowError(true);
      return setErrorString('El número de documento debe contener solo números');
    }
    setShowError(false);
    setErrorString('');
    setFiscalInfoModalShow(false);
    openVehiclesConfirm();
  };

  useEffect(() => {
    if (instructions && instructions.length) {
      setActualInstruction(instructions[0]);
    }
  }, [instructions]);

  const getIcon = (type?: string) => {
    // <ReturnLeftIcon style={{ marginHorizontal: 10 }} width={42} height={42} fill="#ffae3b" />
    // <ReturnRightIcon style={{ marginHorizontal: 10 }} width={42} height={42} fill="#ffae3b" />
    if (type) {
      switch (type) {
        case 'turn-right':
          return <RightArrowIcon style={{ marginHorizontal: 10 }} width={42} height={42} fill="#ffae3b" />;
        case 'turn-left':
          return <LeftArrowIcon style={{ marginHorizontal: 10 }} width={42} height={42} fill="#ffae3b" />;
        case 'straight':
          return <ArrowIcon style={{ marginHorizontal: 10 }} width={42} height={42} fill="#ffae3b" />;
        case 'ramp-right':
          return <RampRightIcon style={{ marginHorizontal: 10 }} width={42} height={42} fill="#ffae3b" />;
        case 'ramp-left':
          return <RampLeftIcon style={{ marginHorizontal: 10 }} width={42} height={42} fill="#ffae3b" />;
        case 'keep-right':
          return <SlightRightIcon style={{ marginHorizontal: 10 }} width={42} height={42} fill="#ffae3b" />;
        case 'keep-left':
          return <SlightLeftIcon style={{ marginHorizontal: 10 }} width={42} height={42} fill="#ffae3b" />;
        default:
          return <ArrowIcon style={{ marginHorizontal: 10 }} width={42} height={42} fill="#ffae3b" />;
      }
    }
  };
  // console.log('instructions', instructions);
  const handleVoice = (tts?: string) => {
    if (tts && !mute) {
      Tts.speak(tts);
    }
  };
  const renderInstruction = ({ item }: any) => {
    const { distance: instructionDistance, duration: instructionDuration, instructions: info, maneuver } = item;
    // console.log('item', item);
    const icon = getIcon(maneuver);
    return (
      <TouchableOpacity onPress={() => handleVoice(info)}>
        <Block row style={{ backgroundColor: '#ffffffdd', padding: 10, marginVertical: 10, borderRadius: 10, alignItems: 'center' }}>
          {icon}
          <Block>
            <Text color="black" bold size={28}>
              {`${
                instructionDistance.value >= 1000
                  ? (instructionDistance.value / 1000).toFixed(2)
                  : instructionDistance.value.length > 2
                  ? Math.round(instructionDistance.value / 100) * 100
                  : Math.round(instructionDistance.value / 10) * 10
              } ${instructionDistance.value >= 1000 ? 'km' : 'm'} (${instructionDuration.text})`}
            </Text>
            <Text color="#a0a0a0" bold size={14}>
              {maneuver}
            </Text>
          </Block>
        </Block>
      </TouchableOpacity>
    );
  };
  return (
    <View style={mainStyle.mainContainer} nativeID={'1'}>
      <View style={styles.subContainer}>
        {/* {vehicles && (
          <Button
            onlyIcon
            icon="chevron-left"
            iconFamily="Feather"
            iconSize={20}
            color="#222222"
            iconColor="gray"
            style={styles.topBackButton}
            onPress={async () => {
              setVehicles(false);
              setSearchModal(true);
              setVehiclesConfirm(false);
              hideTab(false);
            }}
          />
        )} */}
      </View>
      {user?.roles?.includes(UserRoles.CLIENT) &&
        (vehicles ? (
          <TouchableHighlight
            style={styles.vehiclesContainer}
            onPress={async () => {
              !currentTravel && (openSearchModal(true), hideTab(false));
            }}>
            <>
              <Block style={[styles.originDestinationBox, { borderRadius: 10, elevation: 5, backgroundColor: '#222222', paddingBottom: 5 }]}>
                <Block row style={{ alignItems: 'center' }}>
                  <PuntodeLlegada width={60} height={60} style={styles.arrivedPoint} />
                  <Block>
                    <View style={styles.originDestinationBoxFirstRow}>
                      <Text color="white" numberOfLines={2} size={12}>
                        {initPosition.text}
                      </Text>
                    </View>
                    <View style={styles.originDestinationBoxSecondRow}>
                      <Text color="white" numberOfLines={2} size={12}>
                        {finalPosition.text}
                      </Text>
                    </View>
                  </Block>
                </Block>
                <Block row style={{ justifyContent: 'flex-end', alignItems: 'center', paddingRight: 20 }}>
                  <Block row>
                    <DistanceIcon width={20} height={20} style={{ marginLeft: 10 }} />
                    <Text style={{ marginLeft: 5 }} color="white" size={13}>
                      {routeDistance.toFixed(2)} km
                    </Text>
                  </Block>
                  <Block row>
                    <TimeIcon width={15} height={15} style={{ marginLeft: 10 }} />
                    <Text style={{ marginLeft: 5 }} color="white" size={13}>
                      {Math.round(routeDuration)} min
                    </Text>
                  </Block>
                </Block>
              </Block>
              <Block
                style={[
                  styles.originDestinationBox,
                  {
                    backgroundColor: '#ffae3b',
                    elevation: 1,
                    borderBottomLeftRadius: 10,
                    borderBottomRightRadius: 10,
                    // top: -10,
                  },
                  (currentTravel && currentTravel?.travelStatus === TravelStatuses.CANCELLED) ||
                  (currentTravel && currentTravel?.travelStatus === TravelStatuses.SCHEDULED_WITHOUT_DRIVER) ||
                  !currentTravel
                    ? {
                        display: 'none',
                      }
                    : {},
                ]}>
                <Block>
                  <View style={styles.notificationInfoRow}>
                    <Text color="#222222" numberOfLines={2} size={12}>
                      {currentTravel?.travelStatus === TravelStatuses.PENDING_TO_ASSIGN
                        ? 'Esperando confirmación del conductor'
                        : currentTravel?.travelStatus === TravelStatuses.ACCEPTED_AND_ON_WAY
                        ? 'El conductor ha aceptado el viaje'
                        : currentTravel?.travelStatus === TravelStatuses.STARTED
                        ? 'Tu viaje ha iniciado'
                        : currentTravel?.travelStatus === TravelStatuses.FINISHED
                        ? 'Tu viaje ha finalizado'
                        : ''}
                    </Text>
                  </View>
                </Block>
              </Block>
            </>
          </TouchableHighlight>
        ) : (
          <TouchableOpacity
            style={[styles.searchButton, { display: searchModal ? 'none' : undefined }]}
            onPress={() => {
              openSearchModal(true);
              setMyLocationsAutocomplete(false);
            }}>
            <Block row space="between" middle>
              <Text size={16} style={{ marginLeft: 20 }} color="#d7d7d7">
                ¿A dónde vas?
              </Text>
              <Block middle style={styles.iconDown}>
                <Icon family="Feather" name="chevron-down" size={24} />
              </Block>
            </Block>
          </TouchableOpacity>
        ))}

      <TouchableHighlight
        onPress={() => {
          fitToUserLocation();
        }}
        style={[styles.tabButtons, { bottom: orientation === 'PORTRAIT' ? 90 : 90 - responsiveHeight }]}>
        <Icon family="MaterialIcons" name="my-location" size={24} color="gray" />
      </TouchableHighlight>
      {/* Comentado de forma temporal */}
      {/* {user?.roles?.includes(UserRoles.CLIENT) && (
        <TouchableOpacity
          onPress={() => {
            navigation.openDrawer();
          }}
          style={[styles.filterButton, { top: moderateScale(120) }]}>
          <Icon family="MaterialIcons" name="filter-alt" size={24} color="gray" />
        </TouchableOpacity>
      )} */}
      {/* <RNTooltips text={'Long Press Description'} visible={true} target={TouchableHighlight} parent={Block} /> */}
      {user?.roles?.includes(UserRoles.DRIVER) && !currentTravel && (
        <>
          <TouchableHighlight
            onPress={async () => {
              await changeUserOnlineStatus(user.onlineStatus === UserOnlineStatuses.ONLINE ? UserOnlineStatuses.BUSY : UserOnlineStatuses.ONLINE);
            }}
            style={[
              styles.tabButtons,
              {
                bottom: orientation === 'PORTRAIT' ? 90 : 90 - responsiveHeight,
                left: 0,
                borderTopLeftRadius: 0,
                borderTopRightRadius: 15,
                borderBottomLeftRadius: 0,
                borderBottomRightRadius: 15,
              },
            ]}>
            <Tooltip
              tooltipStyle={{ position: 'absolute', bottom: moderateScale(40), left: moderateScale(9) }}
              isVisible={showTooltip}
              backgroundColor={'transparent'}
              content={
                <View>
                  <Text color="black" bold>
                    {user && user.onlineStatus === 'ONLINE' ? 'En Linea' : 'Ocupado'}{' '}
                  </Text>
                </View>
              }
              // onClose={() => setTip(false)}
              placement="top">
              {loadingStatus ? (
                <ActivityIndicator size="small" color="gray" />
              ) : (
                <Icon family="Feather" name="power" size={24} color={user.onlineStatus === 'ONLINE' ? '#ffae3b' : 'gray'} />
              )}
            </Tooltip>
          </TouchableHighlight>
        </>
      )}
      {user?.roles?.includes(UserRoles.CLIENT) && !currentTravel && (
        <>
          {/* Boton para ir directo a las recargas */}
          <TouchableHighlight
            onPress={() => {
              navigation.navigate('MyProfileTab', {
                screen: 'MyProfileScreen',
                params: { payment: true },
              });
            }}
            style={[
              styles.paymentButton,
              {
                bottom: orientation === 'PORTRAIT' ? 90 : 90 - responsiveHeight,
                left: 0,
                borderTopLeftRadius: 0,
                borderTopRightRadius: 15,
                borderBottomLeftRadius: 0,
                borderBottomRightRadius: 15,
              },
            ]}>
            <ReloadWallet width={24} height={24} />
          </TouchableHighlight>
        </>
      )}
      {vehicles && (
        <>
          {currentTravel && currentTravel.driver ? (
            <TouchableHighlight
              onPress={() => {
                setOnRoadDriverModal(true);
              }}
              style={[styles.tabButtons, { bottom: orientation === 'PORTRAIT' ? 210 : 210 - responsiveHeight }]}>
              <Icon family="MaterialIcons" name={'info-outline'} size={24} color="gray" />
            </TouchableHighlight>
          ) : null}
          <TouchableHighlight
            onPress={() => {
              result && fitToCoordinates(result);
            }}
            style={[styles.tabButtons, { bottom: orientation === 'PORTRAIT' ? 150 : 150 - responsiveHeight }]}>
            <Icon family="MaterialIcons" name="alt-route" size={24} color="gray" />
          </TouchableHighlight>
        </>
      )}
      {user?.roles?.includes(UserRoles.DRIVER) && currentTravel && (
        <>
          {orientation === 'LANDSCAPE' && currentTravel.travelStatus === TravelStatuses.STARTED ? (
            <FlatList
              data={instructions}
              horizontal={false}
              // nativeID={'2'}
              style={{ position: 'absolute', left: 10, top: 30, zIndex: 2000, height: moderateScale(250) }}
              renderItem={renderInstruction}
            />
          ) : orientation === 'PORTRAIT' && currentTravel.travelStatus === TravelStatuses.STARTED && actualInstruction ? (
            <TouchableHighlight
              onPress={() => {
                handleVoice(actualInstruction.instructions);
              }}
              style={{
                position: 'absolute',
                flexDirection: 'row',
                width,
                height: moderateScale(100),
                backgroundColor: '#222222',
                top: 0,
                left: 0,
                zIndex: 2000,
                paddingHorizontal: 20,
                paddingVertical: 10,
                alignItems: 'center',
              }}>
              <>
                <Block middle>
                  {getIcon(actualInstruction.maneuver)}
                  <Block row style={{ alignItems: 'flex-end', justifyContent: 'center' }}>
                    <Text bold size={24} color={'white'}>
                      {actualInstruction.distance.text}
                    </Text>
                    {/* <Text size={18} color={'white'}>
                    km
                  </Text> */}
                  </Block>
                </Block>
                <Block
                  style={{
                    // width: '80%',
                    marginLeft: 10,
                    marginRight: 30,
                  }}>
                  <Text bold color="white" size={16}>
                    {actualInstruction.instructions}
                  </Text>
                </Block>
                <Button
                  onPress={() => {
                    setMute(!mute);
                  }}
                  icon={!mute ? 'volume-up' : 'volume-off'}
                  iconColor="#222222"
                  round
                  iconSize={32}
                  onlyIcon
                  iconFamily="MaterialIcons"
                  color="#ffae3b"
                  shadowColor="black"
                  style={{ position: 'absolute', bottom: -30, right: 20, width: 50, height: 50 }}
                />
              </>
            </TouchableHighlight>
          ) : null}
          <TouchableHighlight
            onPress={() => {
              navigationRef.current.navigate('DriverTabNavigation', {
                screen: 'MyMessagesTab',
                params: {
                  screen: 'ChatScreen',
                  params: {
                    id: currentTravel.chatId,
                    enable: true,
                    participants: [currentTravel.driver, currentTravel.client],
                  },
                },
              });
            }}
            style={[styles.tabButtons, { bottom: orientation === 'PORTRAIT' ? 270 : 270 - responsiveHeight }]}>
            <Icon family="MaterialIcons" name="chat" size={24} color="gray" />
          </TouchableHighlight>
          <TouchableHighlight
            onPress={() => {
              openTravelModal(true);
            }}
            style={[styles.tabButtons, { bottom: orientation === 'PORTRAIT' ? 210 : 210 - responsiveHeight }]}>
            <Icon family="MaterialIcons" name="check" size={24} color="gray" />
          </TouchableHighlight>
          <TouchableHighlight
            onPress={() => {
              result && fitToCoordinates(result);
            }}
            style={[styles.tabButtons, { bottom: orientation === 'PORTRAIT' ? 150 : 150 - responsiveHeight }]}>
            <Icon family="MaterialIcons" name="alt-route" size={24} color="gray" />
          </TouchableHighlight>
        </>
      )}
      {(vehiclesConfirm && vehiclePreSelected) || (vehiclesConfirm && registerScheduleTravel && inmediateCarrer) || notDriverModal ? (
        <View style={styles.vehiclesConfirmBox}>
          <TouchableOpacity
            style={{ position: 'absolute', right: 20, top: 20 }}
            onPress={async () => {
              closeVehiclesConfirm();
              setRegisterScheduleTravel(false);
              setNotDriverModal(false);
              hideTab(false);
            }}>
            <ExitIcon color="gray" />
          </TouchableOpacity>
          <Text color="white" style={{ marginVertical: 15, alignSelf: 'center' }}>
            Tipo de Vehiculo
          </Text>
          {inmediateCarrer || notDriverModal ? (
            <Swiper
              loop={false}
              dotStyle={{
                width: 5,
                height: 5,
                borderRadius: 5,
                marginHorizontal: 5,
                backgroundColor: 'gray',
                top: 15,
              }}
              activeDotStyle={{
                width: 5,
                height: 5,
                borderRadius: 5,
                marginHorizontal: 5,
                backgroundColor: '#ffae3b',
                top: 15,
              }}
              onIndexChanged={index => {
                setLoadingCalculate(true);
                if (!notDriverModal) {
                  console.log('indexDot', index);
                  setVehiclePreSelected(vehiclesPreSelected[index]);
                } else {
                  setVehicleSchedule(vehicleTypes[index]);
                  calculateSheduleTravel(routeDistance, routeDuration, vehicleTypes[index]);
                }
              }}
              height={moderateScale(100)}>
              {notDriverModal
                ? vehicleTypes
                    .filter(v => v.enabled === false)
                    .map((vehicle, i) => (
                      <Image
                        key={i}
                        source={vehicle.pictures.length ? { uri: vehicle.pictures[0] } : require('../../assets/movyLogo.png')}
                        style={{ width: moderateScale(180), height: 80, alignSelf: 'center' }}
                        resizeMode="contain"
                      />
                    ))
                : vehiclesPreSelected.map((vehicle: User, i: number) => (
                    <Image
                      key={i}
                      source={{ uri: vehicle.vehicle?.vehicleType.pictures[0] }}
                      style={{ width: moderateScale(180), height: 80, alignSelf: 'center' }}
                      resizeMode="contain"
                    />
                  ))}
            </Swiper>
          ) : (
            <Image
              source={{ uri: vehiclePreSelected?.vehicle?.vehicleType.pictures[0] }}
              style={{ width: moderateScale(180), height: 80, alignSelf: 'center' }}
              resizeMode="contain"
            />
          )}
          {!loadingCalculate ? (
            <Block row middle style={{ borderTopWidth: 0.3, borderColor: '#232323' }}>
              {notDriverModal ? (
                <>
                  <View style={styles.vehicleSpacing} />
                  <View>
                    <View style={styles.vehiclesConfirmBoxData}>
                      <DolarIcon />
                      <Text bold style={{ marginLeft: 5 }} color="#ffae3b">
                        ${totalMount.toFixed(2)}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.vehicleSpacing} />
                </>
              ) : (
                <>
                  <View>
                    <View style={styles.vehiclesConfirmBoxData}>
                      <DolarIcon />
                      <Text bold style={{ marginLeft: 5 }} color="#ffae3b">
                        ${totalMount.toFixed(2)}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.vehicleSpacing} />
                  <View>
                    <View style={styles.vehiclesConfirmBoxData}>
                      <Icon name="clockcircleo" family="AntDesign" size={15} color="white" />
                      <Text bold color="white" style={{ marginLeft: 5 }}>
                        {Math.ceil(vehicleDuration)} min
                      </Text>
                    </View>
                  </View>
                  <View style={styles.vehicleSpacing} />
                  <View>
                    <View style={styles.vehiclesConfirmBoxData}>
                      <DistanceIcon width={20} height={20} />
                      <Text bold color="white" style={{ marginLeft: 5 }}>
                        {vehicleDistance.toFixed(2)} km
                      </Text>
                    </View>
                  </View>
                </>
              )}
            </Block>
          ) : (
            <ActivityIndicator style={{ marginVertical: moderateScale(12) }} size="small" color="#ffae3b" />
          )}
          {registerScheduleTravel && (
            <>
              <TouchableOpacity
                onPress={() => {
                  setShowDatePicker(showDatePicker ? false : true);
                  setShowTimePicker(false);
                }}
                style={[styles.selectorContainer, { borderBottomColor: '#232323' }]}>
                <Text color="white" size={20}>{`${moment(journeyDate).format('ddd DD [de] MMM [del] YYYY')}`}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setShowTimePicker(showTimePicker ? false : true);
                  setShowDatePicker(false);
                }}
                style={[styles.selectorContainer, { borderTopColor: 'transparent' }]}>
                <Text color="white" size={20}>{`${moment(initialTime).format('hh:mm a')}`}</Text>
              </TouchableOpacity>
              {showDatePicker ? (
                <DatePicker
                  modal={false}
                  mode="date"
                  androidVariant="nativeAndroid"
                  title="Seleccione una fecha"
                  confirmText="Confirmar"
                  cancelText="Cancelar"
                  // minimumDate={new Date(moment().startOf('day').format())}
                  // maximumDate={new Date(moment().endOf('day').add(2, 'months').format())}
                  textColor="white"
                  fadeToColor="#151515"
                  style={{ backgroundColor: '#151515', width, marginBottom: 10 }}
                  onDateChange={date => {
                    const valuePrevDates = new Date(moment().startOf('day').add(-1, 'days').format());
                    const valueFutureValues = new Date(moment().startOf('day').add(2, 'months').format());
                    if (moment(valuePrevDates).isSame(date, 'day')) {
                      Alert.alert('Fecha invalida - intente de nuevo');
                      date = journeyDate;
                      setShowDatePicker(false);
                    }
                    if (moment(valueFutureValues).isSame(date, 'day')) {
                      Alert.alert('Fecha invalida - intente de nuevo');
                      date = journeyDate;
                      setShowDatePicker(false);
                    }

                    handleDatePicked(date);
                  }}
                  date={journeyDate}
                />
              ) : null}

              {showTimePicker ? (
                <DatePicker
                  modal={false}
                  mode="time"
                  androidVariant="nativeAndroid"
                  title="Hora inicial"
                  confirmText="Confirmar"
                  cancelText="Cancelar"
                  minimumDate={new Date(moment().format())}
                  maximumDate={new Date(moment().add(12, 'months').format())}
                  textColor="white"
                  fadeToColor="#151515"
                  style={{ backgroundColor: '#151515', width, marginBottom: 10 }}
                  date={initialTime}
                  onDateChange={date => {
                    handleTimePicked(date);
                  }}
                />
              ) : null}
            </>
          )}

          <Block middle>
            <TouchableOpacity
              onPress={() => {
                openPaymentMethod(true, route.name, '');
              }}
              style={
                !registerScheduleTravel
                  ? { borderColor: '#ffae3b', borderWidth: 1, borderRadius: 10, paddingHorizontal: 10, paddingVertical: 10, width: '86%' }
                  : { borderColor: '#ffae3b', borderWidth: 1, borderRadius: 10, paddingHorizontal: 10, paddingVertical: 10, alignSelf: 'center', width: '80%' }
              }>
              <Block row style={{ alignItems: 'center' }}>
                <Icon name="credit-card" family="FontAwesome5" size={25} color="#ffae3b" style={{ marginHorizontal: moderateScale(25) }} />
                <Text bold color="#ffae3b">
                  {paymentMethod.selected !== '' ? paymentMethod.selected : 'Seleccionar método de pago'}
                </Text>
              </Block>
            </TouchableOpacity>
          </Block>
          <Block row middle style={{ marginBottom: 20 }}>
            <Button
              color="#ffae3b"
              shadowless
              disabled={loadingCalculate || loadingTravel || (notDriverModal && !registerScheduleTravel)}
              loading={loadingTravel}
              onPress={() => {
                !registerScheduleTravel ? newTravel() : newScheduleTravel();
              }}
              style={
                !registerScheduleTravel
                  ? { alignSelf: 'center', marginBottom: 20, width: '80%', borderRadius: 10, borderColor: 'red' }
                  : { alignSelf: 'center', marginBottom: 20, width: '40%', borderRadius: 10, borderColor: 'red' }
              }>
              <Text bold color="#262626">
                {!registerScheduleTravel ? 'Comenzar Viaje' : 'Programar viaje'}
              </Text>
            </Button>
            {!registerScheduleTravel && (
              <>
                <TouchableOpacity
                  style={{ marginBottom: 10, width: '40%', justifyContent: 'space-between' }}
                  onPress={() => {
                    // navigation.navigate('RegisterScheduleJourney');
                    setRegisterScheduleTravel(true);
                  }}>
                  <Text>Programar viaje</Text>
                  <CalendarIcon width={25} height={25} />
                </TouchableOpacity>
              </>
            )}
          </Block>
        </View>
      ) : null}
      <CustomMapView
        updateMagnetometer={updateMagnetometer}
        scheduleTravel={registerScheduleTravel}
        selectSheduleTravel={calculateSheduleTravel}
        mapRef={mapRef}
        initPosition={initPosition}
        setInitPosition={updateInitPosition}
        setFinalPosition={updateFinalPosition}
        GOOGLE_MAPS_APIKEY={GOOGLE_MAPS_APIKEY}
        selectDriver={selectDriver}
        nearbyDriversState={nearbyDriversState}
        finalPosition={finalPosition}
        setResult={setResult}
        userLocation={userLocation}
        fitToCoordinates={fitToCoordinates}
        fitToUserLocation={fitToUserLocation}
        vehiclePreSelected={vehiclePreSelected}
        vehicleSelected={vehicleSelected}
        setOnRoadDriverModal={setOnRoadDriverModal}
        compassDegrees={magnetometerState}
        user={user}
        setMapSnapshot={setMapSnapshot}
        currentTravel={currentTravel}
        setCoordinatesToClient={setCoordinatesToClient}
        setCoordinatesToDestination={setCoordinatesToDestination}
      />
      <RnModal animationType="fade" visible={searchModal} style={{ zIndex: 1 }} transparent>
        <TouchableWithoutFeedback onPress={() => {}} style={{ backgroundColor: 'rgba(0,0,0,0.3)' }}>
          <>
            <Block style={styles.searchBoxGradient}>
              <Button
                icon="chevron-left"
                style={styles.iconLeft}
                iconFamily="Feather"
                iconSize={24}
                onlyIcon
                iconColor="gray"
                color="white"
                onPress={() => openSearchModal(false)}
              />
              {/* <MobyYellowIcon width={moderateScale(200)} height={moderateScale(200)} style={styles.movyLogo} /> */}
              <Image source={require('../../assets/logoAmarillo.png')} style={styles.movyLogo} />
              <View style={{ alignSelf: 'flex-start', marginHorizontal: 20 }}>
                <Text color="#aaaaaa" size={17} numberOfLines={2}>
                  Elige donde quieres ir
                  <Text color="#ffae3b" bold>
                    {' '}
                    y nosotros nos encargamos del resto
                  </Text>
                </Text>
              </View>
              <View style={styles.infoContainer}>
                <Block style={{ zIndex: -1 }}>
                  <Block style={{ display: !myLocationsModal ? 'flex' : 'none' }}>
                    <GooglePlacesAutocomplete
                      placeholder="Posición Actual"
                      currentLocation={true}
                      currentLocationLabel="Posición Actual"
                      fetchDetails={false}
                      enablePoweredByContainer={false}
                      enableHighAccuracyLocation
                      disableScroll={false}
                      minLength={3}
                      // keyboardShouldPersistTaps="never"
                      // keepResultsAfterBlur={false}
                      isRowScrollable
                      onPress={(data: any) => {
                        updateInitPosition({ text: data.description ? data.description : `${data.name}, ${data.vicinity}`, coords: initPosition.coords });
                      }}
                      query={{
                        key: GOOGLE_MAPS_APIKEY,
                        language: 'es',
                        components: 'country:ve',
                      }}
                      textInputProps={{
                        placeholderTextColor: 'gray',
                        onChangeText: text => {
                          // if (!(text.length === 0 && initPosition.length > 10)) {
                          updateInitPosition({ text, coords: initPosition.coords });
                          // }
                        },
                        defaultValue: initPosition.text,
                        value: initPosition.text,
                      }}
                      styles={{
                        textInputContainer: { zIndex: 0 },
                        textInput: styles.textInput,
                        listView: [styles.listView, { top: 110 }],
                        description: styles.description,
                        row: styles.row,
                        separator: styles.separator,
                        loader: styles.loader,
                      }}
                    />
                  </Block>
                  <Block row>
                    <TextInput
                      ref={nameInput}
                      value={locationName}
                      style={[styles.favoriteLocationName, { display: !myLocationsModal ? 'none' : 'flex' }]}
                      placeholder="Nombre"
                      placeholderTextColor="gray"
                      autoCapitalize="none"
                      onChangeText={value => setLocationName(value)}
                    />
                    <Icon
                      family="Ionicons"
                      size={20}
                      name="edit"
                      color="#ffae3b"
                      style={{ position: 'absolute', top: moderateScale(30), right: moderateScale(35), display: !myLocationsModal ? 'none' : 'flex' }}
                    />
                  </Block>
                </Block>
                <Block style={{ marginTop: 60, marginBottom: 30, zIndex: -1 }}>
                  {!keepLocation ? (
                    <GooglePlacesAutocomplete
                      placeholder="¿A dónde vas?"
                      currentLocation={true}
                      currentLocationLabel="Posición Actual"
                      fetchDetails={false}
                      enablePoweredByContainer={false}
                      enableHighAccuracyLocation
                      isRowScrollable
                      disableScroll={false}
                      minLength={3}
                      // keepResultsAfterBlur={true}
                      // keyboardShouldPersistTaps="never"
                      onPress={(data: any) => {
                        console.log('PRESSED PLACES AUTOCOMPLETE', data);
                        updateFinalPosition({ text: data.description ? data.description : `${data.name}, ${data.vicinity}`, coords: finalPosition.coords });
                      }}
                      query={{
                        key: GOOGLE_MAPS_APIKEY,
                        language: 'es',
                        components: 'country:ve',
                      }}
                      textInputProps={{
                        placeholderTextColor: 'gray',
                        onChangeText: text => {
                          // if (!(text.length === 0 && finalPosition.length > 10)) {
                          if (myLocationsAutocomplete) {
                            setMyLocationsAutocomplete(false);
                          }
                          updateFinalPosition({ text, coords: finalPosition.coords });
                        },
                        defaultValue: myLocationsAutocomplete ? myLocationString.current : finalPosition.text,
                        value: myLocationsAutocomplete ? myLocationString.current : finalPosition.text,
                      }}
                      styles={{
                        textInputContainer: { backgroundColor: 'white' },
                        container: { backgroundColor: 'white', marginVertical: 20, paddingRight: 20 },
                        textInput: styles.textInputWithButtom,
                        listView: [styles.listView, { top: 30 }],
                        description: styles.description,
                        row: styles.row,
                        separator: styles.separator,
                        loader: styles.loader,
                      }}
                      renderRightButton={() => (
                        <TouchableOpacity
                          style={styles.iconDownMyLoc}
                          onPress={() => {
                            setMyLocationsModal(!myLocationsModal);
                            setLocationName('');
                          }}>
                          <Icon color="black" family="Feather" name={myLocationsModal ? 'chevron-up' : 'chevron-down'} size={24} />
                        </TouchableOpacity>
                      )}
                    />
                  ) : (
                    <GooglePlacesAutocomplete
                      placeholder="¿A dónde vas?"
                      currentLocation={true}
                      currentLocationLabel={keepLocationFinal}
                      fetchDetails={false}
                      enablePoweredByContainer={false}
                      enableHighAccuracyLocation
                      isRowScrollable
                      disableScroll={false}
                      minLength={3}
                      // keyboardShouldPersistTaps="never"
                      onPress={(data: any) => {
                        updateFinalPosition({ text: data.description ? data.description : `${data.name}, ${data.vicinity}`, coords: finalPosition.coords });
                      }}
                      query={{
                        key: GOOGLE_MAPS_APIKEY,
                        language: 'es',
                        components: 'country:ve',
                      }}
                      textInputProps={{
                        placeholderTextColor: 'gray',
                        defaultValue: keepLocationFinal,
                        value: keepLocationFinal,
                        onChangeText: text => {
                          // if (!(text.length === 0 && finalPosition.length > 10)) {
                          if (myLocationsAutocomplete) {
                            setMyLocationsAutocomplete(false);
                          }
                          updateFinalPosition({ text, coords: finalPosition.coords });
                          // }
                        },
                      }}
                      styles={{
                        textInputContainer: { backgroundColor: 'white' },
                        container: { backgroundColor: 'white', marginVertical: 20, paddingRight: 20 },
                        textInput: styles.textInputWithButtomFinal,
                        listView: [styles.listView, { top: 30 }],
                        description: styles.description,
                        row: styles.rowLocationFinal,
                        separator: styles.separator,
                        loader: styles.loader,
                      }}
                      renderRightButton={() => (
                        <Block style={{ flexDirection: 'row' }}>
                          <TouchableOpacity
                            style={styles.iconDownMyLocFinal}
                            onPress={() => {
                              setKeepLocationFinal('');
                            }}>
                            <Icon color="ligth" family="Feather" name={'x'} size={15} />
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={styles.iconDownMyLoc}
                            onPress={() => {
                              setMyLocationsModal(!myLocationsModal);
                              setLocationName('');
                            }}>
                            <Icon color="black" family="Feather" name={myLocationsModal ? 'chevron-up' : 'chevron-down'} size={24} />
                          </TouchableOpacity>
                        </Block>
                      )}
                    />
                  )}
                </Block>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'flex-end',
                  alignItems: 'flex-end',
                  marginHorizontal: 20,
                  zIndex: -1,
                }}>
                {/* <Button
                onlyIcon
                icon="clockcircleo"
                iconFamily="antdesign"
                iconSize={30}
                color="transparent"
                iconColor="white"
                style={{ width: 30, height: 30, alignSelf: 'center' }}
                onPress={() => {
                  navigation.navigate('RegisterScheduleJourney');
                  openSearchModal(false);
                }}
              /> */}
                <TouchableOpacity
                  onPress={() => {
                    !myLocationsModal ? onPressSearch() : createNewFavoriteLocation();
                  }}
                  disabled={loadingText}
                  style={{
                    alignSelf: 'flex-end',
                    backgroundColor: '#ffae3b',
                    paddingVertical: 12,
                    paddingHorizontal: 30,
                    borderRadius: 30,
                    marginVertical: 10,
                    zIndex: -1,
                  }}>
                  {loadingText ? <ActivityIndicator size="small" color="black" /> : <Text color="#262626">{!myLocationsModal ? 'Buscar' : 'Guardar'}</Text>}
                </TouchableOpacity>
              </View>
            </Block>
            {myLocationsModal && (
              <Block style={styles.locationModalContainer}>
                <Block style={{ height: height / 2.3 }} />
                <Block top style={{ paddingHorizontal: moderateScale(30) }}>
                  <Text color="#ffae3b" size={16} style={styles.directionsFontWeigth}>
                    Direcciones guardadas
                  </Text>
                </Block>
                {/* <Block>
                  <FlatList
                    style={{ marginTop: 20, height: moderateScale(160) }}
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}
                    data={favoriteLocations}
                    keyExtractor={(item: FavoriteLocation, i) => item._id + i}
                    renderItem={({ item, index }) => (
                      <FavoriteLocationsComponent
                        delete={removeFavoriteLocation}
                        edit={editFavoriteLocations}
                        item={item}
                        index={index}
                        total={favoriteLocationsCount}
                      />
                    )}
                    ListEmptyComponent={() => (
                      <Block middle style={{ paddingHorizontal: 20 }}>
                        <Text style={{ textAlign: 'center' }} bold size={18} color="lightgray">
                          Usted no posee ninguna ubicación favorita
                        </Text>
                      </Block>
                    )}
                  />
                </Block> */}
                <ScrollView style={{ marginTop: moderateScale(10) }}>
                  {favoriteLocations.length ? (
                    <Block style={{ marginTop: 20 }}>
                      {favoriteLocations.map((item, index) => (
                        <FavoriteLocationsComponent
                          setFavoriteToTravel={travelWithFavoriteLocation}
                          delete={removeFavoriteLocation}
                          edit={editFavoriteLocations}
                          item={item}
                          index={index}
                          total={favoriteLocationsCount}
                        />
                      ))}
                    </Block>
                  ) : (
                    <Block middle style={{ paddingHorizontal: 20 }}>
                      <Text style={{ textAlign: 'center' }} bold size={18} color="lightgray">
                        Usted no posee ninguna ubicación favorita
                      </Text>
                    </Block>
                  )}
                  <Block middle style={{ marginTop: 20 }}>
                    <TouchableOpacity
                      style={styles.bodyContentItem}
                      onPress={() => {
                        setLocationType('HOME');
                        setLocationName('Casa');
                        nameInput.current?.focus();
                      }}>
                      <Block style={{ paddingVertical: 10 }}>
                        <Block row style={{ marginLeft: 20, borderColor: 'white' }}>
                          <Icon family="Feather" name="home" color="#ffae3b" size={20} />
                          <Text color="#ffae3b" bold style={styles.bodyContentItemText}>
                            Añadir dirección de casa
                          </Text>
                        </Block>
                      </Block>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[styles.bodyContentItem, { marginTop: 20 }]}
                      onPress={() => {
                        setLocationType('OFFICE');
                        setLocationName('Oficina');
                        nameInput.current?.focus();
                      }}>
                      <Block style={{ paddingVertical: 10 }}>
                        <Block row style={{ marginLeft: 20, borderColor: 'white' }}>
                          <Icon family="Entypo" name="briefcase" color="#ffae3b" size={20} />
                          <Text color="#ffae3b" bold style={styles.bodyContentItemText}>
                            Añadir dirección de oficina
                          </Text>
                        </Block>
                      </Block>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[styles.bodyContentItem, { marginTop: 20 }]}
                      onPress={() => {
                        setLocationType('OTHER');
                        setLocationName('');
                        nameInput.current?.focus();
                      }}>
                      <Block style={{ paddingVertical: 10 }}>
                        <Block row style={{ marginLeft: 20, borderColor: 'white' }}>
                          <Icon family="Feather" name="heart" color="#ffae3b" size={20} />
                          <Text color="#ffae3b" bold style={styles.bodyContentItemText}>
                            Añadir otra dirección
                          </Text>
                        </Block>
                      </Block>
                    </TouchableOpacity>
                  </Block>
                  <Block style={{ height: moderateScale(30) }} />
                </ScrollView>
              </Block>
            )}
          </>
        </TouchableWithoutFeedback>
      </RnModal>

      {vehiclePreSelected && (
        <RnModal visible={driverModal} nativeID="1" animationType="fade" transparent>
          <Pressable
            onPress={() => {
              openDriverModal(false);
              setVehiclePreSelected(undefined);
            }}
            style={styles.modalContainer}>
            <Block style={styles.modalSubcontainer}>
              <Block row>
                <Block>
                  <Image
                    source={vehiclePreSelected.picture ? { uri: vehiclePreSelected.picture } : require('../../assets/movyLogo.png')}
                    style={styles.avatar}
                  />
                </Block>
                <Block>
                  <Block row>
                    <Block>
                      <Text color="black">Nombre</Text>
                      <Text bold size={18} color="black" style={styles.textName}>
                        {vehiclePreSelected.firstName}
                      </Text>
                    </Block>
                    <Block>
                      <Text color="black">Apellido</Text>
                      <Text bold size={18} color="black" style={styles.textName}>
                        {vehiclePreSelected.lastName}
                      </Text>
                    </Block>
                  </Block>
                  <Block style={{ marginVertical: 10 }} left>
                    <Text size={13} color="black">
                      Valoración
                    </Text>
                    <AirbnbRating
                      count={5}
                      size={16}
                      showRating={false}
                      defaultRating={vehiclePreSelected.ratingAverage}
                      isDisabled={true}
                      selectedColor="#ffae3b"
                      starContainerStyle={{
                        paddingVertical: 5,
                      }}
                    />
                  </Block>
                </Block>
              </Block>
              <Block row space="between" style={{ paddingHorizontal: 20, marginBottom: 10 }}>
                <Block style={{ width: '60%' }}>
                  <Text color="black">Vehículo</Text>
                  <Text bold color="black" size={16} style={{ marginTop: 5 }}>
                    {vehiclePreSelected.vehicle?.description}
                  </Text>
                </Block>
                <Block style={{ width: '40%' }}>
                  <Text color="black">Placa</Text>
                  <Text bold color="black" size={16} style={{ marginTop: 5, letterSpacing: 2 }}>
                    {vehiclePreSelected.vehicle?.licensePlate}
                  </Text>
                </Block>
              </Block>
              <Block row space="between" style={{ paddingHorizontal: 20, marginBottom: 10 }}>
                <Block style={{ width: '60%' }}>
                  <Text color="black">Tiempo estimado</Text>

                  <Text bold color="black" size={16} style={{ marginTop: 5 }}>
                    {Math.ceil(vehicleDuration ? vehicleDuration : 0)} min
                  </Text>
                </Block>
                <Block style={{ width: '40%' }}>
                  <Text color="black">Monto a pagar</Text>
                  <Block row style={{ marginTop: 5 }}>
                    <Icon name="pluscircle" family="AntDesign" size={16} color="#ffae3b" style={{ margin: 0, paddingTop: 3, marginRight: 5 }} />
                    <Text bold color="black" size={16}>
                      ${totalMount.toFixed(2)}
                    </Text>
                  </Block>
                </Block>
              </Block>
              <Block middle>
                <TouchableOpacity
                  onPress={() => {
                    openDriverModal(false);
                    if (paymentMethod.selected !== '') {
                      openVehiclesConfirm();
                    } else {
                      openPaymentMethod(true, route.name, '');
                    }
                  }}
                  style={styles.updateBtn}>
                  <Text color="black" bold size={16}>
                    Iniciar Viaje
                  </Text>
                </TouchableOpacity>
              </Block>
            </Block>
          </Pressable>
        </RnModal>
      )}
      {vehicleSelected && (
        <RnModal visible={onRoadDriverModal} nativeID="1" animationType="slide" transparent>
          <Pressable onPress={() => setOnRoadDriverModal(false)} style={styles.modalContainer}>
            <Block style={[styles.OnroadDriverBox, { width: orientation === 'PORTRAIT' ? width : width / 2 }]}>
              <LinearGradient
                style={{ borderTopLeftRadius: 25, borderTopRightRadius: 25 }}
                colors={['#ffe5c1', 'white']}
                start={{ x: 0.2, y: 0.1 }}
                end={{ x: 1.0, y: 1.0 }}
                locations={[0, 0.6]}>
                <Block row style={[styles.OnroadDriverBoxContainer, { paddingVertical: orientation === 'PORTRAIT' ? 25 : 25 - 10 }]}>
                  <Block>
                    <Image
                      source={vehicleSelected.picture ? { uri: vehicleSelected.picture } : require('../../assets/movyLogo.png')}
                      style={[
                        styles.avatarOnRoad,
                        {
                          width: orientation === 'PORTRAIT' ? 110 : 120 - responsiveHeight,
                          height: orientation === 'PORTRAIT' ? 110 : 120 - responsiveHeight,
                        },
                      ]}
                    />
                  </Block>
                  <Block>
                    <Block>
                      <Block row space="between" style={styles.namesContainer}>
                        <Block style={{ paddingHorizontal: 10 }}>
                          <Text size={14} color="black">
                            Nombre
                          </Text>
                          <Text bold size={18} color="black" style={{ marginTop: 5 }}>
                            {vehicleSelected.firstName}
                          </Text>
                        </Block>
                        <Block style={{ paddingHorizontal: 10 }}>
                          <Text size={14} color="black">
                            Apellido
                          </Text>
                          <Text bold size={18} color="black" style={{ marginTop: 5 }}>
                            {vehicleSelected.lastName}
                          </Text>
                        </Block>
                      </Block>
                      <Block row space="around" style={{ marginTop: 15 }}>
                        <Block>
                          <Text size={14} color="black">
                            Valoración
                          </Text>
                          <AirbnbRating
                            count={5}
                            size={13}
                            showRating={false}
                            defaultRating={vehicleSelected.ratingAverage}
                            isDisabled={true}
                            selectedColor="#ffae3b"
                            starContainerStyle={{
                              paddingVertical: 5,
                            }}
                          />
                        </Block>
                        <Block style={{ paddingVertical: 10 }}>
                          <TouchableOpacity onPress={() => goToChat()}>
                            {/* icono de mensajeria */}
                            <IconBadge
                              MainElement={<MessagesIcon color="gray" width={20} height={20} />}
                              BadgeElement={<Text style={{ color: '#FFFFFF' }}>10</Text>}
                              IconBadgeStyle={{ width: 20, height: 20, backgroundColor: 'red', left: 13, top: -8 }}
                              Hidden={0}
                            />
                          </TouchableOpacity>
                        </Block>
                      </Block>
                    </Block>
                  </Block>
                </Block>
              </LinearGradient>
              <Block style={{ width: width, borderBottomWidth: 0.5, borderColor: 'lightgray' }} />
              <Block row style={{ paddingTop: 10, paddingHorizontal: 30 }}>
                <Block style={{ marginRight: 20, maxWidth: '60%' }}>
                  <Text size={14} color="black">
                    Vehículo
                  </Text>
                  <Text bold size={18} color="black" style={{ marginTop: 10 }}>
                    {vehicleSelected.vehicle?.description}
                  </Text>
                </Block>
                <Block style={{ maxWidth: '60%' }}>
                  <Text size={14} color="black">
                    Placa
                  </Text>
                  <Text bold size={18} color="black" style={{ marginTop: 10 }}>
                    {vehicleSelected.vehicle?.licensePlate}
                  </Text>
                </Block>
              </Block>
              <Block left style={{ paddingTop: 10, paddingHorizontal: 30 }}>
                <Text color="black" size={12} italic>
                  Si tienes alguna preocupación o ves algo irregular
                </Text>
                <Text color="black" size={12} italic>
                  en tu viaje no dudes en usar el botón de pánico
                </Text>
              </Block>
              <Block middle style={{ paddingVertical: 15, paddingHorizontal: 30 }}>
                <TouchableOpacity
                  onPress={async () => {
                    // await cancelTravelRider();
                    Alert.alert('SOS', 'El viaje ha sido cancelado, llamando a la policía');
                  }}
                  style={styles.panicBtn}>
                  <Text bold size={18} color="black" style={{ textAlign: 'center' }}>
                    SOS
                  </Text>
                </TouchableOpacity>
                {currentTravel?.travelStatus === TravelStatuses.ACCEPTED_AND_ON_WAY && (
                  <Button
                    onPress={async () => {
                      await cancelTravelRider();
                      // hideTab(false);
                    }}
                    style={styles.cancelBtn}>
                    <Text bold size={18} color="black" style={{ textAlign: 'center' }}>
                      Cancelar Viaje
                    </Text>
                  </Button>
                )}
              </Block>
            </Block>
          </Pressable>
        </RnModal>
      )}
      <RnModal visible={paymentMethod.modal && paymentMethod.view === route.name} nativeID="1" animationType="fade" transparent>
        <Pressable onPress={() => openPaymentMethod(false, route.name, '')} style={styles.modalContainer}>
          <Block style={[styles.modalSubcontainer, { paddingVertical: 10 }]}>
            <TouchableOpacity
              style={styles.buttonPadding}
              onPress={() => {
                openPaymentMethod(false, route.name, 'Zelle');
                setFiscalInfoModalShow(true);

                // openVehiclesConfirm();
              }}>
              <Text color="black" bold>
                Zelle
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.buttonPadding}
              onPress={() => {
                openPaymentMethod(false, route.name, 'Credit Card');
                setCreditCardSelected(true);
              }}>
              <Text color="black" bold>
                Tarjeta de Crédito
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.buttonPadding}
              onPress={() => {
                openPaymentMethod(false, route.name, 'Pago Móvil');
                setFiscalInfoModalShow(true);

                // openVehiclesConfirm();
              }}>
              <Text color="black" bold>
                Pago Móvil
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.buttonPadding}
              onPress={() => {
                openPaymentMethod(false, route.name, 'Paypal');
                // openVehiclesConfirm();
                setFiscalInfoModalShow(true);
              }}>
              <Text color="black" bold>
                Paypal
              </Text>
            </TouchableOpacity>
          </Block>
        </Pressable>
      </RnModal>

      <RnModal visible={creditCardSelected} nativeID="1" animationType="fade" transparent>
        <Block style={styles.modalContainer}>
          <Block style={[styles.modalSubcontainer, { paddingVertical: 20, paddingHorizontal: 10 }]}>
            <Block style={{ paddingHorizontal: 10 }}>
              <Text color="gray">Tarjetas</Text>
            </Block>

            <Block style={{ width: '100%' }}>
              <FlatList
                data={[]}
                scrollEnabled={false}
                nestedScrollEnabled
                renderItem={({ item }) => <CreditCardComponent mapScreen item={item} />}
                ListEmptyComponent={() => (
                  <Block style={styles.emptyContainer}>
                    <Text color="gray" size={16} style={styles.emptyText}>
                      Agregue su tarjeta de crédito
                    </Text>
                  </Block>
                )}
                ListFooterComponent={() => (
                  <>
                    <Block style={{ paddingHorizontal: 20 }}>
                      <TouchableOpacity onPress={() => openVehiclesConfirm()}>
                        <Text size={15} color="#ffab3b" bold>
                          + Añadir tarjeta
                        </Text>
                      </TouchableOpacity>
                    </Block>
                  </>
                )}
              />
            </Block>
            <Block row bottom style={{ paddingHorizontal: 20, paddingVertical: 10 }}>
              <TouchableOpacity
                onPress={() => {
                  setCreditCardSelected(false);
                  openPaymentMethod(true, route.name, '');
                }}>
                <Text size={15} color="gray" style={{ marginRight: 30 }}>
                  Cancelar
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setCreditCardSelected(false);
                  // openVehiclesConfirm();
                  setFiscalInfoModalShow(true);
                }}>
                <Text size={15} color="black" bold>
                  Aceptar
                </Text>
              </TouchableOpacity>
            </Block>
          </Block>
        </Block>
      </RnModal>

      <RnModal animationType="fade" visible={fiscalInfoModalShow} transparent>
        <Block style={styles.fiscalInfoModal}>
          <Block style={styles.fiscalInfoModalContainer}>
            <Block bottom style={{ marginBottom: 20 }}>
              <TouchableOpacity
                onPress={async () => {
                  setFiscalInfoModalShow(false);
                  openPaymentMethod(true, route.name, '');
                }}>
                <ExitIcon color="black" />
              </TouchableOpacity>
            </Block>
            <Block middle row style={{ marginVertical: 5 }}>
              <Text color="black">Llene sus datos para continuar por favor</Text>
            </Block>
            <Block middle row>
              <Text color="black">(Esta acción solo tendra que hacerla una vez)</Text>
            </Block>
            <Block middle style={styles.form}>
              <Block
                style={{
                  width: '100%',
                }}>
                <Input
                  placeholder="Nombre Completo"
                  placeholderTextColor="black"
                  onChangeText={value => {
                    onChange(value, 'name');
                  }}
                  style={styles.inputField}
                  color="black"
                  // editable={!isLoading}
                  autoCapitalize="none"
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
                  marginTop: moderateScale(5),
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
                  maxLength={12}
                  placeholderTextColor="black"
                  keyboardType="numeric"
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
              <Block
                style={{
                  width: '100%',
                  marginTop: moderateScale(5),
                }}>
                <Input
                  placeholder="Dirección fiscal"
                  placeholderTextColor="black"
                  onChangeText={value => onChange(value, 'fiscalAddress')}
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
              <Block
                style={{
                  width: '100%',
                  marginTop: moderateScale(5),
                }}>
                <Button
                  onPress={() => {
                    saveFiscalInfo();
                  }}
                  color="#ffae3b"
                  // loading={financingLoading}
                  style={{ borderRadius: 10, justifyContent: 'center', alignSelf: 'center', marginTop: 20, width: width / 1.2 }}>
                  <Text color="black" size={16} bold>
                    Guardar
                  </Text>
                </Button>
              </Block>
            </Block>
          </Block>
        </Block>
      </RnModal>

      <RnModal visible={processingPaymentModal} nativeID="1" animationType="fade" transparent>
        <Block style={styles.modalContainerProceser}>
          <Block style={[styles.modalProcesserSubcontainer, { height: 200 }]} />
          <Block style={{ position: 'absolute' }}>
            <ActivityIndicator style={{ marginTop: 30 }} size="large" color="#e9ba6f" />
            <Text style={{ marginTop: 30 }} color="black" size={15}>
              Tu pago esta siendo verificado
            </Text>
          </Block>
        </Block>
      </RnModal>

      {currentTravel && (
        <RnModal visible={confirmTravelModal} nativeID="1" animationType="fade" transparent>
          <Block style={styles.modalContainerProceser}>
            <Block style={[styles.modalProcesserSubcontainer, { paddingVertical: 40, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20 }]}>
              <Text color="black" style={{ textAlign: 'center' }} size={15}>
                Esperando que el conductor acepte el viaje, espere un momento por favor, esto podría demorar unos minutos
              </Text>
              <CartIcon color="gray" style={{ marginVertical: 20 }} />
              <Button
                onPress={async () => {
                  await cancelTravelRider();
                }}
                style={styles.cancelBtn}>
                <Text bold size={18} color="black" style={{ textAlign: 'center' }}>
                  Cancelar la búsqueda
                </Text>
              </Button>
            </Block>
          </Block>
        </RnModal>
      )}
      <RnModal visible={driversNotFoundModal} nativeID="1" animationType="fade" transparent>
        <Block style={styles.modalContainerProceser}>
          <Block
            style={[
              styles.modalProcesserSubcontainer,
              { paddingTop: 40, paddingBottom: 20, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20 },
            ]}>
            <Text color="black" style={{ textAlign: 'center' }} size={16} bold>
              En estos momentos no se ha encontrado ningún conductor disponible
            </Text>
            <Text color="black" style={{ textAlign: 'center' }} size={16} bold>
              ¿Desea programar el viaje?
            </Text>
            {/* <CartIcon color="gray" style={{ marginVertical: 20 }} /> */}
            <Block row middle space="between" style={{ marginTop: 40, width: '100%' }}>
              <TouchableOpacity
                onPress={async () => {
                  scheduleTravel();
                  setDriversNotFoundModal(false);
                  setRegisterScheduleTravel(true);
                  setVehicleSchedule(vehicleTypes[0]);
                  hideTab(true);
                }}
                style={styles.btn}>
                <Text bold size={16} color="black" style={{ textAlign: 'center' }}>
                  Programar viaje
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={async () => {
                  setDriversNotFoundModal(false);
                }}>
                <Text size={14} color="black" style={{ textAlign: 'center' }}>
                  Cancelar
                </Text>
              </TouchableOpacity>
            </Block>
          </Block>
        </Block>
      </RnModal>
      <RnModal visible={scheduleTravelConfirmModal} nativeID="1" animationType="fade" transparent>
        <Block style={styles.modalContainerProceser}>
          <Block style={[styles.modalProcesserSubcontainer, { paddingVertical: 40, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20 }]}>
            <TouchableOpacity
              style={{ position: 'absolute', right: 20, top: 20 }}
              onPress={async () => {
                closeScheduleTravelModal(false);
                hideTab(false);
              }}>
              <ExitIcon color="black" />
            </TouchableOpacity>
            <Icon family="Feather" name="check-circle" color="#ffae3b" size={50} />
            <Text color="black" style={{ textAlign: 'center', marginTop: 10, paddingHorizontal: 30, fontWeight: '800' }} size={20}>
              ¡Su viaje ha sido programado con éxito!
            </Text>
            <Text color="black" style={{ marginTop: 10 }}>{`${moment(journeyDate).format('DD/MM/YYYY')} ${moment(initialTime).format('hh:mm a')} `}</Text>
          </Block>
        </Block>
      </RnModal>
      <RnModal visible={messageModal.show} nativeID="1" animationType="fade" transparent>
        <Block style={styles.modalContainerProceser}>
          <Block style={[styles.modalProcesserSubcontainer, { paddingVertical: 40, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20 }]}>
            <TouchableOpacity
              style={{ position: 'absolute', right: 20, top: 20 }}
              onPress={async () => {
                setMessageModal({
                  show: false,
                  message: '',
                  title: '',
                });
                hideTab(false);
              }}>
              <ExitIcon color="black" />
            </TouchableOpacity>
            <Text color="black" style={{ textAlign: 'center' }} size={16} bold>
              {messageModal.title}
            </Text>
            <Text color="black" style={{ textAlign: 'center', marginTop: 10, paddingHorizontal: 30, fontWeight: '800' }} size={20}>
              {messageModal.message}
            </Text>
          </Block>
        </Block>
      </RnModal>

      {/* Modales del Driver */}
      {user && user.roles!.includes(UserRoles.DRIVER) && driverApplications && travelRider.travel ? (
        <>
          <RnModal visible={travelRider.modal} nativeID="1" animationType="slide" transparent>
            <Block style={styles.modalContainer}>
              <Block style={styles.travelRider}>
                <Block row style={styles.travelRiderContainer}>
                  <TouchableOpacity
                    onPress={async () => {
                      await rejectTravel(travelRider.travel!._id);
                      updateTravelRider({ modal: false, travel: undefined });
                    }}
                    style={{ position: 'absolute', right: 15, top: 10 }}>
                    <ExitIcon color="gray" />
                  </TouchableOpacity>
                  <Block
                    row
                    style={[
                      styles.originDestinationBox,
                      {
                        alignItems: 'center',
                        // elevation: 5,
                        borderRadius: 10,
                      },
                    ]}>
                    <FromTo width={60} height={60} style={styles.arrivedPointRider} />
                    <Block>
                      <View style={styles.originDestinationTravelFirstRow}>
                        <Text color="black" numberOfLines={5} size={12}>
                          {travelRider.travel.originString}
                        </Text>
                      </View>
                      <View style={styles.originDestinationTravelSecondRow}>
                        <Text color="black" numberOfLines={5} size={12}>
                          {travelRider.travel.destinationString}
                        </Text>
                      </View>
                    </Block>
                  </Block>
                </Block>
                <Block row middle style={{ marginBottom: 20 }}>
                  <Block row style={{ marginRight: 10 }}>
                    <DistanceIcon width={20} height={20} style={{ marginLeft: 10 }} />
                    <Text style={{ marginLeft: 5 }} color="black" size={13} bold>
                      {travelRider.travel.distance.toFixed(2)} km
                    </Text>
                  </Block>
                  <Block row style={{ marginRight: 10 }}>
                    <TimeIcon width={15} height={15} style={{ marginLeft: 10 }} />
                    <Text style={{ marginLeft: 5 }} color="black" size={13} bold>
                      {Math.ceil(travelRider.travel.estimatedTime)} min
                    </Text>
                  </Block>
                  <Block row style={{ marginRight: 10 }}>
                    <Dolar2Icon width={15} height={15} style={{ marginLeft: 10 }} />
                    <Text style={{ marginLeft: 5 }} color="black" size={13} bold>
                      ${travelRider.travel.price.toFixed(2)}
                    </Text>
                  </Block>
                </Block>
                <Block row style={styles.ClientInfoContainer}>
                  <View style={styles.triangle} />
                  <Block style={{ width, position: 'absolute' }}>
                    <Progress.Bar
                      progress={intervalCount / appConfig.apiConfig.timeOutDriverToAcceptTravel}
                      width={width}
                      color="#ffae3b"
                      borderColor="transparent"
                      borderWidth={0}
                      borderRadius={0}
                    />
                  </Block>
                  <Block>
                    <Image
                      source={require('../../assets/movyLogo.png')}
                      style={[
                        styles.avatarOnRoad,
                        {
                          width: orientation === 'PORTRAIT' ? 110 : 120 - responsiveHeight,
                          height: orientation === 'PORTRAIT' ? 110 : 120 - responsiveHeight,
                        },
                      ]}
                    />
                  </Block>
                  <Block>
                    <Block row space="between" style={[styles.namesContainer]}>
                      <Block style={{ paddingVertical: 10, paddingHorizontal: 10 }}>
                        <Text size={14} color="white">
                          Nombre
                        </Text>
                        <Text bold size={18} color="white" style={{ marginTop: 10 }}>
                          {travelRider.travel.client.firstName}
                        </Text>
                      </Block>
                      <Block style={{ paddingVertical: 10, paddingHorizontal: 10 }}>
                        <Text size={14} color="white">
                          Apellido
                        </Text>
                        <Text bold size={18} color="white" style={{ marginTop: 10 }}>
                          {travelRider.travel.client.lastName}
                        </Text>
                      </Block>
                    </Block>
                    <Block row>
                      <Block style={{ paddingHorizontal: 10 }}>
                        <Text size={14} color="white">
                          Valoración
                        </Text>
                        <AirbnbRating
                          count={5}
                          size={13}
                          showRating={false}
                          defaultRating={travelRider.travel.client.ratingAverage}
                          isDisabled={true}
                          selectedColor="#ffae3b"
                          starContainerStyle={{
                            paddingVertical: 5,
                          }}
                        />
                      </Block>
                    </Block>
                  </Block>
                </Block>
                <Block middle style={{ paddingVertical: 30, paddingHorizontal: 30, backgroundColor: '#222222' }}>
                  <Button loading={acceptTravelLoading} color="#ffae3b" shadowless onPress={() => acceptTravel()} style={styles.cancelBtn}>
                    <Text bold size={18} color="black" style={{ textAlign: 'center' }}>
                      Aceptar Viaje
                    </Text>
                  </Button>
                </Block>
              </Block>
            </Block>
          </RnModal>
        </>
      ) : null}
      {/* modal del driver */}
      {user && user.roles!.includes(UserRoles.DRIVER) && currentTravel ? (
        <>
          <RnModal visible={travelModal} nativeID="1" animationType="slide" transparent>
            <Pressable onPress={() => openTravelModal(false)} style={styles.modalContainer}>
              <Block style={[styles.OnroadDriverBox, { width: orientation === 'PORTRAIT' ? width : width / 2 }]}>
                <LinearGradient
                  style={{ borderTopLeftRadius: 25, borderTopRightRadius: 25 }}
                  colors={['#ffe5c1', 'white']}
                  start={{ x: 0.2, y: 0.1 }}
                  end={{ x: 1.0, y: 1.0 }}
                  locations={[0, 0.6]}>
                  <Block row style={[styles.OnroadDriverBoxContainer, { paddingVertical: orientation === 'PORTRAIT' ? 25 : 25 - 10 }]}>
                    <Block>
                      {currentTravel && currentTravel.client && currentTravel.client.picture && (
                        <Image
                          source={currentTravel.client.picture ? { uri: currentTravel.client.picture } : require('../../assets/movyLogo.png')}
                          style={[
                            styles.avatarOnRoad,
                            {
                              width: orientation === 'PORTRAIT' ? 110 : 110,
                              height: orientation === 'PORTRAIT' ? 110 : 110,
                            },
                          ]}
                        />
                      )}
                    </Block>
                    <Block>
                      <Block>
                        <Block row space="between" style={styles.namesContainer}>
                          <Block style={{ paddingHorizontal: 10 }}>
                            <Text size={14} color="black">
                              Nombre
                            </Text>
                            <Text bold size={18} color="black" style={{ marginTop: 5 }}>
                              {currentTravel.client.firstName}
                            </Text>
                          </Block>
                          <Block style={{ paddingHorizontal: 10 }}>
                            <Text size={14} color="black">
                              Apellido
                            </Text>
                            <Text bold size={18} color="black" style={{ marginTop: 5 }}>
                              {currentTravel.client.lastName}
                            </Text>
                          </Block>
                        </Block>
                        <Block row space="around" style={{ marginTop: 15 }}>
                          <Block>
                            <Text size={14} color="black">
                              Valoración
                            </Text>
                            <AirbnbRating
                              count={5}
                              size={13}
                              showRating={false}
                              defaultRating={currentTravel.client.ratingAverage}
                              isDisabled={true}
                              selectedColor="#ffae3b"
                              starContainerStyle={{
                                paddingVertical: 5,
                              }}
                            />
                          </Block>
                          <Block style={{ paddingVertical: 10 }}>
                            <TouchableOpacity onPress={() => goToChat()}>
                              <IconBadge
                                MainElement={<MessagesIcon color="gray" width={20} height={20} />}
                                BadgeElement={<Text style={{ color: '#FFFFFF' }}>10</Text>}
                                IconBadgeStyle={{ width: 20, height: 20, backgroundColor: 'red', left: 13, top: -8 }}
                                Hidden={0}
                              />
                            </TouchableOpacity>
                          </Block>
                        </Block>
                      </Block>
                    </Block>
                  </Block>
                </LinearGradient>
                <Block style={{ borderBottomWidth: 0.5, borderColor: 'lightgray' }} />
                {/* <Block row style={{ paddingTop: 10, paddingHorizontal: 30 }}>
                <Block style={{ marginRight: 20 }}>
                  <Text size={14} color="black">
                    Vehículo
                  </Text>
                  <Text bold size={18} color="black" style={{ marginTop: 10, textAlign: 'center' }}>
                    {currentTravel.client.vehicle?.description}
                  </Text>
                </Block>
                <Block>
                  <Text size={14} color="black">
                    Placa
                  </Text>
                  <Text bold size={18} color="black" style={{ marginTop: 10, textAlign: 'center' }}>
                    {currentTravel.client.vehicle?.licensePlate}
                  </Text>
                </Block>
              </Block> */}
                <Block left style={{ paddingTop: 10, paddingHorizontal: 30 }}>
                  <Text color="black" size={12} italic>
                    Si tienes alguna preocupación o ves algo irregular
                  </Text>
                  <Text color="black" size={12} italic>
                    en tu viaje no dudes en usar el botón de pánico
                  </Text>
                </Block>
                <Block middle style={{ paddingVertical: 15, paddingHorizontal: 30 }}>
                  <TouchableOpacity
                    onPress={async () => {
                      Alert.alert('SOS', 'Boton de panico');
                    }}
                    style={styles.panicBtn}>
                    <Text bold size={18} color="black" style={{ textAlign: 'center' }}>
                      SOS
                    </Text>
                  </TouchableOpacity>
                  {/* <TouchableOpacity
                    onPress={async () => {
                      await cancelTravelRider();
                    }}
                    style={styles.cancelBtn}>
                    <Text bold size={18} color="black" style={{ textAlign: 'center' }}>
                      Cancelar Viaje
                    </Text>
                  </TouchableOpacity> */}
                  <Button
                    loading={startTravelLoading}
                    onPress={async () => {
                      setStartTravelLoading(true);
                      await travelRiderState();
                      setStartTravelLoading(false);
                      openTravelModal(false);
                    }}
                    style={styles.cancelBtn}>
                    <Text bold size={18} color="black" style={{ textAlign: 'center' }}>
                      {currentTravel.travelStatus === TravelStatuses.ACCEPTED_AND_ON_WAY
                        ? 'Iniciar Viaje'
                        : currentTravel.travelStatus === TravelStatuses.STARTED
                        ? 'Finalizar Viaje'
                        : 'Iniciar Viaje'}
                    </Text>
                  </Button>
                </Block>
              </Block>
            </Pressable>
          </RnModal>
        </>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  subContainer: {
    zIndex: 100,
    position: 'absolute',
    top: 30,
    left: 30,
  },
  topBackButton: {
    width: 30,
    height: 30,
  },
  originDestinationBox: {
    width: '100%',
    alignSelf: 'center',
  },

  originDestinationBoxFirstRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 10,
    width: '90%',
  },

  originDestinationBoxSecondRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '90%',
    marginBottom: 20,
    marginTop: 10,
  },

  arrivedPoint: {
    paddingHorizontal: 20,
    marginTop: 5,
  },

  notificationInfoRow: {
    marginLeft: 60,
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
    width: '90%',
  },
  vehiclesContainer: {
    position: 'absolute',
    top: moderateScale(25),
    // alignItems: 'center',
    zIndex: 100,
    left: 0,
    right: 0,
    marginHorizontal: 15,
    opacity: 0.9,
    backgroundColor: '#222222',
    borderRadius: 10,
  },
  vehiclesConfirmBox: {
    position: 'absolute',
    backgroundColor: '#151515',
    width,
    zIndex: 200,
    bottom: 0,
    borderTopRightRadius: 25,
    borderTopLeftRadius: 25,
  },

  //Confirmed Modal
  OnroadDriverBox: {
    position: 'absolute',
    backgroundColor: 'white',
    zIndex: 99,
    bottom: 0,
    borderTopRightRadius: 25,
    borderTopLeftRadius: 25,
  },

  OnroadDriverBoxContainer: {
    paddingHorizontal: 30,
    borderTopRightRadius: 25,
    borderTopLeftRadius: 25,
  },

  fiscalInfoModal: {
    position: 'absolute',
    backgroundColor: 'white',
    width,
    // height: height / 2,
    zIndex: 99,
    bottom: 0,
    borderTopRightRadius: 25,
    borderTopLeftRadius: 25,
  },

  fiscalInfoModalContainer: {
    paddingVertical: 25,
    paddingHorizontal: 30,
    borderTopRightRadius: 25,
    borderTopLeftRadius: 25,
  },

  form: {
    alignItems: 'center',
    marginVertical: moderateScale(10),
    width: '100%',
  },

  inputField: {
    height: moderateScale(45),
    borderColor: '#ffae3b',
    borderWidth: 1,
    borderRadius: 10,
  },

  dropdownSelec: {
    width: '15%',
    height: moderateScale(43),
    backgroundColor: '#ffecd1',
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
  },

  avatarOnRoad: {
    borderRadius: 20,
    marginRight: 30,
  },

  namesContainer: {
    width: '80%',
    justifyContent: 'flex-start',
  },

  panicBtn: {
    // marginTop: 20,
    backgroundColor: '#ff6766',
    paddingHorizontal: 10,
    paddingVertical: 15,
    borderRadius: 10,
    width: '100%',
    elevation: 2,
  },
  cancelBtn: {
    marginTop: 15,
    backgroundColor: '#ffae3b',
    paddingHorizontal: 10,
    // paddingVertical: 10,
    borderRadius: 10,
    width: '100%',
    elevation: 2,
  },

  btn: {
    // marginTop: 15,
    backgroundColor: '#ffae3b',
    paddingHorizontal: 10,
    paddingVertical: 15,
    borderRadius: 10,
    // width: '100%',
    elevation: 2,
  },

  vehiclesConfirmBoxData: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
  },

  searchBoxGradient: {
    backgroundColor: '#262626',
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    opacity: 0.95,
    zIndex: 1,
  },
  movyLogo: {
    // marginTop: moderateScale(-45),
    // marginBottom: moderateScale(-50),
    width: moderateScale(150),
    height: moderateScale(120),
    marginLeft: 20,
    alignSelf: 'center',
    resizeMode: 'contain',
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
  avatar: {
    width: 110,
    height: 110,
    borderRadius: 20,
    marginHorizontal: 20,
  },
  textName: {
    marginTop: 10,
    marginRight: 20,
  },
  //Credit Card Modal
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
  btnAddContainer: {
    backgroundColor: '#ffae3b',
    justifyContent: 'center',
    alignSelf: 'flex-end',
    paddingVertical: 10,
    borderRadius: 15,
    paddingHorizontal: 20,
  },
  //Payment Procesing
  modalContainerProceser: {
    flex: 1,
    backgroundColor: 'rgba(1,1,1, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalProcesserSubcontainer: {
    width: moderateScale(330),
    // height: moderateScale(600),
    alignSelf: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 10,
    borderRadius: 20,
    marginTop: moderateScale(20),
  },
  paymentBoxContainer: {
    paddingTop: 40,
    paddingHorizontal: 30,
    borderTopRightRadius: 25,
    borderTopLeftRadius: 25,
  },
  updateBtn: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '90%',
    height: 60,
    marginTop: 20,
    backgroundColor: '#ffae3b',
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 10,
  },
  searchButton: {
    position: 'absolute',
    top: moderateScale(60),
    left: 0,
    right: 0,
    zIndex: 100,
    marginHorizontal: 15,
    backgroundColor: '#222222',
    borderRadius: 15,
    opacity: 0.9,
    height: 50,
  },
  iconDown: {
    backgroundColor: '#ffae3b',
    borderTopRightRadius: 15,
    borderBottomRightRadius: 15,
    height: 50,
    width: 50,
  },
  iconDownMyLoc: {
    justifyContent: 'center',
    alignItems: 'center',
    // alignSelf: 'flex-end',
    // right: moderateScale(20),
    // top: moderateScale(20),
    backgroundColor: '#fecd8a',
    borderTopRightRadius: 9,
    borderBottomRightRadius: 9,
    height: 45,
    width: 50,
  },
  iconDownMyLocFinal: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#262626',
    color: 'lightgray',
    borderRightWidth: 0.5,
    borderTopWidth: 0.5,
    borderBottomWidth: 0.5,
    borderLeftWidth: 0,
    borderColor: 'gray',
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
    height: 45,
    width: 30,
  },
  vehicleSpacing: {
    height: 30,
    backgroundColor: '#232323',
    width: 0.5,
    marginHorizontal: 10,
    marginVertical: 7,
  },
  iconLeft: {
    width: 30,
    height: 30,
    position: 'absolute',
    top: 30,
    left: 30,
  },
  infoContainer: {
    // flexDirection: 'column',
    // justifyContent: 'space-between',
    // alignItems: 'center',
    // marginHorizontal: 20,
    // marginTop: 10,
    zIndex: 0,
  },
  buttonPadding: {
    padding: 15,
  },
  tabButtons: {
    zIndex: 1,
    backgroundColor: '#222222',
    width: 50,
    height: 50,
    position: 'absolute',
    right: 0,
    borderTopLeftRadius: 15,
    borderBottomLeftRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0.98,
  },
  paymentButton: {
    zIndex: 1,
    backgroundColor: '#ffae3b',
    width: 50,
    height: 50,
    position: 'absolute',
    right: 0,
    borderTopLeftRadius: 15,
    borderBottomLeftRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0.98,
  },
  filterButton: {
    zIndex: 1,
    width: 50,
    height: 50,
    position: 'absolute',
    right: 0,
    borderTopLeftRadius: 15,
    borderBottomLeftRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textInput: {
    zIndex: -1,
    marginTop: 20,
    marginLeft: 20,
    marginRight: 20,
    borderRadius: 10,
    borderWidth: 0.5,
    borderColor: 'gray',
    padding: 10,
    fontSize: 14,
    backgroundColor: '#262626',
    color: 'lightgray',
    height: 45,
    width: '100%',
  },
  textInputWithButtom: {
    zIndex: -1,
    marginLeft: 20,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
    borderWidth: 0.5,
    borderColor: 'gray',
    padding: 10,
    fontSize: 14,
    backgroundColor: '#262626',
    color: 'lightgray',
    height: 45,
  },
  textInputWithButtomFinal: {
    zIndex: -1,
    marginLeft: 20,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
    borderLeftWidth: 0.5,
    borderRightWidth: 0,
    borderTopWidth: 0.5,
    borderBottomWidth: 0.5,
    borderColor: 'gray',
    padding: 10,
    fontSize: 14,
    backgroundColor: '#262626',
    color: 'lightgray',
    height: 45,
    width: '50%',
  },
  favoriteLocationName: {
    zIndex: -1,
    marginTop: 20,
    marginBottom: moderateScale(-100),
    marginLeft: 20,
    marginRight: 20,
    borderRadius: 10,
    borderWidth: 0.5,
    borderColor: 'gray',
    padding: 10,
    paddingRight: 40,
    fontSize: 14,
    backgroundColor: '#262626',
    color: 'gray',
    width: width / 1.12,
    height: 45,
  },
  listView: {
    zIndex: 200,
    marginTop: 20,
    fontSize: 14,
    color: '#262626',
    height: height / 2,
    position: 'absolute',
    top: 50,
    left: 20,
    right: 20,
  },
  description: {
    zIndex: 200,
    fontSize: 14,
    color: 'white',
  },
  row: {
    zIndex: 200,
    padding: 10,
    backgroundColor: '#222222',
    width: '100%',
    height: 50,
  },
  rowLocationFinal: {
    zIndex: 200,
    padding: 10,
    backgroundColor: '#222222',
    width: '50%',
    height: 50,
  },
  separator: {
    height: 0.5,
    width: '100%',
    backgroundColor: 'gray',
  },
  loader: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    height: 20,
  },
  //Rider styles
  travelRider: {
    position: 'absolute',
    backgroundColor: 'white',
    width,
    zIndex: 99,
    bottom: 0,
    borderTopRightRadius: 25,
    borderTopLeftRadius: 25,
  },

  travelRiderContainer: {
    paddingTop: 20,
    paddingHorizontal: 20,
    borderTopRightRadius: 25,
    borderTopLeftRadius: 25,
  },
  triangle: {
    width: 0,
    position: 'absolute',
    right: moderateScale(170),
    top: moderateScale(-13),
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderTopWidth: 0,
    borderRightWidth: 10,
    borderBottomWidth: moderateScale(13),
    borderLeftWidth: 10,
    borderTopColor: 'transparent',
    borderRightColor: 'transparent',
    borderLeftColor: 'transparent',
    borderBottomColor: '#222222',
    zIndex: 100,
  },
  originDestinationTravelFirstRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    // marginLeft: -10,
    marginBottom: 20,
    width: '80%',
    flexWrap: 'wrap',
  },
  originDestinationTravelSecondRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '80%',
    marginBottom: 20,
    // marginLeft: -10,
    marginTop: 10,
    flexWrap: 'wrap',
  },
  arrivedPointRider: {
    paddingHorizontal: 10,
    marginBottom: 7,
  },
  ClientInfoContainer: {
    paddingTop: 20,
    paddingHorizontal: 30,
    backgroundColor: '#222222',
  },

  nameClientContainer: {
    width: '80%',
    justifyContent: 'center',
  },
  selectorContainer: {
    width: width,
    borderWidth: 1,
    borderTopColor: '#232323',
    borderBottomColor: '#232323',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  locationModalContainer: {
    backgroundColor: 'white',
    height,
    width,
    zIndex: 0,
    position: 'absolute',
    top: 0,
  },
  directionsFontWeigth: {
    fontWeight: '800',
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
    fontWeight: '800',
  },
});

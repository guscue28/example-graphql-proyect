import * as React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { mapReducer, MapState } from './mapReducer';
import { useSubscription } from '@apollo/client';
import AppConfigService from '../../appConfig/appConfig.service';
import { ReactNativeFile } from 'apollo-upload-client';
import {
  ACCEPT_TRAVEL,
  CANCEL_TRAVEL,
  CREATE_NEW_TRAVEL,
  FINISH_TRAVEL,
  GET_CURRENT_TRAVEL,
  GET_NEARBY_DRIVERS,
  START_TRAVEL,
  REJECT_TRAVEL,
  SUBSCRIBE_TRAVEL,
  SUB_TO_DRIVER_APPLICATIONS,
  RATE_TRAVEL,
  CREATE_NEW_SCHEDULED_TRAVEL,
  FIND_CLIENT_TRAVELS,
  FIND_DRIVER_TRAVELS,
  GET_SCHEDULED_TRAVELS,
  FIND_SPECIFIC_TRAVEL,
  ACCEPT_SCHEDULED_TRAVEL,
  MARK_AS_ON_WAY_SCHEDULED_TRAVEL,
  START_SCHEDULED_TRAVEL,
  FINISH_SCHEDULED_TRAVEL,
  CANCEL_SCHEDULED_TRAVEL,
  DRIVER_CANCEL_SCHEDULED_TRAVEL,
  GET_MY_ACCEPTED_SCHEDULED_TRAVELS,
} from '../../map/map.graphql';
import { getGraphqlError, getKilometros } from '../../../helpers';
import { RatingTypes, Travel, TravelStatuses } from '../../../interfaces/travel.interface';
import _ from 'lodash';
import { Location } from '../../../hooks/useLocation';
import { Location as mapLocation } from '../map.interface';
import { AllVehicleTypesConfig, User, UserOnlineStatuses, UserRoles } from '../../user/user.interface';
import { AuthContext } from '../../auth/context/authContext';
import { PaginationInput } from '../../chats/chat.interface';
import { MapDirectionsResponse } from 'react-native-maps-directions';
import { Steps } from '../../../interfaces/direcctionInterfaces';
import { AppConfigContext } from '../../appConfig/context/appConfigContext';
var alert = require('../../../assets/audio/alert.mp3');

var Sound = require('react-native-sound');
Sound.setCategory('Playback');
var notification = new Sound(alert, (error: any) => {
  if (error) {
    console.log('failed to load the sound', error);
    return;
  }
  console.log('duration in seconds: ' + notification.getDuration() + 'number of channels: ' + notification.getNumberOfChannels());
});
// import crashlytics from '@react-native-firebase/crashlytics';
type MapContextProps = {
  driverApplications?: Travel | undefined;
  currentTravel: Travel | undefined;
  nearbyDriversState: User[];
  searchModal: boolean;
  initPosition: {
    text: string;
    coords: Location | undefined;
  };
  finalPosition: {
    text: string;
    coords: Location | undefined;
  };
  driverModal: boolean;
  confirmTravelModal: boolean;
  paymentMethod: {
    modal: boolean;
    selected: string;
    view: string;
  };
  mapSnapshot: string;
  vehiclesConfirm: boolean;
  vehiclesPreSelected: User[];
  inmediateCarrer: boolean;
  vehiclePreSelected: User | undefined;
  vehicleSelected: User | undefined;
  scheduleTravelConfirmModal: boolean;
  magnetometerState: number;
  routeDistance: number;
  routeDuration: number;
  totalMount: number;
  vehicleDistance: number;
  vehicleDuration: number;
  vehicles: boolean;
  onRoadDriverModal: boolean;
  processingPaymentModal: boolean;
  creditCardSelected: boolean;
  travelRider: {
    modal: boolean;
    travel: Travel | undefined;
  };
  travelModal: boolean;
  result: MapDirectionsResponse | undefined;
  clientTravels: {
    travels: Travel[];
    count: number;
  };
  scheduledTravels: {
    travels: Travel[];
    count: number;
  };
  myAcceptedScheduledTravels: {
    travels: Travel[];
    count: number;
  };
  specificTravel: Travel | undefined;
  vehicleSchedule: AllVehicleTypesConfig | undefined;
  instructions: Steps[];
  intervalCount: number;
  getNearbyDrivers: (latitude: number, longitude: number) => Promise<User[] | undefined>;
  getCurrentTravel: () => Promise<void | Travel>;
  createNewTravel: (
    origin: mapLocation,
    destination: mapLocation,
    distance: number,
    estimatedTime: number,
    driver: string,
    vehicleType: string,
    originString: string,
    destinationString: string,
    screenShot: ReactNativeFile | null,
  ) => Promise<void | boolean>;
  acceptTravelRider: (travelId: string) => Promise<void | boolean>;
  startTravel: (travelId: string) => Promise<void | boolean>;
  finishTravel: (travelId: string) => Promise<void | boolean>;
  cancelTravel: (travelId?: string) => Promise<void | boolean>;
  createScheduledTravel: (
    destination: mapLocation,
    destinationString: string,
    distance: number,
    estimatedTime: number,
    origin: mapLocation,
    originString: string,
    scheduledDate: Date,
    vehicleType: string,
    screenShot: ReactNativeFile | null,
  ) => Promise<void | boolean>;
  acceptScheduledTravel: (travelId: string) => Promise<void | boolean>;
  markAsOnWayScheduledTravel: (travelId: string) => Promise<void | boolean>;
  startScheduledTravel: (travelId: string) => Promise<void | boolean>;
  finishScheduledTravel: (travelId: string) => Promise<void | boolean>;
  cancelScheduledTravel: (travelId: string) => Promise<void | boolean>;
  driverCancelScheduledTravel: (travelId: string) => Promise<void | boolean>;
  rejectTravel: (travelId: string) => Promise<void | boolean>;
  clearTravelRider: () => void;
  updateMagnetometer: (magnetometer: number) => void;
  selectionedDriver: (driverModal: boolean, driver: User, distance: number, duration: number, totalMount: number, vehiclesConfirm: boolean) => void;
  setNearbyDrivers: (nearbyDrivers: User[], vehicleSelected?: User) => void;
  updateInitPosition: (initPosition: { text: string; coords: Location | undefined }) => void;
  updateFinalPosition: (finalPosition: { text: string; coords: Location | undefined }) => void;
  updateCurrentTravelData: (
    initPosition: { text: string; coords: Location },
    finalPosition: { text: string; coords: Location },
    vehicles: boolean,
    routeDistance: number,
    routeDuration: number,
    confirmTravelModal: boolean,
    onRoadDriverModal: boolean,
    vehicleSelected?: User,
  ) => void;
  searchTravel: (
    initPosition: { text: string; coords: Location },
    finalPosition: { text: string; coords: Location },
    vehicles: boolean,
    searchModal: boolean,
  ) => void;
  openSearchModal: (searchModal: boolean) => void;
  openTravelModal: (travelModal: boolean) => void;
  closeVehiclesConfirm: () => void;
  openVehiclesConfirm: () => void;
  setVehiclePreSelected: (vehiclePreSelected?: User) => void;
  openPaymentMethod: (open: boolean, view: string, selected: string) => void;
  updateTravelRider: (travelRider: { modal: boolean; travel: Travel | undefined }) => void;
  setOnRoadDriverModal: (onRoadDriverModal: boolean) => void;
  setResult: (result: MapDirectionsResponse) => void;
  setMapSnapshot: (mapSnapshot: string) => void;
  openDriverModal: (driverModal: boolean) => void;
  setCreditCardSelected: (creditCardSelected: boolean) => void;
  rateTravel: (travelId: string, rating: number, message: string, type: RatingTypes) => Promise<void | string>;
  checkRateTravel: () => Promise<void>;
  cleanTravel: () => void;
  closeScheduleTravelModal: (open: boolean) => void;
  closeModals: () => void;
  getClientTravels: () => Promise<void>;
  getScheduledTravels: (latitude: number, longitude: number, pagination: PaginationInput) => Promise<void>;
  getMyAcceptedScheduledTravels: (pagination: PaginationInput) => Promise<void>;
  getSpecificTravel: (id: string) => Promise<void>;
  scheduleTravel: () => void;
  setVehicleSchedule: (vehicle: AllVehicleTypesConfig) => void;
  selectSheduleTravel: (distance: number, duration: number, total: number) => void;
};

const mapInitialState: MapState = {
  nearbyDriversState: [],
  searchModal: false,
  initPosition: {
    text: 'Posición Actual',
    coords: undefined,
  },
  finalPosition: {
    text: '',
    coords: undefined,
  },
  driverModal: false,
  paymentMethod: {
    modal: false,
    selected: '',
    view: '',
  },
  confirmTravelModal: false,
  mapSnapshot: '',
  vehiclesConfirm: false,
  vehiclesPreSelected: [],
  inmediateCarrer: false,
  vehiclePreSelected: undefined,
  vehicleSelected: undefined,
  magnetometerState: 0,
  routeDistance: 0,
  routeDuration: 0,
  totalMount: 0,
  vehicleDistance: 0,
  vehicleDuration: 0,
  vehicles: false,
  onRoadDriverModal: false,
  processingPaymentModal: false,
  creditCardSelected: false,
  travelRider: {
    modal: false,
    travel: undefined,
  },
  travelModal: false,
  result: undefined,
  driverApplications: undefined,
  currentTravel: undefined,
  scheduleTravelConfirmModal: false,
  clientTravels: {
    travels: [],
    count: 0,
  },
  scheduledTravels: {
    travels: [],
    count: 0,
  },
  myAcceptedScheduledTravels: {
    travels: [],
    count: 0,
  },
  specificTravel: undefined,
  vehicleSchedule: undefined,
  instructions: [],
};

export const MapContext = React.createContext({} as MapContextProps);

export const MapProvider = ({ children }: any) => {
  const { user, isAuth, apolloClient } = React.useContext(AuthContext);
  const { appConfig } = React.useContext(AppConfigContext);
  const [state, dispatch] = React.useReducer(mapReducer, mapInitialState);
  const suscribeToTravel = React.useRef<any>(null);
  const applicationInterval = React.useRef<any>(null);
  const [intervalCount, setIntervalCount] = React.useState(0);
  const appConfigService = new AppConfigService();

  React.useEffect(() => {
    notification.setVolume(1);
    return () => {
      notification.release();
    };
  }, []);
  const playPause = () => {
    notification.play((success: any) => {
      if (success) {
        console.log('successfully finished playing');
      } else {
        console.log('playback failed due to audio decoding errors');
      }
    });
  };
  const checkRateTravel = React.useCallback(async () => {
    const travel = await AsyncStorage.getItem('currentTravel');
    if (user && apolloClient && travel) {
      const travelData = JSON.parse(travel);
      console.log('mapContext.tsx -> checkRateTravel -> dispatch -> SET_CURRENT_TRAVEL');
      dispatch({
        type: 'SET_CURRENT_TRAVEL',
        payload: {
          currentTravel: travelData,
        },
      });
    }
  }, [user, apolloClient]);

  const getNearbyDrivers = async (latitude: number, longitude: number) => {
    // console.log('coordenadas', {
    //   variables: {
    //     longitude: longitude,
    //     latitude: latitude,
    //   },
    // });
    try {
      const { data } = await apolloClient.query({
        query: GET_NEARBY_DRIVERS,
        variables: {
          longitude: longitude,
          latitude: latitude,
        },
      });
      const drivers: User[] = data.getNearbyDrivers;
      const groupDrivers = _.groupBy(
        drivers.filter(d => d.vehicle?.vehicleType.name !== null),
        'vehicle.vehicleType.name',
      );
      const nearbyVehicles: User[] = [];
      for (const type in groupDrivers) {
        const vehicleType = groupDrivers[type];
        let vehicleNearby = vehicleType.sort((a, b) => {
          return (
            getKilometros(latitude, longitude, a.location!.coordinates[1], a.location!.coordinates[0]) -
            getKilometros(latitude, longitude, b.location!.coordinates[1], b.location!.coordinates[0])
          );
        });
        nearbyVehicles.push(vehicleNearby[0]);
      }
      // TODO: ordenar por tipo de vehiculo, agregar jerarquizacion por tipo
      if (nearbyVehicles.length > 0 && !state.currentTravel) {
        dispatch({
          type: 'SET_NEARBY_DRIVERS_INMEDIATE',
          payload: {
            nearbyDrivers: nearbyVehicles,
            inmediateCarrer: true,
            vehicleConfirm: true,
            nearbyDriversState: data.getNearbyDrivers,
          },
        });
      } else {
        dispatch({
          type: 'SET_NEARBY_DRIVERS_INMEDIATE',
          payload: {
            nearbyDrivers: [],
            inmediateCarrer: false,
            vehicleConfirm: false,
            nearbyDriversState: data.getNearbyDrivers,
          },
        });
      }
      return data.getNearbyDrivers;
    } catch (error) {
      console.log('error', error);
      getGraphqlError(error);
    }
  };

  const getCurrentTravel = async (): Promise<void | Travel> => {
    try {
      const { data } = await apolloClient!.query({ query: GET_CURRENT_TRAVEL, fetchPolicy: 'network-only' });
      console.log('mapContext.tsx -> getCurrentTravel -> dispatch -> SET_CURRENT_TRAVEL');
      dispatch({
        type: 'SET_CURRENT_TRAVEL',
        payload: {
          currentTravel: data.findUserTravelOnCourse,
        },
      });
      AsyncStorage.setItem('currentTravel', JSON.stringify(data.findUserTravelOnCourse));

      suscribeToTravel.current = apolloClient!
        .subscribe({
          query: SUBSCRIBE_TRAVEL,
          variables: { travelId: data.findUserTravelOnCourse._id },
        })
        .subscribe(res => {
          playPause();
          console.log('res travel Changed', res);
          if (res.data.travelChanged.travelStatus !== TravelStatuses.CANCELLED && res.data.travelChanged.travelStatus !== TravelStatuses.FINISHED) {
            console.log('mapContext.tsx -> getCurrentTravel Sub 1 -> dispatch -> SET_CURRENT_TRAVEL');
            dispatch({
              type: 'SET_CURRENT_TRAVEL',
              payload: {
                currentTravel: res.data.travelChanged,
              },
            });
            AsyncStorage.setItem('currentTravel', JSON.stringify(res.data.travelChanged));
          } else if (res.data.travelChanged.travelStatus === TravelStatuses.FINISHED) {
            console.log('mapContext.tsx -> getCurrentTravel Sub 2 -> dispatch -> SET_CURRENT_TRAVEL');
            dispatch({
              type: 'SET_CURRENT_TRAVEL',
              payload: {
                currentTravel: res.data.travelChanged,
              },
            });
            suscribeToTravel.current.unsubscribe();
          } else {
            dispatch({
              type: 'CANCEL_TRAVEL',
            });
            AsyncStorage.removeItem('currentTravel');
            suscribeToTravel.current.unsubscribe();
          }
        });
      return data.findUserTravelOnCourse;
    } catch (error) {
      console.log('mapContext.tsx -> getCurrentTravel error -> dispatch -> SET_CURRENT_TRAVEL');
      dispatch({
        type: 'SET_CURRENT_TRAVEL',
        payload: {
          currentTravel: undefined,
        },
      });
    }
  };
  useSubscription(SUB_TO_DRIVER_APPLICATIONS, {
    variables: {
      userId: user?._id,
    },
    skip: !(apolloClient && isAuth && user && user.roles!.includes(UserRoles.DRIVER) && user.onlineStatus === UserOnlineStatuses.ONLINE),
    onSubscriptionData: ({ subscriptionData }) => {
      console.log('DRIVER APPLICATIONS SUBSCRIPTION', subscriptionData);
      if (subscriptionData.data.driverApplications) {
        playPause();
        dispatch({
          type: 'SET_DRIVER_APPLICATIONS',
          payload: {
            driverApplications: subscriptionData.data.driverApplications,
          },
        });
        dispatch({
          type: 'SET_TRAVEL_RIDER',
          payload: {
            travelRider: {
              modal: true,
              travel: { ...subscriptionData.data.driverApplications! },
            },
          },
        });
        initInterval();
      }
    },
  });
  const initInterval = () => {
    let intervalData = 0;
    applicationInterval.current = setInterval(() => {
      if (intervalData < appConfig.apiConfig.timeOutDriverToAcceptTravel) {
        intervalData++;
        setIntervalCount(prev => prev + 1);
      } else {
        intervalData = 0;
        setIntervalCount(0);
        clearInterval(applicationInterval.current);
        dispatch({
          type: 'SET_TRAVEL_RIDER',
          payload: {
            travelRider: {
              modal: false,
              travel: undefined,
            },
          },
        });
      }
    }, 1000);
  };
  const createNewTravel = async (
    origin: mapLocation,
    destination: mapLocation,
    distance: number,
    estimatedTime: number,
    driver: string,
    vehicleType: string,
    originString: string,
    destinationString: string,
    screenShot: ReactNativeFile | null,
  ) => {
    console.log({ variables: { destination, distance, driver, estimatedTime, origin, vehicleType, destinationString, originString, routePicture: null } });

    let travelId = '';
    try {
      if (screenShot) {
        const token = await AsyncStorage.getItem('accessToken');
        const operation = new FormData();
        operation.append(
          'operations',
          JSON.stringify([
            {
              query: `
              mutation(
                $destination: LocationInput!
                $distance: Float!
                $driver: ObjectId!
                $estimatedTime: Float!
                $origin: LocationInput!
                $vehicleType: ObjectId!
                $destinationString: String!
                $originString: String!
                $routePicture: Upload
              ) {
                createNewTravel(
                  payload: {
                    destination: $destination
                    destinationString: $destinationString
                    originString: $originString
                    distance: $distance
                    driver: $driver
                    estimatedTime: $estimatedTime
                    origin: $origin
                    vehicleType: $vehicleType
                  }
                  routePicture: $routePicture
                ) {
                  _id
                  destination {
                    coordinates
                  }
                  origin {
                    coordinates
                  }
                  destinationString
                  originString
                  distance
                  estimatedTime
                  price
                  travelType
                  travelStatus
                  routePicture
                  createdAt
                }
              }
            `,
              variables: {
                destination: destination,
                distance: distance,
                driver: driver,
                estimatedTime: estimatedTime,
                origin: origin,
                vehicleType: vehicleType,
                originString: originString,
                destinationString: destinationString,
                routePicture: null,
              },
            },
          ]),
        );
        operation.append('map', JSON.stringify({ '0': ['0.variables.routePicture'] }));
        operation.append('0', screenShot);
        try {
          const { data } = await appConfigService.uploadFile(operation, token!);
          travelId = data.createNewTravel._id;
          console.log('mapContext.tsx -> createNewTravel -> dispatch -> SET_CURRENT_TRAVEL');
          dispatch({
            type: 'SET_CURRENT_TRAVEL',
            payload: {
              currentTravel: data.createNewTravel,
            },
          });
        } catch (error) {
          console.log(error);
          getGraphqlError(error);
        }
      } else {
        const { data } = await apolloClient!.mutate({
          mutation: CREATE_NEW_TRAVEL,
          variables: { destination, distance, driver, estimatedTime, origin, vehicleType, destinationString, originString, routePicture: null },
        });
        travelId = data.createNewTravel._id;
        console.log('mapContext.tsx -> createNewTravel mutation 2 -> dispatch -> SET_CURRENT_TRAVEL');
        dispatch({
          type: 'SET_CURRENT_TRAVEL',
          payload: {
            currentTravel: data.createNewTravel,
          },
        });
      }
      dispatch({
        type: 'CREATE_TRAVEL_DATA',
        payload: {
          confirmTravelModal: true,
          scheduleTravelConfirmModal: false,
          vehiclesConfirm: false,
          processingPaymentModal: false,
          vehicleSelected: state.vehiclePreSelected,
          vehiclePreSelected: undefined,
        },
      });
      suscribeToTravel.current = apolloClient!
        .subscribe({
          query: SUBSCRIBE_TRAVEL,
          variables: { travelId },
        })
        .subscribe(res => {
          playPause();
          console.log('res travel Changed', res);
          if (res.data.travelChanged.travelStatus !== TravelStatuses.CANCELLED && res.data.travelChanged.travelStatus !== TravelStatuses.FINISHED) {
            console.log('mapContext.tsx -> createNewTravel 3 -> dispatch -> SET_CURRENT_TRAVEL');
            dispatch({
              type: 'SET_CURRENT_TRAVEL',
              payload: {
                currentTravel: res.data.travelChanged,
              },
            });
            AsyncStorage.setItem('currentTravel', JSON.stringify(res.data.travelChanged));
          } else if (res.data.travelChanged.travelStatus === TravelStatuses.FINISHED) {
            console.log('mapContext.tsx -> createNewTravel 4 -> dispatch -> SET_CURRENT_TRAVEL');
            dispatch({
              type: 'SET_CURRENT_TRAVEL',
              payload: {
                currentTravel: res.data.travelChanged,
              },
            });
            suscribeToTravel.current.unsubscribe();
          } else {
            dispatch({
              type: 'CANCEL_TRAVEL',
            });
            AsyncStorage.removeItem('currentTravel');
            suscribeToTravel.current.unsubscribe();
          }
        });
    } catch (error: any) {
      console.log('error', error);
      return true;
    }
  };

  const createScheduledTravel = async (
    destination: mapLocation,
    destinationString: string,
    distance: number,
    estimatedTime: number,
    origin: mapLocation,
    originString: string,
    scheduledDate: Date,
    vehicleType: string,
    screenShot: ReactNativeFile | null,
  ) => {
    // let travelId = '';
    try {
      if (screenShot) {
        const token = await AsyncStorage.getItem('accessToken');
        const operation = new FormData();
        operation.append(
          'operations',
          JSON.stringify([
            {
              query: `
              mutation(
                $destination: LocationInput!
                $destinationString: String!
                $distance: Float!
                $estimatedTime: Float!
                $origin: LocationInput!
                $originString: String!
                $scheduledDate: Date!
                $vehicleType: ObjectId!
                $routePicture: Upload
              ) {
                createNewScheduledTravel(
                  payload: {
                    destination: $destination
                    destinationString: $destinationString
                    distance: $distance
                    estimatedTime: $estimatedTime
                    origin: $origin
                    originString: $originString
                    scheduledDate: $scheduledDate
                    vehicleType: $vehicleType
                  }
                  routePicture: $routePicture
                ) {
                  _id
                  destination {
                    coordinates
                  }
                  origin {
                    coordinates
                  }
                  destinationString
                  originString
                  distance
                  estimatedTime
                  startDate
                  finishDate
                  price
                  travelStatus
                  travelType
                  routePicture
                  createdAt
                }
              }
            `,
              variables: {
                destination: destination,
                distance: distance,
                estimatedTime: estimatedTime,
                origin: origin,
                vehicleType: vehicleType,
                originString: originString,
                scheduledDate: scheduledDate,
                destinationString: destinationString,
                routePicture: null,
              },
            },
          ]),
        );
        operation.append('map', JSON.stringify({ '0': ['0.variables.routePicture'] }));
        operation.append('0', screenShot);
        const { data } = await appConfigService.uploadFile(operation, token!);
        // travelId = data.createNewScheduledTravel._id;
        dispatch({
          type: 'SET_SCHEDULED_TRAVEL',
          payload: {
            scheduledTravel: data.createNewScheduledTravel,
          },
        });
      } else {
        const { data } = await apolloClient!.mutate({
          mutation: CREATE_NEW_SCHEDULED_TRAVEL,
          variables: { destination, distance, estimatedTime, origin, vehicleType, originString, scheduledDate, destinationString, routePicture: null },
        });
        // travelId = data.createNewScheduledTravel._id;
        dispatch({
          type: 'SET_SCHEDULED_TRAVEL',
          payload: {
            scheduledTravel: data.createNewScheduledTravel,
          },
        });
      }
      dispatch({
        type: 'CREATE_TRAVEL_DATA',
        payload: {
          confirmTravelModal: false,
          scheduleTravelConfirmModal: true,
          vehiclesConfirm: false,
          processingPaymentModal: false,
          vehicleSelected: undefined,
          vehiclePreSelected: undefined,
        },
      });
    } catch (error) {
      console.log('error', error);
      return true;
    }
  };

  const closeScheduleTravelModal = (open: boolean) => {
    dispatch({
      type: 'SCHEDULE_TRAVEL_MODAL',
      payload: {
        scheduleModal: open,
      },
    });
    dispatch({
      type: 'CANCEL_TRAVEL',
    });
  };

  const acceptTravelRider = async (travelId: string) => {
    try {
      await apolloClient!.mutate({
        mutation: ACCEPT_TRAVEL,
        variables: { travelId },
      });
      await getCurrentTravel();
      dispatch({
        type: 'SET_DRIVER_APPLICATIONS',
        payload: {
          driverApplications: undefined,
        },
      });
    } catch (error: any) {
      console.log('error', error);
      return true;
    }
  };

  const startTravel = async (travelId: string) => {
    try {
      // console.log('travelId', travelId)
      await apolloClient!.mutate({
        mutation: START_TRAVEL,
        variables: { travelId },
      });
      // console.log('start travel', data);
    } catch (error: any) {
      console.log('error', error);
      return true;
    }
  };

  const finishTravel = async (travelId: string) => {
    try {
      const { data } = await apolloClient!.mutate({
        mutation: FINISH_TRAVEL,
        variables: { travelId },
      });
      console.log(data);
    } catch (error: any) {
      console.log('error', error);
      return true;
    }
  };

  const cancelTravel = async (travelId?: string) => {
    try {
      suscribeToTravel.current.unsubscribe();
      await apolloClient!.mutate({
        mutation: CANCEL_TRAVEL,
        variables: { travelId: travelId ? travelId : state.currentTravel!._id },
      });
      dispatch({
        type: 'CANCEL_TRAVEL',
      });
      AsyncStorage.removeItem('currentTravel');
      // setCurrentTravel(undefined);
    } catch (error: any) {
      console.log('error', error);
      return true;
    }
  };

  const rejectTravel = async (travelId: string) => {
    try {
      await apolloClient!.mutate({
        mutation: REJECT_TRAVEL,
        variables: { travelId },
      });
      dispatch({
        type: 'SET_TRAVEL_RIDER',
        payload: {
          travelRider: {
            modal: false,
            travel: undefined,
          },
        },
      });
    } catch (error: any) {
      console.log('error', error);
      return true;
    }
  };

  const clearTravelRider = async () => {
    dispatch({
      type: 'CLEAR_TRAVEL_RIDER',
    });
  };

  const updateMagnetometer = (magnetometer: number) => {
    console.log('magnetometer', magnetometer);
    dispatch({
      type: 'UPDATE_MAGNETOMETER',
      payload: {
        magnetometer,
      },
    });
  };

  const selectionedDriver = (
    driverModal: boolean,
    driver: User,
    vehicleDistance: number,
    vehicleDuration: number,
    totalMount: number,
    vehiclesConfirm: boolean = true,
  ) => {
    dispatch({
      type: 'SET_SELECTIONED_DRIVER',
      payload: {
        driverModal,
        vehiclePreSelected: driver,
        vehicleDistance,
        vehicleDuration,
        vehiclesConfirm,
        totalMount,
      },
    });
  };

  const setNearbyDrivers = (nearbyDriversState: User[], vehicleSelected?: User) => {
    dispatch({
      type: 'SET_NEARBY_DRIVERS',
      payload: {
        nearbyDriversState,
        vehicleSelected: vehicleSelected,
      },
    });
  };

  const updateInitPosition = (initPosition: { text: string; coords: Location | undefined }) => {
    dispatch({
      type: 'UPDATE_INIT_POSITION',
      payload: {
        initPosition,
      },
    });
  };

  const updateFinalPosition = (finalPosition: { text: string; coords: Location | undefined }) => {
    dispatch({
      type: 'UPDATE_FINAL_POSITION',
      payload: {
        finalPosition,
      },
    });
  };

  const updateCurrentTravelData = (
    initPosition: { text: string; coords: Location },
    finalPosition: { text: string; coords: Location },
    vehicles: boolean,
    routeDistance: number,
    routeDuration: number,
    confirmTravelModal: boolean,
    onRoadDriverModal: boolean,
    vehicleSelected?: User,
  ) => {
    console.log('updateCurrentTravelData', routeDistance, routeDuration);

    dispatch({
      type: 'UPDATE_CURRENT_TRAVEL_DATA',
      payload: {
        initPosition,
        finalPosition,
        vehicles,
        routeDistance,
        routeDuration,
        confirmTravelModal,
        onRoadDriverModal,
        vehicleSelected,
      },
    });
    if (vehicleSelected) {
      dispatch({
        type: 'SET_NEARBY_DRIVERS',
        payload: {
          nearbyDriversState: [vehicleSelected],
          vehicleSelected: vehicleSelected,
        },
      });
    }
  };

  const searchTravel = async (
    initPosition: { text: string; coords: Location },
    finalPosition: { text: string; coords: Location },
    vehicles: boolean,
    searchModal: boolean,
  ) => {
    dispatch({
      type: 'ON_PRESS_SEARCH',
      payload: {
        initPosition,
        finalPosition,
        vehicles,
        searchModal,
      },
    });
  };

  const openSearchModal = (open: boolean) => {
    dispatch({
      type: 'SET_SEARCH_MODAL',
      payload: {
        searchModal: open,
        initPosition: { text: '', coords: undefined },
        finalPosition: { text: '', coords: undefined },
      },
    });
  };

  const openTravelModal = (open: boolean) => {
    dispatch({
      type: 'OPEN_TRAVEL_MODAL',
      payload: {
        travelModal: open,
      },
    });
  };

  const closeVehiclesConfirm = () => {
    dispatch({
      type: 'CLOSE_VEHICLES_CONFIRM',
    });
  };

  const openVehiclesConfirm = () => {
    dispatch({
      type: 'OPEN_VEHICLES_CONFIRM',
    });
  };

  const setVehiclePreSelected = (vehiclePreSelected?: User) => {
    dispatch({
      type: 'SET_VEHICLE_PRE_SELECTED',
      payload: {
        vehiclePreSelected,
      },
    });
  };

  const openPaymentMethod = (open: boolean, view: string, selected: string) => {
    dispatch({
      type: 'OPEN_PAYMENT_METHOD',
      payload: {
        open,
        view,
        selected,
      },
    });
  };

  const updateTravelRider = (travelRider: { modal: boolean; travel: Travel | undefined }) => {
    dispatch({
      type: 'SET_TRAVEL_RIDER',
      payload: {
        travelRider,
      },
    });
  };

  const setOnRoadDriverModal = (onRoadDriverModal: boolean) => {
    dispatch({
      type: 'SET_ON_ROAD_DRIVER_MODAL',
      payload: {
        onRoadDriverModal,
      },
    });
  };

  const setResult = (result: MapDirectionsResponse) => {
    const instructions = result.legs[0].steps.map((step: Steps) => {
      return { ...step, instructions: step.html_instructions.replace(/<[^>]*>/g, '') };
    });
    dispatch({
      type: 'SET_RESULT',
      payload: {
        result,
        instructions,
      },
    });
  };

  const setMapSnapshot = (mapSnapshot: string) => {
    dispatch({
      type: 'SET_MAP_SNAPSHOT',
      payload: {
        mapSnapshot,
      },
    });
  };

  const openDriverModal = (open: boolean) => {
    dispatch({
      type: 'SET_DRIVER_MODAL',
      payload: {
        driverModal: open,
      },
    });
  };

  const setCreditCardSelected = (creditCardSelected: boolean) => {
    dispatch({
      type: 'SET_CREDIT_CARD_SELECTED',
      payload: {
        creditCardSelected,
      },
    });
  };

  const rateTravel = async (travelId: string, rating: number, message: string, type: RatingTypes) => {
    try {
      await apolloClient!.mutate({
        mutation: RATE_TRAVEL,
        variables: { message, rating, travelId, type },
      });
      dispatch({
        type: 'CANCEL_TRAVEL',
      });
      AsyncStorage.removeItem('currentTravel');
    } catch (error: any) {
      return error.message;
    }
  };

  const cleanTravel = () => {
    dispatch({
      type: 'CANCEL_TRAVEL',
    });
    AsyncStorage.removeItem('currentTravel');
  };

  const closeModals = () => {
    dispatch({
      type: 'CLOSE_MODALS',
    });
  };

  const getClientTravels = async () => {
    try {
      const { data } = await apolloClient!.query({
        query: user?.roles?.includes(UserRoles.CLIENT) ? FIND_CLIENT_TRAVELS : FIND_DRIVER_TRAVELS,
        fetchPolicy: 'no-cache',
      });
      const travels = data.findClientTravels || data.findDriverTravels;
      dispatch({
        type: 'GET_CLIENT_TRAVELS',
        payload: {
          travels: travels,
          count: travels.length,
        },
      });
    } catch (error) {
      console.log(error);
      getGraphqlError(error);
    }
  };

  const getScheduledTravels = async (latitude: number, longitude: number, pagination: PaginationInput) => {
    try {
      const { data } = await apolloClient!.query({
        query: GET_SCHEDULED_TRAVELS,
        variables: {
          latitude: latitude,
          longitude: longitude,
          itemsPerPage: pagination.itemsPerPage,
          page: pagination.page,
          searchKey: pagination.searchKey,
        },
        fetchPolicy: 'no-cache',
      });
      dispatch({
        type: 'SET_SCHEDULED_TRAVELS',
        payload: {
          travels: data.getScheduledTravels.travels,
          count: data.getScheduledTravels.count,
        },
      });
    } catch (error) {
      console.log(error);
      getGraphqlError(error);
    }
  };

  const getMyAcceptedScheduledTravels = async (pagination: PaginationInput) => {
    try {
      const { data } = await apolloClient!.query({
        query: GET_MY_ACCEPTED_SCHEDULED_TRAVELS,
        variables: {
          itemsPerPage: pagination.itemsPerPage,
          page: pagination.page,
          searchKey: pagination.searchKey,
        },
        fetchPolicy: 'no-cache',
      });
      dispatch({
        type: 'SET_MY_ACCEPTED_SCHEDULED_TRAVELS',
        payload: {
          travels: data.getMyAcceptedScheduledTravels.travels,
          count: data.getMyAcceptedScheduledTravels.count,
        },
      });
    } catch (error) {
      console.log(error);
      getGraphqlError(error);
    }
  };

  const getSpecificTravel = async (id: string) => {
    try {
      const { data } = await apolloClient!.query({
        query: FIND_SPECIFIC_TRAVEL,
        variables: { _id: id },
        fetchPolicy: 'no-cache',
      });
      dispatch({
        type: 'FIND_SPECIFIC_TRAVEL',
        payload: {
          travel: data.findTravelById,
        },
      });
    } catch (error) {
      console.log(error);
      getGraphqlError(error);
    }
  };

  const scheduleTravel = () => {
    dispatch({
      type: 'SCHEDULE_TRAVEL',
    });
  };

  const setVehicleSchedule = (vehicle: AllVehicleTypesConfig) => {
    dispatch({
      type: 'SET_VEHICLE_SCHEDULE',
      payload: {
        vehicleSchedule: vehicle,
      },
    });
  };

  const selectSheduleTravel = (distance: number, duration: number, total: number) => {
    dispatch({
      type: 'SELECT_SCHEDULE_TRAVEL',
      payload: {
        distance,
        duration,
        total,
      },
    });
  };

  const acceptScheduledTravel = async (travelId: string) => {
    await apolloClient!.mutate({
      mutation: ACCEPT_SCHEDULED_TRAVEL,
      variables: { travelId },
    });
  };

  const markAsOnWayScheduledTravel = async (travelId: string) => {
    await apolloClient!.mutate({
      mutation: MARK_AS_ON_WAY_SCHEDULED_TRAVEL,
      variables: { travelId },
    });
    await getCurrentTravel();
    dispatch({
      type: 'SET_DRIVER_APPLICATIONS',
      payload: {
        driverApplications: undefined,
      },
    });
  };

  const startScheduledTravel = async (travelId: string) => {
    await apolloClient!.mutate({
      mutation: START_SCHEDULED_TRAVEL,
      variables: { travelId },
    });
  };

  const finishScheduledTravel = async (travelId: string) => {
    await apolloClient!.mutate({
      mutation: FINISH_SCHEDULED_TRAVEL,
      variables: { travelId },
    });
  };

  const cancelScheduledTravel = async (travelId: string) => {
    //esto se comento porque el suscribeToTravel.current esta dando error necesito saber para que existe esto
    // suscribeToTravel.current.unsubscribe();
    await apolloClient!.mutate({
      mutation: CANCEL_SCHEDULED_TRAVEL,
      variables: { travelId },
    });
    dispatch({
      type: 'CANCEL_TRAVEL',
    });
    AsyncStorage.removeItem('currentTravel');
  };

  const driverCancelScheduledTravel = async (travelId: string) => {
    await apolloClient!.mutate({
      mutation: DRIVER_CANCEL_SCHEDULED_TRAVEL,
      variables: { travelId },
    });
  };

  return (
    <MapContext.Provider
      value={{
        getNearbyDrivers,
        nearbyDriversState: state.nearbyDriversState,
        searchModal: state.searchModal,
        initPosition: state.initPosition,
        finalPosition: state.finalPosition,
        driverModal: state.driverModal,
        paymentMethod: state.paymentMethod,
        confirmTravelModal: state.confirmTravelModal,
        mapSnapshot: state.mapSnapshot,
        vehiclesConfirm: state.vehiclesConfirm,
        vehiclesPreSelected: state.vehiclesPreSelected,
        inmediateCarrer: state.inmediateCarrer,
        vehiclePreSelected: state.vehiclePreSelected,
        vehicleSelected: state.vehicleSelected,
        magnetometerState: state.magnetometerState,
        routeDistance: state.routeDistance,
        routeDuration: state.routeDuration,
        totalMount: state.totalMount,
        vehicleDistance: state.vehicleDistance,
        vehicleDuration: state.vehicleDuration,
        vehicles: state.vehicles,
        onRoadDriverModal: state.onRoadDriverModal,
        processingPaymentModal: state.processingPaymentModal,
        creditCardSelected: state.creditCardSelected,
        travelRider: state.travelRider,
        travelModal: state.travelModal,
        result: state.result,
        driverApplications: state.driverApplications,
        currentTravel: state.currentTravel,
        scheduleTravelConfirmModal: state.scheduleTravelConfirmModal,
        clientTravels: state.clientTravels,
        scheduledTravels: state.scheduledTravels,
        myAcceptedScheduledTravels: state.myAcceptedScheduledTravels,
        specificTravel: state.specificTravel,
        vehicleSchedule: state.vehicleSchedule,
        instructions: state.instructions,
        intervalCount,
        getCurrentTravel,
        createNewTravel,
        acceptTravelRider,
        startTravel,
        finishTravel,
        cancelTravel,
        rejectTravel,
        createScheduledTravel,
        acceptScheduledTravel,
        markAsOnWayScheduledTravel,
        startScheduledTravel,
        finishScheduledTravel,
        cancelScheduledTravel,
        driverCancelScheduledTravel,
        clearTravelRider,
        updateMagnetometer,
        selectionedDriver,
        setNearbyDrivers,
        updateInitPosition,
        updateFinalPosition,
        updateCurrentTravelData,
        searchTravel,
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
        rateTravel,
        checkRateTravel,
        cleanTravel,
        closeScheduleTravelModal,
        closeModals,
        getClientTravels,
        getScheduledTravels,
        getMyAcceptedScheduledTravels,
        getSpecificTravel,
        scheduleTravel,
        setVehicleSchedule,
        selectSheduleTravel,
      }}>
      {children}
    </MapContext.Provider>
  );
};

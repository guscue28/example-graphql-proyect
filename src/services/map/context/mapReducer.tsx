import { MapDirectionsResponse } from 'react-native-maps-directions';
import { Location } from '../../../hooks/useLocation';
import { Steps } from '../../../interfaces/direcctionInterfaces';
import { Travel } from '../../../interfaces/travel.interface';
import { AllVehicleTypesConfig, User } from '../../user/user.interface';

export interface MapState {
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
  paymentMethod: {
    modal: boolean;
    selected: string;
    view: string;
  };
  confirmTravelModal: boolean;
  mapSnapshot: string;
  vehiclesConfirm: boolean;
  vehiclesPreSelected: User[];
  inmediateCarrer: boolean;
  vehiclePreSelected: User | undefined;
  vehicleSelected: User | undefined;
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
  currentTravel: Travel | undefined;
  driverApplications?: Travel | undefined;
  scheduleTravelConfirmModal: boolean;
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
}

type MapAction =
  | {
      type: 'SET_NEARBY_DRIVERS_INMEDIATE';
      payload: {
        nearbyDrivers: User[];
        inmediateCarrer: boolean;
        vehicleConfirm: boolean;
        nearbyDriversState: User[];
      };
    }
  | {
      type: 'SET_NEARBY_DRIVERS';
      payload: {
        nearbyDriversState: User[];
        vehicleSelected?: User;
      };
    }
  | {
      type: 'SET_TRAVEL_RIDER';
      payload: {
        travelRider: {
          modal: boolean;
          travel: Travel | undefined;
        };
      };
    }
  | {
      type: 'SET_CURRENT_TRAVEL';
      payload: {
        currentTravel: Travel | undefined;
      };
    }
  | {
      type: 'SET_SCHEDULED_TRAVEL';
      payload: {
        scheduledTravel: Travel | undefined;
      };
    }
  | {
      type: 'SET_DRIVER_APPLICATIONS';
      payload: {
        driverApplications?: Travel;
      };
    }
  | {
      type: 'CLEAR_TRAVEL_RIDER';
    }
  | {
      type: 'CANCEL_TRAVEL';
    }
  | {
      type: 'SCHEDULE_TRAVEL_MODAL';
      payload: {
        scheduleModal: boolean;
      };
    }
  | {
      type: 'UPDATE_MAGNETOMETER';
      payload: {
        magnetometer: number;
      };
    }
  | {
      type: 'UPDATE_INIT_POSITION';
      payload: {
        initPosition: {
          text: string;
          coords: Location | undefined;
        };
      };
    }
  | {
      type: 'UPDATE_FINAL_POSITION';
      payload: {
        finalPosition: {
          text: string;
          coords: Location | undefined;
        };
      };
    }
  | {
      type: 'UPDATE_CURRENT_TRAVEL_DATA';
      payload: {
        initPosition: {
          text: string;
          coords: Location | undefined;
        };
        finalPosition: {
          text: string;
          coords: Location | undefined;
        };
        vehicles: boolean;
        routeDistance: number;
        routeDuration: number;
        confirmTravelModal: boolean;
        onRoadDriverModal: boolean;
        vehicleSelected?: User;
      };
    }
  | {
      type: 'SET_SELECTIONED_DRIVER';
      payload: {
        driverModal: boolean;
        vehiclePreSelected: User;
        vehicleDistance: number;
        vehicleDuration: number;
        totalMount: number;
        vehiclesConfirm: boolean;
      };
    }
  | {
      type: 'ON_PRESS_SEARCH';
      payload: {
        initPosition: {
          text: string;
          coords: Location | undefined;
        };
        finalPosition: {
          text: string;
          coords: Location | undefined;
        };
        vehicles: boolean;
        searchModal: boolean;
      };
    }
  | {
      type: 'CREATE_TRAVEL_DATA';
      payload: {
        confirmTravelModal: boolean;
        scheduleTravelConfirmModal: boolean;
        vehiclesConfirm: boolean;
        processingPaymentModal: boolean;
        vehiclePreSelected: User | undefined;
        vehicleSelected: User | undefined;
      };
    }
  | {
      type: 'SET_SEARCH_MODAL';
      payload: {
        searchModal: boolean;
        initPosition?: {
          text: string;
          coords: Location | undefined;
        };
        finalPosition?: {
          text: string;
          coords: Location | undefined;
        };
      };
    }
  | {
      type: 'OPEN_TRAVEL_MODAL';
      payload: {
        travelModal: boolean;
      };
    }
  | {
      type: 'CLOSE_VEHICLES_CONFIRM';
    }
  | {
      type: 'OPEN_VEHICLES_CONFIRM';
    }
  | {
      type: 'SET_VEHICLE_PRE_SELECTED';
      payload: {
        vehiclePreSelected: User | undefined;
      };
    }
  | {
      type: 'OPEN_PAYMENT_METHOD';
      payload: {
        open: boolean;
        selected: string;
        view: string;
      };
    }
  | {
      type: 'SET_PROCESSING_PAYMENT_MODAL';
      payload: {
        processingPaymentModal: boolean;
      };
    }
  | {
      type: 'SET_ON_ROAD_DRIVER_MODAL';
      payload: {
        onRoadDriverModal: boolean;
      };
    }
  | {
      type: 'SET_RESULT';
      payload: {
        result: MapDirectionsResponse;
        instructions: Steps[];
      };
    }
  | {
      type: 'SET_MAP_SNAPSHOT';
      payload: {
        mapSnapshot: string;
      };
    }
  | {
      type: 'SET_DRIVER_MODAL';
      payload: {
        driverModal: boolean;
      };
    }
  | {
      type: 'SET_CREDIT_CARD_SELECTED';
      payload: {
        creditCardSelected: boolean;
      };
    }
  | {
      type: 'CLOSE_MODALS';
    }
  | {
      type: 'GET_CLIENT_TRAVELS';
      payload: {
        travels: Travel[];
        count: number;
      };
    }
  | {
      type: 'SET_SCHEDULED_TRAVELS';
      payload: {
        travels: Travel[];
        count: number;
      };
    }
  | {
      type: 'SET_MY_ACCEPTED_SCHEDULED_TRAVELS';
      payload: {
        travels: Travel[];
        count: number;
      };
    }
  | {
      type: 'FIND_SPECIFIC_TRAVEL';
      payload: {
        travel: Travel;
      };
    }
  | {
      type: 'SCHEDULE_TRAVEL';
    }
  | {
      type: 'SET_VEHICLE_SCHEDULE';
      payload: {
        vehicleSchedule: AllVehicleTypesConfig;
      };
    }
  | {
      type: 'SELECT_SCHEDULE_TRAVEL';
      payload: {
        duration: number;
        distance: number;
        total: number;
      };
    };

export const mapReducer = (state: MapState, action: MapAction): MapState => {
  switch (action.type) {
    case 'SET_NEARBY_DRIVERS_INMEDIATE':
      return {
        ...state,
        vehiclesPreSelected: action.payload.nearbyDrivers,
        vehiclePreSelected: action.payload.nearbyDrivers[0],
        inmediateCarrer: action.payload.inmediateCarrer,
        nearbyDriversState: action.payload.nearbyDriversState,
        vehiclesConfirm: action.payload.vehicleConfirm,
      };
    case 'SET_NEARBY_DRIVERS':
      return {
        ...state,
        nearbyDriversState: action.payload.nearbyDriversState,
        vehicleSelected: action.payload.vehicleSelected,
      };
    case 'SET_TRAVEL_RIDER':
      return {
        ...state,
        travelRider: action.payload.travelRider,
      };
    case 'SET_CURRENT_TRAVEL':
      return {
        ...state,
        currentTravel: action.payload.currentTravel,
      };
    case 'SET_DRIVER_APPLICATIONS':
      return {
        ...state,
        driverApplications: action.payload.driverApplications,
      };
    case 'CLEAR_TRAVEL_RIDER':
      return {
        ...state,
        travelRider: {
          modal: false,
          travel: undefined,
        },
      };
    case 'CANCEL_TRAVEL':
      return {
        ...state,
        travelModal: false,
        confirmTravelModal: false,
        vehiclePreSelected: undefined,
        vehiclesPreSelected: [],
        vehicleSelected: undefined,
        onRoadDriverModal: false,
        driverModal: false,
        vehiclesConfirm: false,
        inmediateCarrer: false,
        initPosition: {
          text: '',
          coords: undefined,
        },
        finalPosition: {
          text: '',
          coords: undefined,
        },
        paymentMethod: {
          modal: false,
          selected: '',
          view: '',
        },
        travelRider: {
          modal: false,
          travel: undefined,
        },
        processingPaymentModal: false,
        creditCardSelected: false,
        totalMount: 0,
        routeDistance: 0,
        routeDuration: 0,
        currentTravel: undefined,
        mapSnapshot: '',
        vehicles: false,
        searchModal: false,
        result: undefined,
        driverApplications: undefined,
      };
    case 'SCHEDULE_TRAVEL_MODAL':
      return {
        ...state,
        scheduleTravelConfirmModal: action.payload.scheduleModal,
      };
    case 'UPDATE_MAGNETOMETER':
      return {
        ...state,
        magnetometerState: action.payload.magnetometer,
      };
    case 'UPDATE_INIT_POSITION':
      return {
        ...state,
        initPosition: action.payload.initPosition,
      };
    case 'UPDATE_FINAL_POSITION':
      return {
        ...state,
        finalPosition: action.payload.finalPosition,
      };
    case 'UPDATE_CURRENT_TRAVEL_DATA':
      return {
        ...state,
        initPosition: action.payload.initPosition,
        finalPosition: action.payload.finalPosition,
        vehicles: action.payload.vehicles,
        routeDistance: action.payload.routeDistance,
        routeDuration: action.payload.routeDuration,
        confirmTravelModal: action.payload.confirmTravelModal,
        onRoadDriverModal: action.payload.onRoadDriverModal,
        vehicleSelected: action.payload.vehicleSelected ? action.payload.vehicleSelected : state.vehicleSelected,
      };
    case 'SET_SELECTIONED_DRIVER':
      return {
        ...state,
        driverModal: action.payload.driverModal,
        vehiclePreSelected: action.payload.vehiclePreSelected,
        vehicleDistance: action.payload.vehicleDistance,
        vehicleDuration: action.payload.vehicleDuration,
        totalMount: action.payload.totalMount,
        vehiclesConfirm: action.payload.vehiclesConfirm,
        inmediateCarrer: action.payload.driverModal ? false : true,
      };
    case 'ON_PRESS_SEARCH':
      return {
        ...state,
        initPosition: action.payload.initPosition,
        finalPosition: action.payload.finalPosition,
        vehicles: action.payload.vehicles,
        searchModal: action.payload.searchModal,
      };
    case 'CREATE_TRAVEL_DATA':
      return {
        ...state,
        confirmTravelModal: action.payload.confirmTravelModal,
        vehiclesConfirm: action.payload.vehiclesConfirm,
        processingPaymentModal: action.payload.processingPaymentModal,
        vehicleSelected: action.payload.vehicleSelected,
        scheduleTravelConfirmModal: action.payload.scheduleTravelConfirmModal,
        vehiclePreSelected: undefined,
      };
    case 'SET_SEARCH_MODAL':
      return {
        ...state,
        vehicles: action.payload.searchModal ? false : state.vehicles,
        searchModal: action.payload.searchModal,
        vehiclesConfirm: action.payload.searchModal ? false : state.vehiclesConfirm,
        initPosition: action.payload.initPosition ? action.payload.initPosition : state.initPosition,
        finalPosition: action.payload.finalPosition ? action.payload.finalPosition : state.finalPosition,
      };
    case 'OPEN_TRAVEL_MODAL':
      return {
        ...state,
        travelModal: action.payload.travelModal,
      };
    case 'CLOSE_VEHICLES_CONFIRM':
      return {
        ...state,
        vehiclesConfirm: false,
        vehiclePreSelected: undefined,
        inmediateCarrer: false,
      };
    case 'OPEN_VEHICLES_CONFIRM':
      return {
        ...state,
        vehiclesConfirm: true,
      };
    case 'SET_VEHICLE_PRE_SELECTED':
      return {
        ...state,
        vehiclePreSelected: action.payload.vehiclePreSelected,
      };
    case 'OPEN_PAYMENT_METHOD':
      return {
        ...state,
        paymentMethod: {
          selected: action.payload.selected,
          modal: action.payload.open,
          view: action.payload.view ? action.payload.view : state.paymentMethod.view,
        },
      };
    case 'SET_PROCESSING_PAYMENT_MODAL':
      return {
        ...state,
        processingPaymentModal: action.payload.processingPaymentModal,
      };
    case 'SET_ON_ROAD_DRIVER_MODAL':
      return {
        ...state,
        onRoadDriverModal: action.payload.onRoadDriverModal,
      };
    case 'SET_RESULT':
      return {
        ...state,
        routeDistance: action.payload.result.distance,
        routeDuration: action.payload.result.duration,
        result: action.payload.result,
        instructions: action.payload.instructions,
      };
    case 'SET_MAP_SNAPSHOT':
      return {
        ...state,
        mapSnapshot: action.payload.mapSnapshot,
      };
    case 'SET_DRIVER_MODAL':
      return {
        ...state,
        driverModal: action.payload.driverModal,
      };
    case 'SET_CREDIT_CARD_SELECTED':
      return {
        ...state,
        creditCardSelected: action.payload.creditCardSelected,
      };
    case 'CLOSE_MODALS':
      return {
        ...state,
        onRoadDriverModal: false,
        travelModal: false,
      };
    case 'GET_CLIENT_TRAVELS':
      return {
        ...state,
        clientTravels: {
          travels: action.payload.travels,
          count: action.payload.count,
        },
      };
    case 'SET_SCHEDULED_TRAVELS':
      return {
        ...state,
        scheduledTravels: {
          travels: action.payload.travels,
          count: action.payload.count,
        },
      };
    case 'SET_MY_ACCEPTED_SCHEDULED_TRAVELS':
      return {
        ...state,
        myAcceptedScheduledTravels: {
          travels: action.payload.travels,
          count: action.payload.count,
        },
      };
    case 'FIND_SPECIFIC_TRAVEL':
      return {
        ...state,
        specificTravel: action.payload.travel,
      };
    case 'SCHEDULE_TRAVEL':
      return {
        ...state,
        vehiclesConfirm: true,
        inmediateCarrer: true,
      };
    case 'SET_VEHICLE_SCHEDULE':
      return {
        ...state,
        vehicleSchedule: action.payload.vehicleSchedule,
      };
    case 'SELECT_SCHEDULE_TRAVEL':
      return {
        ...state,
        routeDuration: action.payload.duration,
        routeDistance: action.payload.distance,
        totalMount: action.payload.total,
      };
    default:
      return state;
  }
};

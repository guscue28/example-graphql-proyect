import { FavoriteDriver, FavoriteLocation, PaymentValidation, User, UserOnlineStatuses, Wallet } from '../../user/user.interface';

export interface AuthState {
  isAuth: boolean;
  showTooltip: boolean;
  loadingAuth: boolean;
  accessToken: string | null;
  refreshToken: string | null;
  user: User | null;
  loadingStatus: boolean;
  favoriteDrivers: {
    drivers: FavoriteDriver[];
    count: number;
  };
  favoriteDriverModal: boolean;
  favoriteLocations: {
    locations: FavoriteLocation[];
    count: number;
  };
  paymentData: PaymentValidation;
}

type AuthAction =
  | {
      type: 'SIGN_IN';
      payload: {
        accessToken: string;
        refreshToken: string | null;
      };
    }
  | { type: 'SET_CURRENT_USER'; payload: { user: User } }
  | { type: 'LOGOUT' }
  | { type: 'UPDATE_USER'; payload: { user: User } }
  | { type: 'CHANGE_USER_ONLINE_STATUS'; payload: { onlineStatus: UserOnlineStatuses; showTooltip: boolean } }
  | { type: 'SET_LOADING_STATUS'; payload: { loadingStatus: boolean } }
  | { type: 'SET_TOOLTIP'; payload: { showTooltip: boolean } }
  | {
      type: 'GET_MY_FAVORITE_DRIVERS';
      payload: {
        drivers: FavoriteDriver[];
        count: number;
      };
    }
  | {
      type: 'CREATE_FAVORITE_DRIVER';
      payload: {
        favoriteDriverModal: boolean;
        driver: FavoriteDriver;
      };
    }
  | {
      type: 'GET_MY_FAVORITE_LOCATIONS';
      payload: {
        locations: FavoriteLocation[];
        count: number;
      };
    }
  | {
      type: 'CREATE_FAVORITE_LOCATION';
      payload: {
        location: FavoriteLocation;
      };
    }
  | {
      type: 'DELETE_FAVORITE_LOCATION';
      payload: {
        _id: string;
      };
    }
  | {
      type: 'DELETE_FAVORITE_DRIVER';
      payload: {
        _id: string;
      };
    }
  | {
      type: 'SET_PAYMENT_DATA';
      payload: {
        paymentData: PaymentValidation;
      };
    }
  | {
      type: 'WALLET_CHANGED';
      payload: {
        wallet: Wallet;
      };
    };

export const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'SIGN_IN':
      return {
        ...state,
        isAuth: true,
        accessToken: action.payload.accessToken,
        refreshToken: action.payload.refreshToken,
      };
    case 'SET_CURRENT_USER':
      return {
        ...state,
        isAuth: true,
        user: action.payload.user,
      };

    case 'LOGOUT':
      return {
        ...state,
        isAuth: false,
        accessToken: null,
        refreshToken: null,
        user: null,
      };
    case 'UPDATE_USER':
      return {
        ...state,
        user: { ...state.user, ...action.payload.user },
      };
    case 'CHANGE_USER_ONLINE_STATUS':
      return {
        ...state,
        showTooltip: true,
        user: state.user && { ...state.user, onlineStatus: action.payload.onlineStatus },
      };
    case 'SET_LOADING_STATUS':
      return {
        ...state,
        loadingStatus: action.payload.loadingStatus,
      };
    case 'SET_TOOLTIP':
      return {
        ...state,
        showTooltip: action.payload.showTooltip,
      };
    case 'GET_MY_FAVORITE_DRIVERS':
      return {
        ...state,
        favoriteDrivers: {
          drivers: action.payload.drivers,
          count: action.payload.count,
        },
      };
    case 'CREATE_FAVORITE_DRIVER':
      return {
        ...state,
        favoriteDrivers: {
          drivers: [...state.favoriteDrivers.drivers, action.payload.driver],
          count: state.favoriteDrivers.count + 1,
        },
        favoriteDriverModal: action.payload.favoriteDriverModal,
      };
    case 'GET_MY_FAVORITE_LOCATIONS':
      return {
        ...state,
        favoriteLocations: {
          locations: action.payload.locations,
          count: action.payload.count,
        },
      };
    case 'CREATE_FAVORITE_LOCATION':
      return {
        ...state,
        favoriteLocations: {
          locations: [...state.favoriteLocations.locations, action.payload.location],
          count: state.favoriteLocations.count + 1,
        },
      };
    case 'DELETE_FAVORITE_LOCATION':
      return {
        ...state,
        favoriteLocations: {
          locations: state.favoriteLocations.locations.filter(location => location._id !== action.payload._id),
          count: state.favoriteLocations.count - 1,
        },
      };
    case 'DELETE_FAVORITE_DRIVER':
      return {
        ...state,
        favoriteDrivers: {
          drivers: state.favoriteDrivers.drivers.filter(driver => driver._id !== action.payload._id),
          count: state.favoriteDrivers.count - 1,
        },
      };
    case 'SET_PAYMENT_DATA':
      return {
        ...state,
        paymentData: action.payload.paymentData,
      };
    case 'WALLET_CHANGED':
      if (state.user) {
        return {
          ...state,
          user: { ...state.user, wallet: action.payload.wallet },
        };
      } else {
        return state;
      }
    default:
      return state;
  }
};

import React, { createContext, useEffect, useReducer } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CreateFavoriteDriverInput, LoginData } from '../login.interface';
import {
  SIGN_UP_USER,
  GET_ME,
  LOGIN_USER,
  SOCIAL_NETWORK_LOGIN,
  CHANGE_USER_ONLINE_STATUS,
  FORGOT_PASSWORD,
  FORGOT_PASSWORD_TOKEN_VERIFY,
  FORGOT_PASSWORD_RESET,
  GET_WALLET_INFLOW_OUTFLOW,
  UPDATE_PUSH_NOTIFICATION_TOKEN,
  CREATE_FAVORITE_DRIVER,
  GET_MY_FAVORITE_DRIVERS,
  CREATE_FAVORITE_LOCATION,
  GET_MY_FAVORITE_LOCATIONS,
  DELETE_FAVORITE_LOCATION,
  DELETE_FAVORITE_DRIVER,
  RECHARGE_WALLET,
  WALLET_SUBSCRIPTION,
} from '../auth.graphql';
import { RegisterData } from '../register.interface';
import { authReducer, AuthState } from './authReducer';
import {
  CreateFavoriteLocationInput,
  FavoriteDriver,
  FavoriteLocation,
  PaymentValidation,
  User,
  UserOnlineStatuses,
  WalletInflowOutFlow,
} from '../../user/user.interface';
import makeApolloClient from '../../apolloClient';
import { ApolloClient, FetchResult, NormalizedCacheObject } from '@apollo/client';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { LoginManager, AccessToken, Settings } from 'react-native-fbsdk-next';
import dynamicLinks, { FirebaseDynamicLinksTypes } from '@react-native-firebase/dynamic-links';
import AppConfigService from '../../appConfig/appConfig.service';
import { ReactNativeFile } from 'apollo-upload-client';
import { UPDATE_USER } from '../../user/user.graphql';
import { getGraphqlError } from '../../../helpers';
import { Pagination } from '../../../interfaces/pagination.interface';
import messaging from '@react-native-firebase/messaging';
import { RechargeWalletInput } from '../../../interfaces/payments.interface';
type AuthContextProps = {
  isAuth: boolean;
  loadingAuth: boolean;
  user: User | null;
  dynamicUrl: FirebaseDynamicLinksTypes.DynamicLink | null;
  forgotPasswordToken: any;
  apolloClient: ApolloClient<NormalizedCacheObject>;
  dynamicLinkSubscription: any;
  showTooltip: boolean;
  loadingStatus: boolean;
  hide: boolean;
  favoriteDrivers: FavoriteDriver[];
  favoriteDriverCount: number;
  favoriteDriverModal: boolean;
  favoriteLocations: FavoriteLocation[];
  favoriteLocationsCount: number;
  paymentData: PaymentValidation;
  hideTab: (hidden: boolean) => void;
  setShowTooltip: (showTooltip: boolean) => void;
  setLoadingStatus: (loadingStatus: boolean) => void;
  signUp: (registerData: RegisterData) => Promise<void | boolean>;
  signIn: (loginData: LoginData) => Promise<void>;
  signInWithGoogle: () => Promise<any | undefined>;
  signInWithFacebook: () => Promise<FirebaseAuthTypes.UserCredential | undefined>;
  logOut: () => void;
  updateUser: (user: User, picture: ReactNativeFile | null) => Promise<boolean | void>;
  forgotPassword: (email: string) => Promise<void | boolean>;
  forgotPasswordVerifyToken: (token: string) => Promise<boolean | void>;
  resetPassword: (email: string, newPassword: string, newPasswordConfirm: string, token: string) => Promise<void | boolean>;
  changeUserOnlineStatus: (onlineStatus: UserOnlineStatuses, logout?: boolean) => Promise<void>;
  hadleDynamicLink: () => void;
  getWalletInflowOutflow: (walletId: string, pagination: Pagination) => Promise<WalletInflowOutFlow>;
  createFavoriteDriver: (payload: CreateFavoriteDriverInput) => Promise<void>;
  getMyFavoriteDrivers: (pagination: Pagination) => Promise<void>;
  getMyFavoriteLocations: (pagination: Pagination) => Promise<void>;
  createFavoriteLocations: (payload: CreateFavoriteLocationInput) => Promise<void>;
  deleteFavoriteLocation: (favoriteLocationId: string) => Promise<void>;
  deleteFavoriteDriver: (favoriteDriverId: string) => Promise<void>;
  rechargeWallet: (payload: RechargeWalletInput) => Promise<void>;
};

const authInitialState: AuthState = {
  isAuth: false,
  showTooltip: false,
  loadingStatus: false,
  loadingAuth: false,
  user: null,
  accessToken: null,
  refreshToken: null,
  favoriteDrivers: {
    drivers: [],
    count: 0,
  },
  favoriteDriverModal: false,
  favoriteLocations: {
    locations: [],
    count: 0,
  },
  paymentData: {
    amount: 0,
    paymentMethod: '',
    validationStatus: '',
  },
};

export const AuthContext = createContext({} as AuthContextProps);

export const AuthProvider = ({ children }: any) => {
  const [state, dispatch] = useReducer(authReducer, authInitialState);
  const [dynamicUrl, setDynamicUrl] = React.useState<FirebaseDynamicLinksTypes.DynamicLink | null>(null);
  const [forgotPasswordToken, setForgotPasswordToken] = React.useState<FetchResult>();
  const [apolloClient, setApolloClient] = React.useState<ApolloClient<NormalizedCacheObject>>();
  const [hide, setHide] = React.useState<boolean>(false);
  const dynamicLinkSubscription = React.useRef<any>(() => {});
  const appConfigService = new AppConfigService();
  const suscribeToWallet = React.useRef<any>(null);
  useEffect(() => {
    GoogleSignin.configure({
      webClientId: '517226636364-pqtdu4bfa2pnou2q4jdue5ae7s5nrrah.apps.googleusercontent.com',
    });
    Settings.setAppID('375805587785759');
    Settings.initializeSDK();
  }, []);

  const hideTab = (hidden: boolean) => {
    setHide(hidden);
  };

  const getCurrentUser = React.useCallback(async (): Promise<User | undefined> => {
    try {
      const { data } = await apolloClient!.query({ query: GET_ME });
      messaging()
        .hasPermission()
        .then(hasPermission => {
          if (hasPermission) {
            messaging()
              .getToken()
              .then(async token => {
                if (token && data.me.pushNotificationToken !== token) {
                  apolloClient!.mutate({
                    mutation: UPDATE_PUSH_NOTIFICATION_TOKEN,
                    variables: {
                      token,
                    },
                  });
                }
              });
          }
        });
      dispatch({ type: 'SET_CURRENT_USER', payload: { user: data.me } });
      suscribeToWallet.current = apolloClient!
        .subscribe({
          query: WALLET_SUBSCRIPTION,
          variables: { walletId: data.me.wallet._id },
        })
        .subscribe(res => {
          dispatch({
            type: 'WALLET_CHANGED',
            payload: { wallet: res.data.walletChanged },
          });
        });
      return data.me;
    } catch (error) {
      console.log('aqui', error);
      logOut();
      //TODO: manejo de errores
    }
    return;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apolloClient]);

  React.useEffect(() => {
    if (apolloClient && state.isAuth) {
      getCurrentUser();
    }
  }, [apolloClient, getCurrentUser, state.isAuth]);

  const setToken = async (accessToken: string, refreshToken?: string) => {
    await AsyncStorage.setItem('accessToken', accessToken);
    if (refreshToken) {
      await AsyncStorage.setItem('refreshToken', refreshToken);
    }
  };

  const signIn = async ({ email, password }: LoginData) => {
    try {
      const { data } = await apolloClient!.mutate({
        mutation: LOGIN_USER,
        variables: { email, password },
      });
      const client = makeApolloClient(data.login.accessToken);
      setApolloClient(client);
      setToken(data.login.accessToken, data.login.refreshToken);
      dispatch({
        type: 'SIGN_IN',
        payload: {
          refreshToken: data.login.refreshToken,
          accessToken: data.login.accessToken,
        },
      });
    } catch (error: any) {
      console.log(error);

      getGraphqlError(error);
    }
  };

  const signInWithGoogle = async () => {
    try {
      await GoogleSignin.signOut();
      const { idToken } = await GoogleSignin.signIn();
      const socialNetwork = 'GOOGLE';
      const { data } = await apolloClient!.mutate({
        mutation: SOCIAL_NETWORK_LOGIN,
        variables: { idToken, socialNetwork },
      });
      const client = makeApolloClient(data.loginSocialNetwork.accessToken);
      setApolloClient(client);
      setToken(data.loginSocialNetwork.accessToken, data.loginSocialNetwork.refreshToken);
      dispatch({
        type: 'SIGN_IN',
        payload: {
          refreshToken: data.loginSocialNetwork.refreshToken,
          accessToken: data.loginSocialNetwork.accessToken,
        },
      });
      // const res = await GoogleSignin.getTokens();
    } catch (error: any) {
      logOut();
      console.log(error);
    }
  };

  const signInWithFacebook = async () => {
    const result = await LoginManager.logInWithPermissions(['public_profile', 'email']);
    if (result.isCancelled) {
      throw 'User cancelled the login process';
    }
    const data = await AccessToken.getCurrentAccessToken();
    if (!data) {
      throw 'Something went wrong obtaining access token';
    }
    const facebookCredential = auth.FacebookAuthProvider.credential(data.accessToken);
    const dataResutl = await auth().signInWithCredential(facebookCredential);
    // Sign-in the user with the credential
    return dataResutl;
  };

  const signUp = async ({ firstName, lastName, email, password, confirmPassword, birthday }: RegisterData) => {
    try {
      await apolloClient!.mutate({
        mutation: SIGN_UP_USER,
        variables: { firstName, lastName, email, password, confirmPassword, birthday },
      });
      return true;
    } catch (error: any) {
      getGraphqlError(error);
    }
  };

  const updateUser = async (user: User, picture: ReactNativeFile | null) => {
    try {
      if (picture) {
        const token = await AsyncStorage.getItem('accessToken');
        const operation = new FormData();
        operation.append(
          'operations',
          JSON.stringify([
            {
              query:
                'mutation($picture: Upload, $idNumber: String!, $idNumberType: String!, $firstName: String!, $lastName: String!, $phoneNumber: String!) { editUser(payload: {idNumber: $idNumber, firstName: $firstName, idNumberType: $idNumberType, lastName: $lastName, phoneNumber: $phoneNumber}, picture: $picture) { idNumber idNumberType firstName lastName phoneNumber picture } }',
              variables: {
                picture: null,
                idNumber: user.idNumber,
                idNumberType: user.idNumberType,
                firstName: user.firstName,
                lastName: user.lastName,
                phoneNumber: user.phoneNumber,
              },
            },
          ]),
        );
        operation.append('map', JSON.stringify({ '0': ['0.variables.picture'] }));
        operation.append('0', picture);
        const { data } = await appConfigService.uploadFile(operation, token!);
        dispatch({ type: 'UPDATE_USER', payload: { user: data.editUser } });
      } else {
        const { data } = await apolloClient!.mutate({
          mutation: UPDATE_USER,
          variables: user,
        });
        dispatch({ type: 'UPDATE_USER', payload: { user: data.editUser } });
      }
    } catch (error: any) {
      console.log('error', error);
      getGraphqlError(error);
    }
  };

  const logOut = async () => {
    await changeUserOnlineStatus(UserOnlineStatuses.OFFLINE, true);
    apolloClient!.mutate({
      mutation: UPDATE_PUSH_NOTIFICATION_TOKEN,
      variables: {
        token: '',
      },
    });
    dispatch({ type: 'LOGOUT' });
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('refreshToken');
    const client = makeApolloClient();
    setApolloClient(client);
  };

  const changeUserOnlineStatus = async (onlineStatus: UserOnlineStatuses, logout: boolean = false) => {
    try {
      !logout && dispatch({ type: 'SET_LOADING_STATUS', payload: { loadingStatus: true } });
      const res = await apolloClient!.mutate({
        mutation: CHANGE_USER_ONLINE_STATUS,
        variables: { onlineStatus, logout },
      });
      !logout && dispatch({ type: 'SET_LOADING_STATUS', payload: { loadingStatus: false } });
      dispatch({
        type: 'CHANGE_USER_ONLINE_STATUS',
        payload: { onlineStatus: res.data.changeUserOnlineStatus.onlineStatus, showTooltip: !logout ? true : false },
      });
      setTimeout(() => {
        dispatch({ type: 'SET_TOOLTIP', payload: { showTooltip: false } });
      }, 1000);
    } catch (error: any) {
      console.log(error);
    }
  };

  const forgotPassword = async (email: string) => {
    try {
      await apolloClient!.mutate({
        mutation: FORGOT_PASSWORD,
        variables: { email },
      });
    } catch (error: any) {
      getGraphqlError(error);
    }
  };

  const forgotPasswordVerifyToken = async (token: string) => {
    try {
      const data = await apolloClient!.mutate({
        mutation: FORGOT_PASSWORD_TOKEN_VERIFY,
        variables: { token },
      });
      // console.log('dataContext', data.data);
      setForgotPasswordToken(data);
      return true;
    } catch (error: any) {
      getGraphqlError(error);
    }
  };

  const resetPassword = async (email: string, newPassword: string, newPasswordConfirm: string, token: string) => {
    try {
      await apolloClient!.mutate({
        mutation: FORGOT_PASSWORD_RESET,
        variables: { email, newPassword, newPasswordConfirm, token },
      });
    } catch (error: any) {
      getGraphqlError(error);
    }
  };

  const hadleDynamicLink = async () => {
    try {
      const url = await dynamicLinks().getInitialLink();
      setDynamicUrl(url);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const bootstrapAsync = async () => {
      try {
        let accessToken = await AsyncStorage.getItem('accessToken');
        let refreshToken = await AsyncStorage.getItem('refreshToken');

        if (accessToken && refreshToken) {
          const client = makeApolloClient(accessToken);
          setApolloClient(client);
          setToken(accessToken, refreshToken);
          dispatch({
            type: 'SIGN_IN',
            payload: { refreshToken, accessToken },
          });
        } else {
          const client = makeApolloClient();
          setApolloClient(client);
          dispatch({ type: 'LOGOUT' });
        }
      } catch (e) {
        dispatch({ type: 'LOGOUT' });
      }
    };
    bootstrapAsync();
    dynamicLinks().onLink(async (newUrl: FirebaseDynamicLinksTypes.DynamicLink) => {
      setDynamicUrl(newUrl);
    });
  }, []);

  const setShowTooltip = (open: boolean) => {
    dispatch({ type: 'SET_TOOLTIP', payload: { showTooltip: open } });
  };

  const setLoadingStatus = (open: boolean) => {
    dispatch({ type: 'SET_LOADING_STATUS', payload: { loadingStatus: open } });
  };

  const getWalletInflowOutflow = async (walletId: string, pagination: Pagination): Promise<WalletInflowOutFlow> => {
    try {
      const { data } = await apolloClient!.mutate({
        mutation: GET_WALLET_INFLOW_OUTFLOW,
        variables: {
          walletId,
          itemsPerPage: pagination.itemsPerPage,
          page: pagination.page,
          searchKey: pagination.searchKey,
        },
      });
      return data.getWalletInflowOutflows;
    } catch (error) {
      console.log(error);
      return {
        count: 0,
        walletInflowOutflows: [],
      };
    }
  };

  const createFavoriteDriver = async (payload: CreateFavoriteDriverInput) => {
    try {
      const { data } = await apolloClient!.mutate({
        mutation: CREATE_FAVORITE_DRIVER,
        variables: { payload },
        fetchPolicy: 'no-cache',
      });
      dispatch({
        type: 'CREATE_FAVORITE_DRIVER',
        payload: {
          driver: data.createFavoriteDriver,
          favoriteDriverModal: true,
        },
      });
    } catch (error) {
      console.log(error);
      getGraphqlError(error);
    }
  };

  const getMyFavoriteDrivers = async (pagination: Pagination) => {
    try {
      const { data } = await apolloClient!.query({
        query: GET_MY_FAVORITE_DRIVERS,
        variables: { pagination },
        fetchPolicy: 'no-cache',
      });
      dispatch({
        type: 'GET_MY_FAVORITE_DRIVERS',
        payload: {
          drivers: data.getMyFavoriteDrivers.favoriteDrivers,
          count: data.getMyFavoriteDrivers.count,
        },
      });
    } catch (error) {
      console.log(error);
      getGraphqlError(error);
    }
  };

  const createFavoriteLocations = async (payload: CreateFavoriteLocationInput) => {
    try {
      const { data } = await apolloClient!.mutate({
        mutation: CREATE_FAVORITE_LOCATION,
        variables: { payload },
        fetchPolicy: 'no-cache',
      });
      dispatch({
        type: 'CREATE_FAVORITE_LOCATION',
        payload: {
          location: data.createFavoriteLocation,
        },
      });
    } catch (error) {
      console.log(error);
      getGraphqlError(error);
    }
  };

  const deleteFavoriteLocation = async (favoriteLocationId: string) => {
    try {
      await apolloClient!.mutate({
        mutation: DELETE_FAVORITE_LOCATION,
        variables: { favoriteLocationId },
        fetchPolicy: 'no-cache',
      });
      dispatch({
        type: 'DELETE_FAVORITE_LOCATION',
        payload: {
          _id: favoriteLocationId,
        },
      });
    } catch (error) {
      console.log(error);
      getGraphqlError(error);
    }
  };

  const deleteFavoriteDriver = async (favoriteDriverId: string) => {
    try {
      await apolloClient!.mutate({
        mutation: DELETE_FAVORITE_DRIVER,
        variables: { favoriteDriverId },
        fetchPolicy: 'no-cache',
      });
      dispatch({
        type: 'DELETE_FAVORITE_DRIVER',
        payload: {
          _id: favoriteDriverId,
        },
      });
    } catch (error) {
      console.log(error);
      getGraphqlError(error);
    }
  };

  const getMyFavoriteLocations = async (pagination: Pagination) => {
    try {
      const { data } = await apolloClient!.query({
        query: GET_MY_FAVORITE_LOCATIONS,
        variables: { pagination },
        fetchPolicy: 'no-cache',
      });
      dispatch({
        type: 'GET_MY_FAVORITE_LOCATIONS',
        payload: {
          locations: data.getMyFavoriteLocations.favoriteLocations,
          count: data.getMyFavoriteLocations.count,
        },
      });
    } catch (error) {
      console.log(error);
      getGraphqlError(error);
    }
  };

  const rechargeWallet = async (payload: RechargeWalletInput) => {
    try {
      const { data } = await apolloClient!.mutate({
        mutation: RECHARGE_WALLET,
        variables: { payload },
        fetchPolicy: 'no-cache',
      });
      dispatch({
        type: 'SET_PAYMENT_DATA',
        payload: {
          paymentData: data.createPaymentValidation,
        },
      });
    } catch (error) {
      console.log(error);
      getGraphqlError(error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user: state.user,
        isAuth: state.isAuth,
        loadingAuth: state.loadingAuth,
        apolloClient: apolloClient!,
        dynamicUrl,
        forgotPasswordToken,
        dynamicLinkSubscription,
        showTooltip: state.showTooltip,
        loadingStatus: state.loadingStatus,
        hide,
        favoriteDrivers: state.favoriteDrivers.drivers,
        favoriteDriverCount: state.favoriteDrivers.count,
        favoriteDriverModal: state.favoriteDriverModal,
        favoriteLocations: state.favoriteLocations.locations,
        favoriteLocationsCount: state.favoriteLocations.count,
        paymentData: state.paymentData,
        hideTab,
        setShowTooltip,
        setLoadingStatus,
        signUp,
        signIn,
        signInWithGoogle,
        signInWithFacebook,
        logOut,
        updateUser,
        forgotPassword,
        forgotPasswordVerifyToken,
        resetPassword,
        changeUserOnlineStatus,
        hadleDynamicLink,
        getWalletInflowOutflow,
        createFavoriteDriver,
        getMyFavoriteDrivers,
        getMyFavoriteLocations,
        createFavoriteLocations,
        deleteFavoriteLocation,
        deleteFavoriteDriver,
        rechargeWallet,
      }}>
      {children}
    </AuthContext.Provider>
  );
};

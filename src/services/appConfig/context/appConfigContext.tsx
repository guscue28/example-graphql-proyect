import React, { createContext, useEffect, useReducer } from 'react';
import { GET_APP_CONFIG, GET_VEHICLE_TYPE_FOR_PRICES } from '../appConfig.graphql';
import { AppConfig } from '../appConfig.interface';
import { appConfigReducer, AppConfigState } from './appConfigReducer';
import { AuthContext } from '../../auth/context/authContext';
import { AllVehicleTypesConfig } from '../../user/user.interface';

type AppConfigContextProps = {
  appConfig: AppConfig;
  vehicleTypes: AllVehicleTypesConfig[];
  getAppConfig: () => Promise<void>;
  getAllVehiclesData: () => Promise<void>;
};

const appConfigInitialState: AppConfigState = {
  appConfig: {
    pricesByVehicle: [],
    underMaintenance: false,
    apiConfig: {
      timeOutDriverToAcceptTravel: 0,
      maxDistanceToGetDrivers: 0,
    },
  },
  vehicleTypes: [],
  getAppConfig: async () => {},
  // getAllVehicleTypes: async () => {},
};

export const AppConfigContext = createContext({} as AppConfigContextProps);

export const AppConfigProvider = ({ children }: any) => {
  const [state, dispatch] = useReducer(appConfigReducer, appConfigInitialState);
  const { apolloClient } = React.useContext(AuthContext);
  const getAppConfig = React.useCallback(async (): Promise<void> => {
    try {
      const { data } = await apolloClient!.query({
        query: GET_APP_CONFIG,
      });
      console.log('data', data.getAppConfigs);
      dispatch({
        type: 'SET_APP_CONFIG',
        payload: data.getAppConfigs,
      });
    } catch (error: any) {
      console.log('appconfig', error);
      //TODO: manejo de errores
    }
  }, [apolloClient]);

  const getAllVehiclesData = React.useCallback(async () => {
    try {
      const { data } = await apolloClient!.query({
        query: GET_VEHICLE_TYPE_FOR_PRICES,
      });
      dispatch({
        type: 'SET_ALL_VEHICLETYPES',
        payload: data.getVehiclesType,
      });
    } catch (error) {
      console.log(error);
    }
  }, [apolloClient]);
  useEffect(() => {
    if (apolloClient) {
      getAppConfig();
      getAllVehiclesData();
    }
  }, [getAppConfig, getAllVehiclesData, apolloClient]);

  return (
    <AppConfigContext.Provider
      value={{
        appConfig: state.appConfig,
        vehicleTypes: state.vehicleTypes,
        getAppConfig: getAppConfig,
        getAllVehiclesData,
      }}>
      {children}
    </AppConfigContext.Provider>
  );
};

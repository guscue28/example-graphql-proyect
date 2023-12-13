import { AllVehicleTypesConfig } from '../../user/user.interface';
import { AppConfig } from '../appConfig.interface';

export interface AppConfigState {
  appConfig: AppConfig;
  vehicleTypes: AllVehicleTypesConfig[];
  getAppConfig: () => Promise<void>;
}

type AppConfigAction =
  | { type: 'SET_APP_CONFIG'; payload: AppConfig }
  | {
      type: 'SET_ALL_VEHICLETYPES';
      payload: {
        vehicleTypes: AllVehicleTypesConfig[];
      };
    };

export const appConfigReducer = (state: AppConfigState, action: AppConfigAction): AppConfigState => {
  switch (action.type) {
    case 'SET_APP_CONFIG':
      return {
        ...state,
        appConfig: action.payload,
      };
    case 'SET_ALL_VEHICLETYPES':
      return {
        ...state,
        vehicleTypes: action.payload.vehicleTypes,
      };
    default:
      return state;
  }
};

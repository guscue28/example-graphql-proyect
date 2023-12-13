import { gql } from '@apollo/client';

export const GET_APP_CONFIG = gql`
  query getAppConfigs {
    getAppConfigs {
      apiConfig {
        maxDistanceToGetDrivers
        timeOutDriverToAcceptTravel
      }
      underMaintenance
      paymentGateways {
        enabled
        type
      }
    }
  }
`;

export const GET_VEHICLE_TYPE_FOR_PRICES = gql`
  query getVehiclesType {
    getVehiclesType {
      vehicleTypes {
        _id
        name
        pricePerKM
        pricePerMIN
        pictures
        minimumFare
        enabled
      }
    }
  }
`;

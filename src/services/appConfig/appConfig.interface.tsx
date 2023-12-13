export interface AppConfig {
  pricesByVehicle: PriceByVehicle[];
  underMaintenance: boolean;
  apiConfig: ApiConfig;
}

export interface ApiConfig {
  timeOutDriverToAcceptTravel: number;
  maxDistanceToGetDrivers: number;
}

export interface PriceByVehicle {
  pricePerKM: number;
  pricePerMIN: number;
  minimumFare: number;
  picture: string;
  description: string;
  enabled: boolean;
  type: VehiclesTypes;
}

export enum VehiclesTypes {
  SUV = 'SUV',
  SEDAN = 'SEDAN',
  COUPE = 'COUPE',
  TRUCK = 'TRUCK',
  PICK_UP = 'PICK_UP',
  VAN = 'VAN',
  CARGO = 'CARGO',
  MOTORCYCLE = 'MOTORCYCLE',
  BICYCLE = 'BICYCLE',
  ARMORED_VEHICLE = 'ARMORED_VEHICLE',
}

export interface VehicleData {
  name: string;
  picture: any;
}

export const vehiclesData: VehicleData[] = [
  {
    name: VehiclesTypes.SUV,
    picture: require('../../assets/vehicles/suv.png'),
  },
  {
    name: VehiclesTypes.SEDAN,
    picture: require('../../assets/vehicles/sedan.png'),
  },
  {
    name: VehiclesTypes.COUPE,
    picture: require('../../assets/vehicles/coupe.png'),
  },
  {
    name: VehiclesTypes.TRUCK,
    picture: require('../../assets/vehicles/truck.png'),
  },
  {
    name: VehiclesTypes.PICK_UP,
    picture: require('../../assets/vehicles/pickup.png'),
  },
  {
    name: VehiclesTypes.VAN,
    picture: require('../../assets/vehicles/van.png'),
  },
  {
    name: VehiclesTypes.CARGO,
    picture: require('../../assets/vehicles/cargo.png'),
  },
  {
    name: VehiclesTypes.MOTORCYCLE,
    picture: require('../../assets/vehicles/moto.png'),
  },
  {
    name: VehiclesTypes.BICYCLE,
    picture: require('../../assets/vehicles/bicycle.png'),
  },
  {
    name: VehiclesTypes.ARMORED_VEHICLE,
    picture: require('../../assets/vehicles/armored_vehicle.png'),
  },
];

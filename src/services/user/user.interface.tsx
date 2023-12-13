// import { VehiclesTypes } from '../appConfig/appConfig.interface';
import { Location } from '../map/map.interface';

export interface User {
  _id: string;
  address?: Address;
  birthday?: Date;
  city?: string;
  country?: string;
  createdAt: Date;
  deletedBy?: Date;
  email: string;
  emailVerified: boolean;
  facebookId?: string;
  firstName: string;
  gender?: UserGenders;
  googleId?: string;
  idNumber?: string;
  idNumberType?: UserIdentificationNumberTypes;
  location?: Location;
  lastName?: string;
  loginFacebook?: boolean;
  loginGoogle?: boolean;
  onlineStatus?: UserOnlineStatuses;
  onlineStatusHistory: OnlineStatusHistory[];
  phoneNumber?: string;
  phoneNumberVerified?: boolean;
  picture?: string;
  postalCode?: number;
  pushNotificationToken?: string;
  ratingAverage: number;
  roles?: UserRoles[];
  savedOnlineStatus?: string;
  timezone?: string;
  updatedAt: Date;
  userMembership?: UserMembership;
  vehicle?: Vehicle;
  verificationEmail: string;
  verificationEmailExpires: Date;
  verified?: boolean;
  wallet: Wallet;
  websocketId: string;
}

export interface FavoriteDriver {
  _id: string;
  createdAt: Date;
  driver: MyFavoritDriver;
  user: string;
}

export interface FavoriteLocation {
  _id: string;
  createdAt?: Date;
  deletedAt?: Date;
  deletedBy?: Date;
  location: Location;
  locationString: string;
  name: string;
  type: string;
  updatedAt: Date;
  user: string;
}

export type MyFavoritDriver = Pick<User, '_id' | 'firstName' | 'lastName' | 'picture' | 'ratingAverage' | 'vehicle' | 'onlineStatus'>;

export interface VehiclesType {
  _id?: string;
  description: string;
  enabled: boolean;
  minimumFare: number;
  name: string;
  pictures: string[];
  pricePerKM: number;
  pricePerMIN: number;
  vehicleCount?: number;
  vehicleActiveCount?: number;
}

export type AllVehicleTypesConfig = Pick<VehiclesType, '_id' | 'name' | 'pricePerKM' | 'pricePerMIN' | 'pictures' | 'minimumFare' | 'enabled'>;

export interface Vehicle {
  _id: string;
  isArmored: boolean;
  description: string;
  licensePlate: string;
  color: string;
  brand: VehicleBrand;
  model: VehicleModel;
  NIV?: string;
  owner: string | User;
  driver: string | User;
  kmTraveled: number;
  status: VehicleStatuses;
  vehicleType: VehiclesType;
  createdAt: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

export interface VehicleBrand {
  _id: string;
  name: string;
  createdAt: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

export interface VehicleModel {
  _id: string;
  name: string;
  // brand: string | VehicleBrand;
  // vehicleType: VehiclesType;
  seats: number;
  luggage: number;
  feeSpareParts: number;
  feeMaintenance: number;
  feeGas: number;
  createdAt: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

export enum VehicleStatuses {
  READY_FOR_SALE = 'READY_FOR_SALE',
  INACTIVE = 'INACTIVE',
  ACTIVE = 'ACTIVE',
}
export interface Wallet {
  _id: string;
  balance: number;
}

export interface WalletInflowOutFlow {
  count: number;
  walletInflowOutflows: InflowOutflow[];
}
export interface InflowOutflow {
  _id: string;
  amount: number;
  createdAt: Date;
  deletedAt: Date;
  deletedBy: Date;
  description: string;
  driverInvoice: string;
  operation: string;
  travel: string;
  type: string;
  updatedAt: Date;
  wallet: string;
}

export interface Address {
  city: string;
  country: string;
  line1: string;
  line2: string;
  postalCode: string;
  state: string;
}

export interface UserMembership {
  _id?: string;
  benefitsExchanged?: Benefit[];
  createdAt?: Date;
  enabled?: boolean;
  isInTrialPeriod?: boolean;
  membership?: Membership;
}

export interface Membership {
  _id?: string;
  benefits?: Benefit[];
  benefitsTrialPeriod?: Benefit[];
  createdAt?: Date;
  deletedAt?: Date;
  deletedBy?: Date;
  enabled?: boolean;
  prices?: Price[];
  trialPeriodAllowed?: boolean;
  updatedAt?: Date;
}

export interface Benefit {
  duration?: TimeInterval;
  enabled?: boolean;
  interval?: TimeInterval;
  trialPeriodAllowed?: boolean;
  type?: string;
  value?: number;
}
export interface TimeInterval {
  interval?: number;
  type?: string;
}

export interface Price {
  interval?: TimeInterval;
  price?: number;
}

export interface OnlineStatusHistory {
  at: Date;
  mode: string;
  onlineStatus: string;
}

export type LocationCoordinates = Pick<Location, 'coordinates'>;
export interface CreateFavoriteLocationInput {
  location: LocationCoordinates;
  locationString: string;
  name: string;
  type: string;
}

export interface PaymentValidation {
  _id?: string;
  validationStatus: string;
  amount: number;
  createdAt?: Date;
  paymentMethod: string;
}

export enum UserRoles {
  ADMIN = 'ADMIN',
  CLIENT = 'CLIENT',
  DRIVER = 'DRIVER',
}

export enum UserGenders {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHER = 'OTHER',
}

export enum UserOnlineStatuses {
  BUSY = 'BUSY',
  ONLINE = 'ONLINE',
  OFFLINE = 'OFFLINE',
  ON_TRAVEL = 'ON_TRAVEL',
}

export enum LocationTypes {
  HOME = 'HOME',
  OFFICE = 'OFFICE',
  OTHER = 'OTHER',
}

export enum UserIdentificationNumberTypes {
  CI = 'V',
  RIF = 'J',
  PASSPORT = 'P',
  FOREIGN = 'E',
}

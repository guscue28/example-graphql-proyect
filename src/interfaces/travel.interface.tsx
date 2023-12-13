import { Location } from '../services/map/map.interface';
import { User } from '../services/user/user.interface';

export interface Travel {
  _id: string;
  client: User;
  clientActualLocation?: Location;
  createdAt: Date;
  deletedAt?: Date;
  deletedBy?: Date;
  destination: Location;
  origin: Location;
  clientOriginLocation: Location;
  driverOriginLocation: Location;
  destinationString: string;
  originString: string;
  distance: number;
  driver?: User;
  driverActualLocation?: Location;
  driverApplications?: any;
  duration: string;
  finishDate?: Date;
  estimatedTime: number;
  panicButton?: PanicButton;
  paymentStatus?: string;
  price: number;
  ratings?: Rating[];
  routePicture: string;
  startDate?: Date;
  scheduledDate?: Date;
  travelStatus: TravelStatuses;
  travelType: TravelTypes;
  updatedAt?: Date;
  chatId?: string;
}

export interface PanicButton {
  createdAt: Date;
  status: string;
  type: string;
  updatedAt: Date;
  user: User;
}

export interface Rating {
  _id: string;
  client: string;
  driver: string;
  message: string;
  rating: number;
  type: string;
}

export enum TravelStatuses {
  ACCEPTED_AND_ON_WAY = 'ACCEPTED_AND_ON_WAY',
  STARTED = 'STARTED',
  FINISHED = 'FINISHED',
  PENDING_TO_ASSIGN = 'PENDING_TO_ASSIGN',
  CANCELLED = 'CANCELLED',
  // ONLY SCHEDULED
  SCHEDULED_WITHOUT_DRIVER = 'SCHEDULED_WITHOUT_DRIVER',
  SCHEDULED_WITH_DRIVER = 'SCHEDULED_WITH_DRIVER',
}

export enum TravelTypes {
  NORMAL = 'NORMAL',
  SCHEDULED = 'SCHEDULED',
}

export enum RatingTypes {
  TO_DRIVER = 'TO_DRIVER',
  TO_CLIENT = 'TO_CLIENT',
}

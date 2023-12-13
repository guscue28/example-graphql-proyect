import { Travel } from '../../interfaces/travel.interface';
import { User } from '../user/user.interface';

export interface PaginationInput {
  itemsPerPage: number;
  page: number;
  searchKey: string;
}

export type UserChat = Pick<
  User,
  | '_id'
  | 'address'
  | 'birthday'
  | 'city'
  | 'country'
  | 'email'
  | 'firstName'
  | 'gender'
  | 'lastName'
  | 'phoneNumber'
  | 'picture'
  | 'postalCode'
  | 'pushNotificationToken'
  | 'roles'
  | 'timezone'
>;

export interface ChatMessages {
  _id: string;
  chat: string;
  createdAt: Date;
  deletedAt?: Date;
  deletedBy?: Date;
  image?: string;
  message: string;
  readBy: string[];
  type?: ChatMessageType;
  sended: boolean;
  updatedAt: Date;
  user: string;
}

export interface UserWritingInput {
  chat: string;
  isWriting: boolean;
  user: string;
}

export interface Chat {
  _id: string;
  createdAt: Date;
  deletedAt?: Date;
  deletedBy?: Date;
  enabled: boolean;
  lastChatMessage: ChatMessages;
  participants: UserChat[];
  updatedAt: Date;
  travel: Travel[];
  whoIsWriting: string[];
  unreaded?: number;
}

export interface CreateChatMessage {
  chat: string;
  message: string;
}

export interface UserWriting {
  chat: string;
  isWriting: boolean;
  user: string;
}

export enum ChatMessageType {
  USER = 'USER',
  SYSTEM = 'SYSTEM',
}

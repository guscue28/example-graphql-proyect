import { gql } from '@apollo/client';

export const GET_CHAT_MESSAGES = gql`
  query getChatMessages($chatId: ObjectId!, $pagination: PaginationInput!) {
    getChatMessages(chatId: $chatId, pagination: $pagination) {
      chatMessages {
        _id
        chat
        createdAt
        message
        readBy
        sended
        type
        updatedAt
        user
      }
      count
    }
  }
`;

export const GET_MY_CHATS = gql`
  query getMyChats($pagination: PaginationInput!) {
    getMyChats(pagination: $pagination) {
      chats {
        _id
        createdAt
        enabled
        lastChatMessage {
          _id
          chat
          createdAt
          message
          readBy
          sended
          updatedAt
          user
        }
        participants {
          _id
          firstName
          lastName
          roles
          picture
        }
        travels {
          _id
        }
        updatedAt
        whoIsWriting
        unreaded
      }
    }
  }
`;

export const ADD_CHAT_MESSAGE = gql`
  mutation addChatMessage($payload: CreateChatMessageInput!) {
    addChatMessage(payload: $payload) {
      _id
      chat
      createdAt
      message
      readBy
      sended
      updatedAt
      user
    }
  }
`;

export const USER_IS_WRITING = gql`
  mutation userIsWriting($chat: ObjectId!, $isWriting: Boolean!, $user: ObjectId!) {
    userIsWriting(payload: { chat: $chat, isWriting: $isWriting, user: $user }) {
      _id
    }
  }
`;

export const CHANGE_CHAT = gql`
  subscription chatChanged($chat: ObjectId!) {
    chatChanged(chat: $chat) {
      _id
      createdAt
      enabled
      participants {
        _id
        firstName
        lastName
        roles
      }
      whoIsWriting
    }
  }
`;

export const CHAT_MESSAGE_ADDED = gql`
  subscription chatMessageAdded($chat: ObjectId!) {
    chatMessageAdded(chat: $chat) {
      _id
      chat
      createdAt
      message
      readBy
      sended
      updatedAt
      user
    }
  }
`;

export const MARK_MESSAGES_AS_READ = gql`
  mutation markMessagesAsRead($chatMessagesIds: [ObjectId!]!) {
    markMessageAsRead(chatMessagesIds: $chatMessagesIds) {
      success
    }
  }
`;

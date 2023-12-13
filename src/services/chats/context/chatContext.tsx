import React, { createContext } from 'react';
import { ADD_CHAT_MESSAGE, CHANGE_CHAT, CHAT_MESSAGE_ADDED, GET_CHAT_MESSAGES, GET_MY_CHATS, MARK_MESSAGES_AS_READ, USER_IS_WRITING } from '../chat.graphql';
import { Chat, ChatMessages, PaginationInput } from '../chat.interface';
import { getGraphqlError } from '../../../helpers';
import { AuthContext } from '../../auth/context/authContext';
import { messageReducer } from './chatReducer';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import moment from 'moment';
var alert = require('../../../assets/audio/chatAlert.mp3');

var Sound = require('react-native-sound');
Sound.setCategory('Playback');
var notification = new Sound(alert, (error: any) => {
  if (error) {
    console.log('failed to load the sound', error);
    return;
  }
  console.log('duration in seconds: ' + notification.getDuration() + 'number of channels: ' + notification.getNumberOfChannels());
});
type MessageContextProps = {
  chats: Chat[];
  chatsCount: number;
  chatMessages: ChatMessages[];
  chatMessagesCount: number;
  chatsModal: boolean;
  getMyChats: (pagination: PaginationInput) => Promise<void>;
  getChatsMessages: (chatId: string, pagination: PaginationInput) => Promise<void>;
  getMoreChatsMessages: (chatId: string, pagination: PaginationInput) => Promise<void>;
  sendMessage: (message: string, chatId: string) => Promise<void>;
  subscribeToChat: (chatId: string) => { unsubscribe: () => void } | void;
  whoIsTyping: (chat: string, isWriting: boolean, usr: string) => Promise<void>;
  chatChanged: (chat: string) => { unsubscribe: () => void } | void;
};

const messageInitial: any = {
  chatMessages: {
    messages: [],
    count: 0,
  },
  myChats: {
    chats: [],
    count: 0,
  },
};

export const MessageContext = createContext({} as MessageContextProps);

export const MessageProvider = ({ children }: any) => {
  const { apolloClient, user } = React.useContext(AuthContext);
  const [state, dispatch] = React.useReducer(messageReducer, messageInitial);
  const [chatsModal, setChatsModal] = React.useState<boolean>(false);
  const playPause = () => {
    notification.play((success: any) => {
      if (success) {
        console.log('successfully finished playing');
      } else {
        console.log('playback failed due to audio decoding errors');
      }
    });
  };
  const getMyChats = async (pagination: PaginationInput) => {
    try {
      const { data } = await apolloClient!.query({
        query: GET_MY_CHATS,
        variables: {
          pagination,
        },
        fetchPolicy: 'no-cache',
      });
      // setChats(data.getMyChats.chats);
      // setChatsCount(data.getMyChats.count);
      dispatch({
        type: 'GETTING_MY_CHATS',
        payload: {
          chats: data.getMyChats.chats,
          count: data.getMyChats.count,
        },
      });
    } catch (error) {
      console.log('error', error);
      getGraphqlError(error);
    }
  };

  const getChatsMessages = async (chatId: string, pagination: PaginationInput) => {
    try {
      const { data } = await apolloClient!.query({
        query: GET_CHAT_MESSAGES,
        variables: { chatId, pagination },
        fetchPolicy: 'no-cache',
      });
      const messages = data.getChatMessages.chatMessages;
      const count = data.getChatMessages.count;
      await apolloClient!.query({
        query: MARK_MESSAGES_AS_READ,
        variables: { chatMessagesIds: messages.map((message: any) => message._id) },
        fetchPolicy: 'no-cache',
      });
      dispatch({
        type: 'GETTING_ALL_MESSAGES',
        payload: {
          messages,
          count,
        },
      });
    } catch (error) {
      console.log('error', error);
      getGraphqlError(error);
    }
  };

  const getMoreChatsMessages = async (chatId: string, pagination: PaginationInput) => {
    try {
      const { data } = await apolloClient!.query({
        query: GET_CHAT_MESSAGES,
        variables: { chatId, pagination },
        fetchPolicy: 'no-cache',
      });
      const messages = data.getChatMessages.chatMessages;
      const count = data.getChatMessages.count;
      await apolloClient!.query({
        query: MARK_MESSAGES_AS_READ,
        variables: { chatMessagesIds: messages.map((message: any) => message._id) },
        fetchPolicy: 'no-cache',
      });
      dispatch({
        type: 'GET_MORE_MESSAGES',
        payload: {
          messages,
          count,
        },
      });
    } catch (error) {
      console.log('error', error);
      getGraphqlError(error);
    }
  };

  const subscribeToChat = (chatId: string): { unsubscribe: () => void } | void => {
    try {
      const subscribe = apolloClient!
        .subscribe({
          query: CHAT_MESSAGE_ADDED,
          variables: {
            chat: chatId,
          },
        })
        .subscribe(({ data }) => {
          setTimeout(() => {
            playPause();
            dispatch({
              type: 'MESSAGE_ADDED',
              payload: {
                message: data.chatMessageAdded,
                chatId,
              },
            });
          }, 1000);
        });
      return subscribe;
    } catch (error) {
      console.log('error', error);
      getGraphqlError(error);
    }
  };

  const sendMessage = async (message: string, chatId: string) => {
    try {
      const _id = uuidv4();
      dispatch({
        type: 'ADDING_MESSAGE',
        payload: {
          newMessage: {
            _id,
            message,
            chat: chatId,
            createdAt: moment().toDate(),
            updatedAt: moment().toDate(),
            readBy: [],
            sended: false,
            user: user!._id,
          },
        },
      });
      const { data } = await apolloClient!.mutate({
        mutation: ADD_CHAT_MESSAGE,
        variables: {
          payload: {
            message,
            chat: chatId,
          },
        },
      });
      dispatch({
        type: 'ADD_MESSAGE',
        payload: {
          message: data.addChatMessage,
          _id,
        },
      });
    } catch (error) {
      getGraphqlError(error);
      setChatsModal(true);
      setTimeout(() => {
        setChatsModal(false);
      }, 3000);
    }
  };

  const whoIsTyping = async (chatId: string, isWriting: boolean, userId: string) => {
    try {
      await apolloClient!.mutate({
        mutation: USER_IS_WRITING,
        variables: {
          chat: chatId,
          isWriting: isWriting,
          user: userId,
        },
        fetchPolicy: 'no-cache',
      });
    } catch (error) {
      console.log('error', error);
      getGraphqlError(error);
    }
  };

  const chatChanged = (chat: string): { unsubscribe: () => void } | void => {
    try {
      const chatSubscribe = apolloClient!
        .subscribe({
          query: CHANGE_CHAT,
          variables: {
            chat,
          },
        })
        .subscribe(({ data }) => {
          dispatch({
            type: 'CHAT_CHANGED',
            payload: {
              chat: data.chatChanged,
            },
          });
        });
      return chatSubscribe;
    } catch (error) {
      console.log('error', error);
      getGraphqlError(error);
    }
  };
  // console.log('con', conversation);

  return (
    <MessageContext.Provider
      value={{
        chatsModal,
        chats: state.myChats.chats,
        chatsCount: state.myChats.count,
        chatMessages: state.chatMessages.messages,
        chatMessagesCount: state.chatMessages.count,
        getMyChats,
        getChatsMessages,
        getMoreChatsMessages,
        sendMessage,
        subscribeToChat,
        whoIsTyping,
        chatChanged,
      }}>
      {children}
    </MessageContext.Provider>
  );
};

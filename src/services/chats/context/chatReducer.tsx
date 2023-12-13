import { Chat, ChatMessages } from '../chat.interface';

export interface MessageState {
  chatMessages: {
    messages: ChatMessages[];
    count: number;
  };
  myChats: {
    chats: Chat[];
    count: number;
  };
}

type MessageAction =
  | {
      type: 'GETTING_ALL_MESSAGES';
      payload: {
        messages: ChatMessages[];
        count: number;
      };
    }
  | {
      type: 'GET_MORE_MESSAGES';
      payload: {
        messages: ChatMessages[];
        count: number;
      };
    }
  | {
      type: 'CHAT_CHANGED';
      payload: {
        chat: Chat;
      };
    }
  | {
      type: 'GETTING_MY_CHATS';
      payload: {
        chats: Chat[];
        count: number;
      };
    }
  | {
      type: 'ADDING_MESSAGE';
      payload: {
        newMessage: ChatMessages;
      };
    }
  | {
      type: 'ADD_MESSAGE';
      payload: {
        message: ChatMessages;
        _id: string;
      };
    }
  | {
      type: 'MESSAGE_ADDED';
      payload: {
        message: ChatMessages;
        chatId: string;
      };
    };

export const messageReducer = (state: MessageState, action: MessageAction): MessageState => {
  switch (action.type) {
    case 'GETTING_ALL_MESSAGES':
      return {
        ...state,
        chatMessages: {
          messages: action.payload.messages,
          count: action.payload.count,
        },
      };
    case 'GET_MORE_MESSAGES':
      return {
        ...state,
        chatMessages: {
          messages: [...action.payload.messages, ...state.chatMessages.messages],
          count: action.payload.count,
        },
      };
    case 'CHAT_CHANGED':
      return {
        ...state,
        myChats: {
          chats: state.myChats.chats.map(chat => {
            if (chat._id === action.payload.chat._id) {
              return { ...chat, ...action.payload.chat };
            }
            return chat;
          }),
          count: state.myChats.count,
        },
      };
    case 'GETTING_MY_CHATS':
      return {
        ...state,
        myChats: {
          chats: action.payload.chats,
          count: action.payload.count,
        },
      };
    case 'ADDING_MESSAGE':
      return {
        ...state,
        chatMessages: {
          messages: [...state.chatMessages.messages, action.payload.newMessage],
          count: state.chatMessages.count + 1,
        },
      };
    case 'ADD_MESSAGE':
      return {
        ...state,
        chatMessages: {
          ...state.chatMessages,
          messages: state.chatMessages.messages.map((msg: ChatMessages) => {
            return msg._id === action.payload._id ? action.payload.message : msg;
          }),
        },
      };
    case 'MESSAGE_ADDED':
      const validation = state.chatMessages.messages.some((msg: ChatMessages) => {
        return msg._id === action.payload.message._id;
      });
      if (!validation) {
        return {
          ...state,
          chatMessages: {
            messages: [...state.chatMessages.messages, action.payload.message],
            count: state.chatMessages.count + 1,
          },
          myChats: {
            ...state.myChats,
            chats: state.myChats.chats.map((chat: Chat) => {
              return String(chat._id) === String(action.payload.chatId)
                ? {
                    ...chat,
                    lastChatMessage: action.payload.message,
                  }
                : chat;
            }),
          },
        };
      } else {
        return {
          ...state,
          myChats: {
            ...state.myChats,
            chats: state.myChats.chats.map((chat: Chat) => {
              return chat._id === action.payload.chatId
                ? {
                    ...chat,
                    lastChatMessage: action.payload.message,
                  }
                : chat;
            }),
          },
        };
      }
    default:
      return state;
  }
};

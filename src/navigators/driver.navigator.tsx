import React, { useEffect } from 'react';
import { Dimensions, Image } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MapStackNavigator } from './Map/map.navigator';
// import { MyNotificationStack } from './Notifications/notification.navigator';
import { MyProfileStack } from './Account/account.navigator';
import { Icon } from 'galio-framework';
import { MessagesStack } from './Chats/chats.navigator';
import { RiderTravelsStack } from './Riders/ridersTravel.navigator';
//Context
import { AuthContext } from '../services/auth/context/authContext';
import IconBadge from 'react-native-icon-badge';
import { Text } from 'galio-framework';
//Assets
import LocationIcon from '../assets/icons/location.icon.svg';
import LocationFocused from '../assets/icons/location-yellow.svg';
import MessagesIcon from '../assets/icons/messages.svg';
import MessagesFocused from '../assets/icons/messages-yellow.svg';
// import NotificationIcon from '../assets/icons/notification.svg';
// import NotificationFocused from '../assets/icons/notification-yellow.svg';
import TravelsIcon from '../assets/icons/viajes-gray.svg';
import TravelsIconFocused from '../assets/icons/viajes-yellow.svg';
import { moderateScale } from 'react-native-size-matters';
import { useOrientation } from '../hooks/useOrientation';
import { Pagination } from '../interfaces/pagination.interface';
import { MessageContext } from '../services/chats/context/chatContext';

export type TabParamList = {
  HomeMapTab: undefined;
  MyNotificationsTab: undefined;
  MyMessagesTab: undefined;
  MyProfileTab: undefined;
  MyTravelsTab: undefined;
};
const { width } = Dimensions.get('screen');
const Tab = createBottomTabNavigator<TabParamList>();

export const DriverTabNavigator = () => {
  const orientation = useOrientation();
  const { user, hide } = React.useContext(AuthContext);
  const [chatsUser, setChatsUser] = React.useState<number>(0)

  const { getMyChats, chats } = React.useContext(MessageContext);


  const getChatsUser = async () => {
    const pagination: Pagination = {
      itemsPerPage: 10,
      page: 1,
      searchKey: '',
    };
    getMyChats(pagination);
    setChatsUser(chats.length)
  }

  useEffect(() => {
    getChatsUser()
  }, [])

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: true,
        tabBarStyle: {
          width: orientation === 'PORTRAIT' ? '100%' : '50%',
          alignSelf: 'center',
          backgroundColor: '#222222',
          borderTopColor: 'transparent',
          elevation: 10,
          shadowOffset: {
            width: 0,
            height: 10,
          },
          display: hide ? 'none' : undefined,
          shadowOpacity: 0.5,
          shadowRadius: 5,
          shadowColor: 'white',
          borderTopRightRadius: 20,
          borderTopLeftRadius: 20,
          position: 'absolute',
          bottom: 0,
          left: orientation === 'PORTRAIT' ? 0 : width / 4.2,
        },
        tabBarShowLabel: false,
      }}>
      <Tab.Screen
        name="HomeMapTab"
        component={MapStackNavigator}
        options={{
          tabBarIcon: ({ focused }) =>
            focused ? <LocationFocused color={'#ffae3b'} width={20} height={20} /> : <LocationIcon fill={'gray'} color={'#ffae3b'} width={20} height={20} />,
        }}
      />
      <Tab.Screen
        name="MyMessagesTab"
        component={MessagesStack}
        options={{
          tabBarIcon: ({ focused }) =>
            focused ? (
              <IconBadge
                MainElement={<MessagesFocused color="gray" width={20} height={20} />}
                BadgeElement={<Text style={{ color: '#FFFFFF' }}>{chatsUser}</Text>}
                IconBadgeStyle={{ width: 20, height: 20, backgroundColor: 'red', left: 13, top:-8 }}
                Hidden={chatsUser === 0}
              />
            ) : (
              <IconBadge
                MainElement={<MessagesIcon color="gray" width={20} height={20} />}
                BadgeElement={<Text style={{ color: '#FFFFFF' }}>{chatsUser}</Text>}
                IconBadgeStyle={{ width: 20, height: 20, backgroundColor: 'red', left: 13, top: -8 }}
                Hidden={chatsUser === 0}
              />
            ),
        }}
      />
      {/* <Tab.Screen
        name="MyNotificationsTab"
        component={MyNotificationStack}
        options={{
          tabBarIcon: ({ focused }) =>
            focused ? <NotificationFocused color="gray" width={20} height={20} /> : <NotificationIcon color="gray" width={20} height={20} />,
        }}
      /> */}
      <Tab.Screen
        name="MyTravelsTab"
        component={RiderTravelsStack}
        options={{
          tabBarIcon: ({ focused }) =>
            focused ? <TravelsIconFocused color="gray" width={25} height={25} /> : <TravelsIcon color="gray" width={25} height={25} />,
        }}
      />
      <Tab.Screen
        name="MyProfileTab"
        component={MyProfileStack}
        options={{
          tabBarIcon: ({ focused }) =>
            user?.picture ? (
              <Image
                source={{ uri: user.picture }}
                style={{ width: moderateScale(35), height: moderateScale(35), borderRadius: 50, borderWidth: 1.5, borderColor: '#ffae3b' }}
              />
            ) : (
              <Icon name="user" family="AntDesign" color={focused ? '#ffae3b' : 'gray'} size={20} />
            ),
        }}
      />
    </Tab.Navigator>
  );
};

export default DriverTabNavigator;

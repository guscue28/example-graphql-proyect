/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App, { navigationRef, NotificationTypesEnum } from './App';
import { name as appName } from './app.json';
import messaging from '@react-native-firebase/messaging';
import notifee, { AndroidImportance, AndroidStyle, EventType } from '@notifee/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

messaging().setBackgroundMessageHandler(async message => {
  await notifee.requestPermission();
  console.log('Message received: ', message);
  const channelId = await notifee.createChannel({
    id: message.data.type === NotificationTypesEnum.CHAT_MESSAGE ? NotificationTypesEnum.CHAT_MESSAGE : NotificationTypesEnum.SYSTEM,
    name: message.data.type === NotificationTypesEnum.CHAT_MESSAGE ? 'Chat Channel' : 'System Channel',
    importance: AndroidImportance.DEFAULT,
    vibration: true,
    vibrationPattern: [300, 500],
  });
  let notification = {};
  let parsedMessages = [];
  if (message.data.type === NotificationTypesEnum.CHAT_MESSAGE) {
    const messages = await AsyncStorage.getItem(`@${message.data.groupId}`);
    if (messages) {
      const prevNotification = await JSON.parse(messages);
      parsedMessages = prevNotification.messages;
      notifee.cancelNotification(prevNotification.id);
    }
    parsedMessages.push({
      text: message.data.message,
      timestamp: new Date().getTime(),
    });
    notification = {
      // title: message.notification.title,
      // body: message.notification.body,
      data: message.data,
      android: {
        channelId,
        smallIcon: 'ic_notification',
        vibrationPattern: [300, 500],
        groupId: message.data.groupId,
        style: {
          type: AndroidStyle.MESSAGING,
          person: {
            name: `${message.data.firstName} ${message.data.lastName}`,
            icon: message.data.picture === '' ? 'ic_notification_pad' : message.data.picture,
            important: true,
          },
          messages: parsedMessages,
          group: true,
        },
        pressAction: {
          id: 'default',
        },
        actions: [
          {
            title: 'Marcar como leido',
            pressAction: {
              id: 'mark_read',
            },
          },
        ],
      },
    };
  } else {
    notification = {
      title: message.notification.title,
      body: message.notification.body,
    };
  }
  const id = await notifee.displayNotification(notification);
  if (message.data.type === NotificationTypesEnum.CHAT_MESSAGE) {
    AsyncStorage.setItem(
      `@${message.data.groupId}`,
      JSON.stringify({
        id,
        messages: parsedMessages,
      }),
    );
  }
});

notifee.onBackgroundEvent(async ({ type, detail }) => {
  const { notification, pressAction } = detail;
  console.log('Notifee Background Event', notification);
  if (type === EventType.ACTION_PRESS && pressAction.id === 'mark_read') {
    await notifee.cancelNotification(notification.id);
    await AsyncStorage.removeItem(`@${notification.data.groupId}`);
    console.log('Notifee Action Pressed', pressAction);
  } else if (type === EventType.PRESS) {
    const travel = await AsyncStorage.getItem('currentTravel');
    if (travel) {
      const travelData = JSON.parse(travel);
      const interval = setInterval(() => {
        if (navigationRef && navigationRef.current) {
          navigationRef.current.navigate('DriverTabNavigation', {
            screen: 'MyMessagesTab',
            params: {
              screen: 'ChatScreen',
              params: {
                id: notification.data.groupId,
                enable: true,
                participants: [travelData.driver, travelData.client],
              },
            },
          });
          clearInterval(interval);
        }
      }, 700);
    }
  }
});

AppRegistry.registerComponent(appName, () => App);

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { PermissionsProvider } from './src/services/auth/context/permissionsContext';
import { AuthProvider, AuthContext } from './src/services/auth/context/authContext';
import { AppConfigProvider } from './src/services/appConfig/context/appConfigContext';
import { LogBox, Platform, SafeAreaView, StatusBar, StyleSheet } from 'react-native';
import { ApolloProvider } from '@apollo/client';
import { LoadingScreen } from './src/screens/loading/loadingScreen';
import SplashScreen from 'react-native-splash-screen';
import { MapProvider } from './src/services/map/context/mapContext';
import { MessageProvider } from './src/services/chats/context/chatContext';
import MainNavigator from './src/navigators/app.navigator';
import messaging from '@react-native-firebase/messaging';
import notifee, { AndroidImportance, AndroidStyle, EventType } from '@notifee/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SystemNavigationBar from 'react-native-system-navigation-bar';
import Config from 'react-native-config';

LogBox.ignoreLogs(['Remote debugger is in a background tab']);
export enum NotificationTypesEnum {
  CHAT_MESSAGE = 'CHAT_MESSAGE',
  SYSTEM = 'SYSTEM',
}
export const navigationRef: any = React.createRef();
const AppState = ({ children }: any) => {
  const { apolloClient } = React.useContext(AuthContext);

  console.log('====================================');
  console.log(`${Config.API_URL}/graphql`);
  console.log('====================================');
  // recieve notification
  const onMessageReceived = async (message: any) => {
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
  };

  const requestUserPermission = async () => {
    await messaging().requestPermission();
  };

  React.useEffect(() => {
    requestUserPermission();
    const unsubscribe = messaging().onMessage(onMessageReceived);
    return unsubscribe;
  }, []);

  notifee.onForegroundEvent(async ({ type, detail }) => {
    const { notification, pressAction }: any = detail;
    console.log('Notifee Foreground Event', notification);
    if (type === EventType.ACTION_PRESS && pressAction.id === 'mark_read') {
      await notifee.cancelNotification(notification.id);
      await AsyncStorage.removeItem(`@${notification.data.groupId}`);
      console.log('Notifee Action Pressed', pressAction);
    } else if (type === EventType.PRESS) {
      const travel = await AsyncStorage.getItem('currentTravel');
      if (travel) {
        const travelData = JSON.parse(travel);
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
      }
    }
  });

  React.useEffect(() => {
    SplashScreen.hide();
    Platform.OS === 'ios' ? StatusBar.setHidden(false, undefined) : StatusBar.setBackgroundColor('#222222');
    SystemNavigationBar.stickyImmersive();
  }, []);

  // React.useEffect(() => {
  //   // const unsubscribe = dynamicLinks().onLink(handleDynamicLink);
  //   console.log('dinamyc link', dynamicLinks());
  //   // When the component is unmounted, remove the listener
  //   // return () => unsubscribe();
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  // React.useEffect(() => {
  //   console.log('nav', navigation);
  //   dynamicLinks()
  //     .getInitialLink()
  //     .then((link: any) => {
  //       console.log('dynamic link', link);
  //       if (link.url === 'https://movy.com.ve/auth/restorePassword') {
  //       }
  //     });
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  if (!apolloClient) {
    return <LoadingScreen />;
  }

  return (
    <ApolloProvider client={apolloClient}>
      <PermissionsProvider>{children}</PermissionsProvider>
    </ApolloProvider>
  );

  /*return (
    <ApolloProvider client={makeApolloClient()}>
    <PermissionsProvider>
        { children }
    </PermissionsProvider>
    </ApolloProvider>
  )*/
};

export const App = () => {
  return (
    <NavigationContainer ref={navigationRef}>
      <StatusBar backgroundColor="transparent" hidden showHideTransition={'slide'} />
      <AuthProvider>
        <AppConfigProvider>
          <AppState>
            <SafeAreaView style={styles.safeArea} nativeID="1">
              <MapProvider>
                <MessageProvider>
                  <MainNavigator />
                </MessageProvider>
              </MapProvider>
            </SafeAreaView>
          </AppState>
        </AppConfigProvider>
      </AuthProvider>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
});

export default App;

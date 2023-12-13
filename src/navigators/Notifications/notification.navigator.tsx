import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { MyNotificationsScreen } from '../../screens/notifications/myNotificationsScreen';
import { NotificationScreen } from '../../screens/notifications/notificationScreen';
import { Block, Button, Text } from 'galio-framework';
import { StyleSheet } from 'react-native';

export type MyNotificationParamList = {
  MyNotificationsScreen: undefined;
  NotificationScreen: undefined;
};

const NotificationStack = createStackNavigator<MyNotificationParamList>();

export const MyNotificationStack = () => {
  return (
    <NotificationStack.Navigator
      initialRouteName="MyNotificationsScreen"
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: 'white' },
      }}>
      <NotificationStack.Screen
        options={{
          headerShown: true,
          header: ({ navigation }: any) => (
            <Block row style={styles.notificationTitle}>
              <Button
                icon="chevron-left"
                style={{ width: 30, height: 30 }}
                iconFamily="Feather"
                iconSize={24}
                onlyIcon
                iconColor="gray"
                color="#222222"
                onPress={() => navigation.goBack()}
              />
              <Text size={25} bold color="black">
                Notificaciones
              </Text>
            </Block>
          ),
        }}
        name="MyNotificationsScreen"
        component={MyNotificationsScreen}
      />
      <NotificationStack.Screen
        options={{
          headerShown: true,
          header: ({ navigation, route }: any) => (
            <Block row style={styles.notificationTitle}>
              <Button
                icon="chevron-left"
                style={{ width: 30, height: 30 }}
                iconFamily="Feather"
                iconSize={24}
                onlyIcon
                iconColor="gray"
                color="#222222"
                onPress={() => navigation.goBack()}
              />
              <Text size={25} bold color="black">
                {route.params.name}
              </Text>
            </Block>
          ),
        }}
        name="NotificationScreen"
        component={NotificationScreen}
      />
    </NotificationStack.Navigator>
  );
};

const styles = StyleSheet.create({
  containerIcon: {
    backgroundColor: '#222222',
    width: 40,
    height: 40,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  notificationTitle: {
    marginTop: 10,
    marginHorizontal: 20,
    alignItems: 'center',
  },
  notificationContainer: {
    marginHorizontal: 20,
    marginTop: 20,
  },
  separationContainer: {
    marginTop: 30,
  },
  separationBar: {
    backgroundColor: 'lightgray',
    height: 0.5,
    width: '38%',
  },
});

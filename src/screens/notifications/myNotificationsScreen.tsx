import { Block, Text } from 'galio-framework';
import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { moderateScale } from 'react-native-size-matters';
// import {Image, StyleSheet, View} from 'react-native';
import { NotificationComponent } from '../../components/notifications/notification.component';

export interface dummyNotification {
  title: string;
  text: string;
  secondaryText: string;
  date: Date;
  state: string;
  type: string;
}

const dataDummy: dummyNotification[] = [
  {
    title: 'Frank Marcano',
    text: 'Lorem ipsum dolor sit amr.',
    secondaryText: 'cursus peilentesque',
    date: new Date(),
    state: 'unread',
    type: 'message',
  },
  {
    title: 'Moby app',
    text: 'Lorem ipsum dolor sit amet, consectetur.',
    secondaryText: 'cursus peilentesque',
    date: new Date('2022-03-27T15:26:24.184Z'),
    state: 'unread',
    type: 'notification',
  },
  {
    title: 'Ernesto Medina',
    text: 'Lorem ipsum dolor sit amet, consectetur.',
    secondaryText: 'cursus peilentesque',
    date: new Date('2022-03-26T06:21:24.184Z'),
    state: 'read',
    type: 'message',
  },
  {
    title: 'Ernesto Medina',
    text: 'Lorem ipsum dolor sit amet, consectetur.',
    secondaryText: 'cursus peilentesque',
    date: new Date('2022-03-26T06:21:24.184Z'),
    state: 'read',
    type: 'message',
  },
  {
    title: 'Moby app',
    text: 'Lorem ipsum dolor sit amet, consectetur.',
    secondaryText: 'cursus peilentesque',
    date: new Date('2022-03-27T15:26:24.184Z'),
    state: 'read',
    type: 'notification',
  },
];

export const MyNotificationsScreen = ({ navigation }: any) => {
  return (
    <ScrollView>
      <Block style={styles.notificationContainer}>
        {dataDummy
          .filter((item: dummyNotification) => item.state === 'unread')
          .map((item: dummyNotification, i: number) => (
            <Block key={i}>
              <NotificationComponent item={item} opacity={1} />
            </Block>
          ))}
        <Block row middle space="around" style={styles.separationContainer}>
          <View style={styles.separationBar} />
          <Text>Vistas</Text>
          <View style={styles.separationBar} />
        </Block>
        {dataDummy
          .filter((item: dummyNotification) => item.state !== 'unread')
          .map((item: dummyNotification, i: number) => (
            <Block key={i}>
              <NotificationComponent item={item} opacity={0.75} />
            </Block>
          ))}
        <View style={{ height: moderateScale(70) }} />
      </Block>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  notificationTitle: {
    marginTop: 10,
    marginHorizontal: 20,
  },
  notificationContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  separationContainer: {
    marginTop: 30,
  },
  separationBar: {
    backgroundColor: 'lightgray',
    height: 0.5,
    width: '40%',
  },
});

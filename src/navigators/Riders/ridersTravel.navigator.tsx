import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { RiderTravelsScreen } from '../../screens/riders/riderTravels';
import { Block, Button, Text } from 'galio-framework';
import { StyleSheet } from 'react-native';
import { TravelScreen } from '../../screens/account/travelScreen';

export type RiderTravelsStackParamList = {
  RiderTravelsScreen: undefined;
  TravelSheduleScreen: undefined;
};

const RiderTravelsStackNavigator = createStackNavigator<RiderTravelsStackParamList>();

export const RiderTravelsStack = () => {
  return (
    <RiderTravelsStackNavigator.Navigator
      initialRouteName="RiderTravelsScreen"
      screenOptions={{
        headerShown: true,
        cardStyle: { backgroundColor: 'white' },
      }}>
      <RiderTravelsStackNavigator.Screen
        options={{
          header: ({ navigation }: any) => (
            <Block style={styles.notificationTitle} row>
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
                Viajes Programados
              </Text>
            </Block>
          ),
        }}
        name="RiderTravelsScreen"
        component={RiderTravelsScreen}
      />
      <RiderTravelsStackNavigator.Screen
        name="TravelSheduleScreen"
        component={TravelScreen}
        options={{
          headerShown: true,
          header: ({ navigation }: any) => (
            <Block
              style={{
                marginTop: 10,
                marginHorizontal: 20,
                alignItems: 'center',
              }}
              row>
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
            </Block>
          ),
        }}
      />
      {/* <RiderTravelsStackNavigator.Screen
        options={{
          header: ({ navigation }: any) => (
            <Block style={styles.notificationTitle} row>
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
                Viajes Programados
              </Text>
            </Block>
          ),
        }}
        name="RiderTravelsScreen"
        component={RiderTravelsScreen}
      /> */}
    </RiderTravelsStackNavigator.Navigator>
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
});

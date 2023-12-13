import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { MapScreen } from '../../screens/map/mapScreen';
import { GeocodingObject } from '@timwangdev/react-native-geocoder';
import { Location } from '../../hooks/useLocation';
import { FinishTravelScreen } from '../../screens/map/finishTravelScreen';
import { Block, Button, Text } from 'galio-framework';
import { StyleSheet } from 'react-native';
import { CompleteFavoriteLocation } from '../../screens/account/completeFavoriteLocationScreen';
// import { AuthContext } from '../../services/auth/context/authContext';

export type MapStackParamList = {
  MapScreen: any;
  RegisterJourney: { InitLocation: Location; FinalLocations: GeocodingObject[] };
  RegisterScheduleJourney: any;
  FinishTravel: undefined;
  CompleteFavoriteLocation: {
    location: {
      latitude: number;
      longitude: number;
    };
    address: string;
  };
};

const MapStack = createStackNavigator<MapStackParamList>();

export const MapStackNavigator = () => {
  // const { hideTab } = React.useContext(AuthContext);
  return (
    <MapStack.Navigator
      initialRouteName="MapScreen"
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: 'white' },
      }}>
      <MapStack.Screen name="MapScreen" component={MapScreen} />
      <MapStack.Screen
        options={{
          headerShown: true,
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
                Completa los datos
              </Text>
            </Block>
          ),
        }}
        name="CompleteFavoriteLocation"
        component={CompleteFavoriteLocation}
      />
      <MapStack.Screen
        options={{
          headerShown: true,
          header: () => (
            <Block style={styles.notificationTitle} row middle>
              {/* <Button
                icon="chevron-left"
                style={{ width: 30, height: 30 }}
                iconFamily="Feather"
                iconSize={24}
                onlyIcon
                iconColor="gray"
                color="#222222"
                onPress={() => navigation.goBack()}
              /> */}
              <Text size={25} bold color="black">
                ¡Tu viaje ha finalizado!
              </Text>
            </Block>
          ),
        }}
        name="FinishTravel"
        component={FinishTravelScreen}
      />
    </MapStack.Navigator>
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

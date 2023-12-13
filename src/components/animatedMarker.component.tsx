import * as React from 'react';
import { Platform, Image } from 'react-native';
import { MarkerAnimated, AnimatedRegion, AnimatedRegionTimingConfig } from 'react-native-maps';
import { User } from '../services/user/user.interface';
export interface animatedMarkerProps {
  user: User;
  vehicleSelected: boolean;
  onPress: (user: User) => void;
  displayDriver: (bool: boolean) => void;
  image: any;
  size: number;
  hide?: boolean;
}

export const AnimatedMarker = React.memo(
  ({ user, onPress, image, size, hide, displayDriver, vehicleSelected }: animatedMarkerProps) => {
    const marker = React.useRef<any>();
    const coordinate = React.useRef<any>(
      new AnimatedRegion({
        latitude: user && user.location && user.location.coordinates.length ? user.location.coordinates[1] : 0,
        longitude: user && user.location && user.location.coordinates.length ? user.location.coordinates[0] : 0,
        latitudeDelta: 0.11,
        longitudeDelta: 0.11,
      }),
    );
    React.useEffect(() => {
      // if (user._id === '624509a48e7c52f28fed5241') {
      //   console.log('user', user);
      //   console.log('animated', user.location?.coordinates);
      animateMarker();
      // }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

    const animateMarker = () => {
      let newCoordinate: AnimatedRegionTimingConfig = {
        latitude: user && user.location && user.location.coordinates.length ? user.location.coordinates[1] : 0,
        longitude: user && user.location && user.location.coordinates.length ? user.location.coordinates[0] : 0,
        latitudeDelta: 0.11,
        longitudeDelta: 0.11,
        useNativeDriver: Platform.OS === 'ios' ? false : true,
      };

      if (Platform.OS === 'android') {
        if (marker) {
          marker.current.animateMarkerToCoordinate(newCoordinate, 500); //  number of duration between points
        }
      } else {
        coordinate.current.timing(newCoordinate).start();
      }
    };

    return (
      // <Marker
      <MarkerAnimated
        style={{ display: hide ? 'none' : undefined }}
        ref={marker}
        onPress={() => (!vehicleSelected ? onPress(user) : displayDriver(true))}
        rotation={user && user.location && user.location.compassDegrees ? user.location.compassDegrees : 0}
        anchor={{ x: 0.5, y: 0.5 }}
        coordinate={coordinate.current}>
        <Image source={image} style={[{ width: size, height: size, resizeMode: 'contain' }]} />
      </MarkerAnimated>
    );
  },
  () => {
    return false;
  },
);

import * as React from 'react';
import MapViewDirections, { MapDirectionsResponse } from 'react-native-maps-directions';
import { Location } from '../../hooks/useLocation';
import { User } from '../../services/user/user.interface';

export interface CustomMapViewDirectionProps {
  origin: {
    latitude: number;
    longitude: number;
  };
  destination: {
    latitude: number;
    longitude: number;
  };
  mapRef?: any;
  GOOGLE_MAPS_APIKEY: string;
  color: string;
  width: number;
  driver?: User;
  openModal?: boolean;
  scheduleTravel?: boolean;
  setResult?: (result: MapDirectionsResponse) => void;
  fitToCoordinates?: (result: MapDirectionsResponse) => void;
  setSnapshot?: (snapshot: boolean) => void;
  setMapSnapshot?: (mapSnapshot: string) => void;
  selectDriver?: (user: User, distance: number, duration: number, openModal?: boolean) => void;
  selectSheduleTravel?: (distance: number, duration: number) => void;
  setCoordinatesToClient?: (coordinates: Location[]) => void;
  setCoordinatesToDestination?: (coordinates: Location[]) => void;
  type: string;
}

export const CustomMapViewDirection = React.memo(
  ({
    origin,
    destination,
    mapRef,
    GOOGLE_MAPS_APIKEY,
    color,
    width,
    driver,
    openModal,
    scheduleTravel,
    setResult,
    fitToCoordinates,
    setSnapshot,
    setMapSnapshot,
    selectDriver,
    selectSheduleTravel,
    setCoordinatesToClient,
    setCoordinatesToDestination,
    type,
  }: CustomMapViewDirectionProps) => {
    return (
      <MapViewDirections
        origin={origin}
        destination={destination}
        apikey={GOOGLE_MAPS_APIKEY}
        strokeWidth={width}
        strokeColor={color}
        mode="DRIVING"
        precision="high"
        language="es"
        // timePrecision="high"
        optimizeWaypoints={false}
        geodesic
        onError={(error: string) => {
          console.log('origin', origin);
          console.log('destination', destination);
          console.log('apikey', GOOGLE_MAPS_APIKEY);

          console.log('TYPE MAPVIEWDIRECTION', type);

          const errorValue = error.indexOf('ZERO_RESULTS');
          console.log('errorValue', errorValue > -1);

          console.log('error', typeof error, error, type);

          //TODO: Remove actual distance and duration if error
        }}
        onReady={(result: MapDirectionsResponse) => {
          try {
            console.log('TYPE MAPVIEWDIRECTION', type);
            if (setResult) {
              setResult(result);
            }
            // setResult && setResult(result);
            fitToCoordinates && fitToCoordinates(result);
            if (driver && selectDriver) {
              selectDriver(driver, result.distance, result.duration, openModal);
            }
            // selectDriver && driver && selectDriver(driver, result.distance, result.duration, openModal);
            scheduleTravel && selectSheduleTravel && selectSheduleTravel(result.distance, result.duration);
            setSnapshot &&
              setMapSnapshot &&
              mapRef &&
              mapRef.current &&
              mapRef.current.takeSnapshot &&
              (setSnapshot(true),
              setTimeout(() => {
                mapRef.current
                  .takeSnapshot({
                    format: 'jpg',
                    quality: 0.5,
                    result: 'file',
                  })
                  .then((uri: any) => {
                    setMapSnapshot(uri);
                    setSnapshot(false);
                  });
              }, 1500));
            setCoordinatesToClient && setCoordinatesToClient(result.coordinates);
            setCoordinatesToDestination && setCoordinatesToDestination(result.coordinates);
          } catch (error) {
            console.log('TYPE MAPVIEWDIRECTION', type);
            console.log(error);
          }
        }}
      />
    );
  },
  () => {
    return false;
  },
);

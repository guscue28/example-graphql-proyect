import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, Appearance } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { MapDirectionsResponse } from 'react-native-maps-directions';
import { Location, useLocation } from '../../hooks/useLocation';
import { Travel, TravelStatuses } from '../../interfaces/travel.interface';
import { User, UserRoles } from '../../services/user/user.interface';
import { AnimatedMarker } from '../animatedMarker.component';
import { CustomMapViewDirection } from './mapViewDirection.component';

export interface CustomMapViewProps {
  mapRef: any;
  initPosition: {
    text: string;
    coords: Location | undefined;
  };
  finalPosition: {
    text: string;
    coords: Location | undefined;
  };
  GOOGLE_MAPS_APIKEY: string;
  nearbyDriversState: User[];
  selectDriver: (user: User, distance: number, duration: number, openModal?: boolean) => void;
  vehiclePreSelected: User | undefined;
  vehicleSelected: User | undefined;
  compassDegrees: number;
  user: User | null;
  userLocation: Location;
  currentTravel: Travel | undefined;
  scheduleTravel: boolean;
  selectSheduleTravel: (distance: number, duration: number) => void;
  setInitPosition: (initPosition: { text: string; coords: Location | undefined }) => void;
  setFinalPosition: (finalPosition: { text: string; coords: Location | undefined }) => void;
  setResult: (result: MapDirectionsResponse) => void;
  fitToCoordinates: (result: MapDirectionsResponse) => void;
  fitToUserLocation: (location: Location) => void;
  setOnRoadDriverModal: (val: boolean) => void;
  setMapSnapshot: (mapSnapshot: string) => void;
  setCoordinatesToClient?: (coordinates: Location[]) => void;
  setCoordinatesToDestination?: (coordinates: Location[]) => void;
  updateMagnetometer: (magnetometer: number) => void;
}

export const CustomMapView = React.memo(
  ({
    mapRef,
    initPosition,
    finalPosition,
    GOOGLE_MAPS_APIKEY,
    nearbyDriversState,
    selectDriver,
    vehiclePreSelected,
    vehicleSelected,
    compassDegrees,
    user,
    userLocation,
    currentTravel,
    scheduleTravel,
    setInitPosition,
    setFinalPosition,
    setResult,
    fitToCoordinates,
    fitToUserLocation,
    setOnRoadDriverModal,
    setMapSnapshot,
    setCoordinatesToClient,
    setCoordinatesToDestination,
    selectSheduleTravel,
    updateMagnetometer,
  }: CustomMapViewProps) => {
    const { coordstoText } = useLocation();
    const [driver, setDriver] = useState<User | undefined>(undefined);
    const [viewDriverSelected, setViewDriverSelected] = useState<boolean>(false);
    const [fitToUser, setFitToUser] = useState<boolean>(false);
    const [snapshot, setSnapshot] = useState<boolean>(false);
    const colorScheme = Appearance.getColorScheme();
    const mapStyle =
      colorScheme === 'dark'
        ? [
            {
              elementType: 'geometry',
              stylers: [
                {
                  color: '#242f3e',
                },
              ],
            },
            {
              elementType: 'labels.text.fill',
              stylers: [
                {
                  color: '#746855',
                },
              ],
            },
            {
              elementType: 'labels.text.stroke',
              stylers: [
                {
                  color: '#242f3e',
                },
              ],
            },
            {
              featureType: 'administrative.locality',
              elementType: 'labels.text.fill',
              stylers: [
                {
                  color: '#d59563',
                },
              ],
            },
            {
              featureType: 'poi',
              elementType: 'labels.text.fill',
              stylers: [
                {
                  color: '#d59563',
                },
              ],
            },
            {
              featureType: 'poi.park',
              elementType: 'geometry',
              stylers: [
                {
                  color: '#263c3f',
                },
              ],
            },
            {
              featureType: 'poi.park',
              elementType: 'labels.text.fill',
              stylers: [
                {
                  color: '#6b9a76',
                },
              ],
            },
            {
              featureType: 'road',
              elementType: 'geometry',
              stylers: [
                {
                  color: '#38414e',
                },
              ],
            },
            {
              featureType: 'road',
              elementType: 'geometry.stroke',
              stylers: [
                {
                  color: '#212a37',
                },
              ],
            },
            {
              featureType: 'road',
              elementType: 'labels.text.fill',
              stylers: [
                {
                  color: '#9ca5b3',
                },
              ],
            },
            {
              featureType: 'road.highway',
              elementType: 'geometry',
              stylers: [
                {
                  color: '#746855',
                },
              ],
            },
            {
              featureType: 'road.highway',
              elementType: 'geometry.stroke',
              stylers: [
                {
                  color: '#1f2835',
                },
              ],
            },
            {
              featureType: 'road.highway',
              elementType: 'labels.text.fill',
              stylers: [
                {
                  color: '#f3d19c',
                },
              ],
            },
            {
              featureType: 'transit',
              elementType: 'geometry',
              stylers: [
                {
                  color: '#2f3948',
                },
              ],
            },
            {
              featureType: 'transit.station',
              elementType: 'labels.text.fill',
              stylers: [
                {
                  color: '#d59563',
                },
              ],
            },
            {
              featureType: 'water',
              elementType: 'geometry',
              stylers: [
                {
                  color: '#17263c',
                },
              ],
            },
            {
              featureType: 'water',
              elementType: 'labels.text.fill',
              stylers: [
                {
                  color: '#515c6d',
                },
              ],
            },
            {
              featureType: 'water',
              elementType: 'labels.text.stroke',
              stylers: [
                {
                  color: '#17263c',
                },
              ],
            },
          ]
        : [];
    const selectionDriver = (driv: User) => {
      setDriver(driv);
    };
    // console.log(user);
    useEffect(() => {
      if (vehicleSelected) {
        setTimeout(() => {
          setViewDriverSelected(true);
        }, 500);
      }
    }, [vehicleSelected]);
    useEffect(() => {
      if (!fitToUser && userLocation.latitude !== 0 && userLocation.longitude !== 0 && !currentTravel) {
        // mapRef.current?.animateCamera(
        //   {
        //     center: {
        //       latitude: userLocation.latitude,
        //       longitude: userLocation.longitude,
        //     },
        //     pitch: 90,
        //     heading: 0,
        //     altitude: 0,
        //     zoom: 20,
        //   },
        //   {
        //     duration: 1000,
        //   },
        // );
        fitToUserLocation(userLocation);
        setFitToUser(true);
      }
    }, [currentTravel, fitToUser, fitToUserLocation, mapRef, userLocation]);

    // const openDriverModal = (bool: boolean) => {
    //   setOnRoadDriverModal(bool);
    // };

    useEffect(() => {
      if (vehiclePreSelected === undefined) {
        setDriver(undefined);
      }
    }, [vehiclePreSelected]);
    return (
      <MapView
        style={styles.container}
        ref={mapRef}
        loadingEnabled={true}
        loadingIndicatorColor={colorScheme === 'dark' ? 'lightgray' : '#222222'}
        loadingBackgroundColor={colorScheme === 'dark' ? '#242f3e' : 'lightgray'}
        customMapStyle={mapStyle}
        toolbarEnabled={false}
        showsUserLocation={false}
        showsCompass={false}
        showsBuildings={true}
        userLocationAnnotationTitle="Your location"
        tvParallaxTiltAngle={10}
        initialRegion={
          !userLocation.latitude || !userLocation.longitude || (userLocation.latitude === 0 && userLocation.longitude === 0)
            ? {
                latitude: 10.4971833,
                longitude: -66.888304,
                latitudeDelta: 0.11,
                longitudeDelta: 0.11,
              }
            : {
                latitude: userLocation.latitude,
                longitude: userLocation.longitude,
                latitudeDelta: 0.11,
                longitudeDelta: 0.11,
              }
        }
        accessibilityHint={'Mapa'}
        rotateEnabled={true}
        scrollDuringRotateOrZoomEnabled={false}
        maxZoomLevel={18}
        followsUserLocation={true}
        onUserLocationChange={location => {
          updateMagnetometer(location.nativeEvent.coordinate.heading);
        }}
        showsMyLocationButton={false}>
        {user && (
          <AnimatedMarker
            onPress={() => {}}
            displayDriver={() => {}}
            vehicleSelected={false}
            user={{
              ...user,
              idNumber: user.idNumber ? user.idNumber : 0,
              location: {
                coordinates: [userLocation.longitude, userLocation.latitude],
                type: 'Point',
                compassDegrees: user.roles?.includes(UserRoles.DRIVER) ? compassDegrees : 0,
              },
            }}
            size={user && user.roles?.includes(UserRoles.DRIVER) ? 40 : 28}
            image={user && user.roles?.includes(UserRoles.DRIVER) ? require('../../assets/vehiculoIconYellow.png') : require('../../assets/icons/man.png')}
          />
        )}
        {initPosition && initPosition.coords && initPosition.coords.latitude && initPosition.coords.longitude && (
          <Marker
            coordinate={{
              latitude: initPosition.coords.latitude,
              longitude: initPosition.coords.longitude,
            }}
            title={'Origen'}
            pointerEvents={'none'}
            pinColor={'#ffae3b'}
            draggable={currentTravel ? false : true}
            onDragEnd={e => {
              const coordinates = e.nativeEvent.coordinate;
              coordstoText(coordinates.latitude, coordinates.longitude).then((txt: any) => {
                if (txt) {
                  setInitPosition({ text: txt, coords: { latitude: coordinates.latitude, longitude: coordinates.longitude } });
                }
              });
            }}
          />
        )}
        {finalPosition && finalPosition.coords && finalPosition.coords.latitude && finalPosition.coords.longitude && (
          <Marker
            coordinate={{
              latitude: finalPosition.coords.latitude,
              longitude: finalPosition.coords.longitude,
            }}
            title={'Destino'}
            pinColor={'#ffae3b'}
            draggable={currentTravel ? false : true}
            onDragEnd={e => {
              const coordinates = e.nativeEvent.coordinate;
              coordstoText(coordinates.latitude, coordinates.longitude).then((txt: any) => {
                if (txt) {
                  setFinalPosition({ text: txt, coords: { latitude: coordinates.latitude, longitude: coordinates.longitude } });
                }
              });
            }}
          />
        )}
        {snapshot ? null : vehicleSelected && viewDriverSelected && !vehiclePreSelected ? (
          <AnimatedMarker
            user={vehicleSelected}
            vehicleSelected={true}
            onPress={selectionDriver}
            displayDriver={setOnRoadDriverModal}
            image={require('../../assets/vehiculoIconYellow.png')}
            size={40}
            hide={vehicleSelected ? false : true}
          />
        ) : (
          // <></>
          nearbyDriversState.map(
            (driv: User, index: number) =>
              driv.location && (
                <Marker
                  key={index}
                  onPress={() => selectionDriver(driv)}
                  coordinate={{
                    latitude: driv.location.coordinates[1],
                    longitude: driv.location.coordinates[0],
                  }}>
                  <Image
                    source={require('../../assets/vehiculoIconYellow.png')}
                    style={[
                      { width: 40, height: 40, resizeMode: 'contain' },
                      driv && driv.location && driv.location.compassDegrees ? { transform: [{ rotate: driv.location.compassDegrees + 'deg' }] } : {},
                    ]}
                  />
                </Marker>
              ),
          )
        )}
        {initPosition &&
          initPosition.coords &&
          initPosition.coords.latitude &&
          initPosition.coords.longitude &&
          finalPosition &&
          finalPosition.coords &&
          finalPosition.coords.latitude &&
          finalPosition.coords.longitude &&
          !scheduleTravel && (
            <CustomMapViewDirection
              type="1st"
              origin={{
                latitude: initPosition.coords.latitude,
                longitude: initPosition.coords.longitude,
              }}
              destination={{
                latitude: finalPosition.coords.latitude,
                longitude: finalPosition.coords.longitude,
              }}
              width={3}
              color={colorScheme === 'dark' ? 'lightgray' : '#222222'}
              GOOGLE_MAPS_APIKEY={GOOGLE_MAPS_APIKEY}
              fitToCoordinates={fitToCoordinates}
              mapRef={mapRef}
              setSnapshot={setSnapshot}
              setResult={data => {
                console.log('SET RESULT 1st MAPVIEWDIRECTION');
                setResult(data);
              }}
              setMapSnapshot={setMapSnapshot}
            />
          )}
        {initPosition &&
          initPosition.coords &&
          initPosition.coords.latitude &&
          initPosition.coords.longitude &&
          finalPosition &&
          finalPosition.coords &&
          finalPosition.coords.latitude &&
          finalPosition.coords.longitude &&
          scheduleTravel && (
            <CustomMapViewDirection
              type="2nd"
              origin={{
                latitude: initPosition.coords.latitude,
                longitude: initPosition.coords.longitude,
              }}
              destination={{
                latitude: finalPosition.coords.latitude,
                longitude: finalPosition.coords.longitude,
              }}
              width={3}
              color={colorScheme === 'dark' ? 'lightgray' : '#222222'}
              GOOGLE_MAPS_APIKEY={GOOGLE_MAPS_APIKEY}
              fitToCoordinates={fitToCoordinates}
              mapRef={mapRef}
              scheduleTravel={scheduleTravel}
              selectSheduleTravel={selectSheduleTravel}
              setSnapshot={setSnapshot}
              setResult={data => {
                console.log('SET RESULT 2nd MAPVIEWDIRECTION');
                setResult(data);
              }}
              setMapSnapshot={setMapSnapshot}
            />
          )}
        {!snapshot &&
          driver &&
          driver.location &&
          driver.location.coordinates.length &&
          initPosition &&
          initPosition.coords &&
          initPosition.coords.latitude &&
          initPosition.coords.longitude &&
          !vehicleSelected && (
            <CustomMapViewDirection
              type="3rd"
              origin={{
                latitude: driver.location.coordinates[1],
                longitude: driver.location.coordinates[0],
              }}
              destination={{
                latitude: initPosition.coords.latitude,
                longitude: initPosition.coords.longitude,
              }}
              width={3}
              color={'#ffae3b'}
              GOOGLE_MAPS_APIKEY={GOOGLE_MAPS_APIKEY}
              selectDriver={selectDriver}
              driver={driver}
              openModal={true}
            />
          )}
        {!snapshot &&
          vehiclePreSelected &&
          vehiclePreSelected.location &&
          vehiclePreSelected.location.coordinates.length &&
          initPosition &&
          initPosition.coords &&
          initPosition.coords.latitude &&
          initPosition.coords.longitude &&
          !driver &&
          !vehicleSelected && (
            <CustomMapViewDirection
              type="3rd"
              origin={{
                latitude: vehiclePreSelected.location.coordinates[1],
                longitude: vehiclePreSelected.location.coordinates[0],
              }}
              destination={{
                latitude: initPosition.coords.latitude,
                longitude: initPosition.coords.longitude,
              }}
              width={3}
              color={'#ffae3b'}
              GOOGLE_MAPS_APIKEY={GOOGLE_MAPS_APIKEY}
              selectDriver={selectDriver}
              driver={vehiclePreSelected}
              openModal={false}
            />
          )}
        {currentTravel &&
          (user?.roles?.includes(UserRoles.DRIVER) ? (
            <>
              <Marker
                coordinate={{
                  latitude: currentTravel.destination.coordinates[1],
                  longitude: currentTravel.destination.coordinates[0],
                }}
                title={'Destino'}
                pointerEvents={'none'}
                pinColor={'#ffae3b'}
              />
              <Marker
                coordinate={{
                  latitude: currentTravel.origin.coordinates[1],
                  longitude: currentTravel.origin.coordinates[0],
                }}
                title={'Cliente'}
                pointerEvents={'none'}
                pinColor={'#ffae3b'}
              />
              <CustomMapViewDirection
                type="4rd"
                origin={{
                  latitude: currentTravel.origin.coordinates[1],
                  longitude: currentTravel.origin.coordinates[0],
                }}
                destination={{
                  latitude: currentTravel.destination.coordinates[1],
                  longitude: currentTravel.destination.coordinates[0],
                }}
                width={3}
                color={'#ffae3b'}
                GOOGLE_MAPS_APIKEY={GOOGLE_MAPS_APIKEY}
                setCoordinatesToDestination={setCoordinatesToDestination}
                setResult={data => {
                  console.log('SET RESULT 3rd MAPVIEWDIRECTION');
                  setResult(data);
                }}
              />
              {currentTravel.travelStatus === TravelStatuses.ACCEPTED_AND_ON_WAY && (
                <>
                  <CustomMapViewDirection
                    type="5"
                    origin={{
                      latitude: currentTravel.driverOriginLocation.coordinates[1],
                      longitude: currentTravel.driverOriginLocation.coordinates[0],
                    }}
                    destination={{
                      latitude: currentTravel.origin.coordinates[1],
                      longitude: currentTravel.origin.coordinates[0],
                    }}
                    width={3}
                    color={colorScheme === 'dark' ? 'lightgray' : '#222222'}
                    GOOGLE_MAPS_APIKEY={GOOGLE_MAPS_APIKEY}
                    setCoordinatesToClient={setCoordinatesToClient}
                  />
                </>
              )}
            </>
          ) : (
            <>
              {!snapshot &&
                vehicleSelected &&
                vehicleSelected.location &&
                vehicleSelected.location.coordinates.length &&
                initPosition &&
                initPosition.coords &&
                initPosition.coords.latitude &&
                initPosition.coords.longitude &&
                currentTravel.travelStatus === TravelStatuses.ACCEPTED_AND_ON_WAY && (
                  <CustomMapViewDirection
                    type="6"
                    origin={{
                      latitude: vehicleSelected.location.coordinates[1],
                      longitude: vehicleSelected.location.coordinates[0],
                    }}
                    destination={{
                      latitude: initPosition.coords.latitude,
                      longitude: initPosition.coords.longitude,
                    }}
                    width={3}
                    color={'#ffae3b'}
                    GOOGLE_MAPS_APIKEY={GOOGLE_MAPS_APIKEY}
                    driver={vehicleSelected}
                    setCoordinatesToClient={setCoordinatesToClient}
                  />
                )}
              {!snapshot &&
                vehicleSelected &&
                initPosition &&
                initPosition.coords &&
                initPosition.coords.latitude &&
                initPosition.coords.longitude &&
                finalPosition &&
                finalPosition.coords &&
                finalPosition.coords.latitude &&
                finalPosition.coords.longitude && (
                  <CustomMapViewDirection
                    type="7"
                    origin={{
                      latitude: initPosition.coords.latitude,
                      longitude: initPosition.coords.longitude,
                    }}
                    destination={{
                      latitude: finalPosition.coords.latitude,
                      longitude: finalPosition.coords.longitude,
                    }}
                    width={3}
                    color={colorScheme === 'dark' ? 'lightgray' : '#222222'}
                    GOOGLE_MAPS_APIKEY={GOOGLE_MAPS_APIKEY}
                    driver={vehicleSelected}
                    setCoordinatesToDestination={setCoordinatesToDestination}
                  />
                )}
            </>
          ))}
      </MapView>
    );
  },
  () => {
    return false;
  },
);

const styles = StyleSheet.create({
  container: { flex: 1 },
});

import React, { useEffect, useRef } from 'react';
import { View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { Location, useLocation } from '../../hooks/useLocation';

interface MapProps {
  locations?: Location[];
}

export const Map = ({ locations }: MapProps) => {
  const { userLocation } = useLocation();
  const mapRef = useRef<MapView>(null);

  useEffect(() => {
    if (userLocation) {
      mapRef.current?.animateToRegion({
        ...userLocation,
        latitudeDelta: 0.0411,
        longitudeDelta: 0.0411,
      });
    }
  }, [userLocation]);

  return (
    <View style={{ flex: 1 }}>
      <MapView
        style={{ flex: 1 }}
        showsUserLocation
        ref={mapRef}
        initialRegion={{
          latitude: userLocation.latitude,
          longitude: userLocation.longitude,
          latitudeDelta: 1,
          longitudeDelta: 1,
        }}
        showsMyLocationButton={false}
        showsCompass={false}>
        <Marker
          draggable
          coordinate={{
            latitude: userLocation.latitude,
            longitude: userLocation.longitude,
          }}
          title="Yo"
        />
        {locations?.map((location, index) => (
          <Marker
            key={index}
            coordinate={{
              latitude: location.latitude,
              longitude: location.longitude,
            }}
            title={location.title}
          />
        ))}
      </MapView>
    </View>
  );
};

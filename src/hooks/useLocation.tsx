import { useEffect, useState, useRef } from 'react';
import Geolocation from 'react-native-geolocation-service';
import Geocoder from 'react-native-geocoder-reborn';
import Config from 'react-native-config';
Geocoder.fallbackToGoogle(Config.GOOGLE_API_KEY);
// Add next line if you also want to use Google Maps api on iOS.
Geocoder.forceGoogleOnIos(true);
navigator.geolocation = Geolocation;
export interface Location {
  latitude: number;
  longitude: number;
  compassDegrees?: number;
  title?: string;
  heading?: number;
}

export interface locationAbreviation {
  lat: number;
  lng: number;
}

export const useLocation = () => {
  const [hasLocation, setHasLocation] = useState(false);
  const [routeLines, setRouteLines] = useState<Location[]>([]);

  const [initialPosition, setInitialPosition] = useState<Location>({
    longitude: 0,
    latitude: 0,
  });

  const [userLocation, setUserLocation] = useState<Location>({
    longitude: 0,
    latitude: 0,
  });

  const watchId = useRef<number>();
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    getCurrentLocation().then(location => {
      if (!isMounted.current) {
        return;
      }

      setInitialPosition(location);
      setUserLocation(location);

      setRouteLines(routes => [...routes, location]);
      setHasLocation(true);
    });
  }, []);

  const getCurrentLocation = (): Promise<Location> => {
    return new Promise((resolve, reject) => {
      // console.log('Getting current location...');
      Geolocation.getCurrentPosition(
        ({ coords }) => {
          // console.log('Got current location', coords);
          resolve({
            latitude: coords.latitude,
            longitude: coords.longitude,
            heading: coords.heading ? coords.heading : 0,
          });
        },
        err => {
          console.error('error', err);
          reject({ err });
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
      );
    });
  };

  const followUserLocation = () => {
    watchId.current = Geolocation.watchPosition(
      ({ coords }) => {
        if (!isMounted.current) {
          return;
        }
        const location: Location = {
          latitude: coords.latitude,
          longitude: coords.longitude,
        };
        setUserLocation(location);
        setRouteLines(routes => [...routes, location]);
      },
      err => console.log(err),
      { enableHighAccuracy: true, distanceFilter: 0, useSignificantChanges: true },
    );
  };

  const stopFollowUserLocation = () => {
    if (watchId.current) {
      Geolocation.clearWatch(watchId.current);
    }
  };

  const coordstoText = async (lat: number, lng: number) => {
    if (lat !== 0 && lng !== 0) {
      console.log('coordstoText ->', lat, lng);

      const address = await Geocoder.geocodePosition({ lat, lng })
        .then(res => {
          console.log('res', res);

          if (res[0].feature) {
            const add = res[0].formattedAddress;
            const addressArray = add.split(',');
            addressArray.shift();
            return addressArray.join().trim();
          } else {
            return res[0].formattedAddress;
          }
        })
        .catch(error => {
          console.log('GEOCODE ERROR', JSON.stringify(error));
        });

      return address;
    }
  };

  const textToCoords = async (textToSearch: string) => {
    if (textToSearch === 'Posición actual' || textToSearch === 'Current position' || textToSearch === 'Current location' || textToSearch === '') {
      const getActualPosition = await getCurrentLocation();
      const actualPosition = [
        {
          position: {
            lat: getActualPosition.latitude,
            lng: getActualPosition.longitude,
          },
        },
      ];
      return actualPosition;
    } else {
      const result = await Geocoder.geocodeAddress(textToSearch);

      console.log('textToCoords textToSearch', textToSearch);
      console.log('textToCoords result', result);
      return result;
    }
  };

  return {
    hasLocation,
    initialPosition,
    getCurrentLocation,
    followUserLocation,
    stopFollowUserLocation,
    coordstoText,
    textToCoords,
    userLocation,
    routeLines,
  };
};

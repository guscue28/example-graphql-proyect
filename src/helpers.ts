import { SensorData } from 'react-native-sensors';
import LPF from 'lpf';

export const getGraphqlError = (error: any) => {
  if (error.graphQLErrors[0].extensions.exception) {
    const newError = error.graphQLErrors[0].extensions.exception.errors;
    const graphError = newError.map((el: any) => {
      const err = {
        property: el.property,
        errors: Object.keys(el.constraints).map((key: string) => {
          const mapedErrors = el.constraints[key];
          return mapedErrors;
        }),
      };
      return err;
    });
    throw graphError;
  } else if (error.graphQLErrors[0].message) {
    const newError = error.graphQLErrors[0].message;
    const errorMessage = {
      error: newError,
    };
    throw errorMessage;
  }
};

export const getKilometros = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  let rad = (x: number) => {
    return (x * Math.PI) / 180;
  };
  let R = 6378.137; //Radio de la tierra en km
  let dLat = rad(lat2 - lat1);
  let dLong = rad(lon2 - lon1);
  let a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(rad(lat1)) * Math.cos(rad(lat2)) * Math.sin(dLong / 2) * Math.sin(dLong / 2);
  let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  let d = R * c;
  return d;
};

export const calculateAngle = (mag: SensorData) => {
  let angle = 0;
  if (mag) {
    let { x, y } = mag;
    if (Math.atan2(y, x) >= 0) {
      angle = Math.atan2(y, x) * (180 / Math.PI);
    } else {
      angle = (Math.atan2(y, x) + 2 * Math.PI) * (180 / Math.PI);
    }
  }
  return Math.round(LPF.next(angle));
};

import { Coordinates } from './map.interface';
// import MapViewDirections from 'react-native-maps-directions';

export class MapService {
  constructor() {}

  /**
   * Converts coordinates to KMS
   * @param initialPos: Coordinates
   * @param finalPos: Coordinates
   * @returns number - distance in KMS
   */
  // async getDistanceBetweenCoordinates(initialPos: Coordinates, finalPos: Coordinates): Promise<number> {
  //   return 0;
  // }

  async convertMetersToKilometers(meters: number): Promise<number> {
    return meters / 1000;
  }
}

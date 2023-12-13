export interface Coordinates {
  longitude: number;
  latitude: number;
}

export interface Location {
  compassDegrees?: number;
  coordinates: [number, number];
  type?: string;
}

export enum RatingTypes {
  TO_DRIVER = 'TO_DRIVER',
  TO_CLIENT = 'TO_CLIENT',
}

export enum PaymentMethods {
  CASH = 'CASH',
  ZELLE = 'ZELLE',
  PAYPAL = 'PAYPAL',
  CREDIT_CARD = 'CREDIT_CARD',
  MOVILE_PAY = 'MOVILE_PAY',
}

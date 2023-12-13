declare module '*.svg' {
  import React from 'react';
  import { SvgProps } from 'react-native-svg';
  const content: React.FC<SvgProps>;
  export default content;
}

declare module 'react-native-credit-card-input-plus';
declare module 'react-native-google-recaptcha-v2';
// declare module 'react-native-tooltips';
declare module 'lpf';
declare module '@timwangdev/react-native-geocoder' {
  export interface GeocodingObject {
    position: { lat: number; lng: number };
    formattedAddress: string;
    feature: string | null;
    streetNumber: string | null;
    streetName: string | null;
    postalCode: string | null;
    locality: string | null;
    country: string;
    countryCode: string;
    adminArea: string | null;
    subAdminArea: string | null;
    subLocality: string | null;
  }
}

declare module 'react-native-mime-types';

declare module 'react-native-icon-badge';

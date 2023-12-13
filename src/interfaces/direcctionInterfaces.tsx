import { Location, locationAbreviation } from '../hooks/useLocation';

export interface Route {
  coordinates: Coordinate[];
  distance: number;
  duration: number;
  fares: string[];
  waypointOrder: Array<any[]>;
}

export interface Coordinate {
  latitude: number;
  longitude: number;
}

interface textValue {
  text: string;
  value: string | number;
}
export interface MapViewDirectionsResult {
  coordinates: Location[];
  distance: number;
  duration: number;
  fares: any[];
  legs: legs[];
  waypointOrder: any[];
}
export interface legs {
  distance: textValue;
  duration: textValue;
  end_address: string;
  end_location: locationAbreviation;
  start_address: string;
  start_location: locationAbreviation;
  steps: Steps[];
  traffic_speed_entry: any[];
  via_waypoint: any[];
}

export interface Steps {
  distance: {
    text: string;
    value: number;
  };
  duration: {
    text: string;
    value: number;
  };
  end_location: {
    lat: number;
    lng: number;
  };
  start_location: {
    lat: number;
    lng: number;
  };
  html_instructions: string;
  instructions?: string;
  polyline: {
    points: string;
  };
  travel_mode: string;
  maneuver: string | undefined;
}

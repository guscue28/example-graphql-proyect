import { gql } from '@apollo/client';

export const GET_NEARBY_DRIVERS = gql`
  query getNearbyDrivers($longitude: Float!, $latitude: Float!) {
    getNearbyDrivers(payload: { longitude: $longitude, latitude: $latitude }) {
      _id
      firstName
      lastName
      email
      picture
      ratingAverage
      vehicle {
        _id
        description
        licensePlate
        color
        brand {
          _id
          name
        }
        vehicleType {
          _id
          name
          pricePerKM
          pricePerMIN
          pictures
        }
        model {
          _id
          luggage
          name
          seats
        }
      }
      location {
        type
        coordinates
        compassDegrees
      }
      gender
    }
  }
`;

export const SUB_TO_DRIVERS_LOCATION = gql`
  subscription userLocationChanged($users: [ObjectId!]!) {
    userLocationChanged(users: $users) {
      _id
      location {
        type
        coordinates
        compassDegrees
      }
    }
  }
`;

export const UPDATE_USER_LOCATION = gql`
  mutation updateUserLocation($longitude: Float!, $latitude: Float!, $compassDegrees: Float) {
    updateUserLocation(payload: { longitude: $longitude, latitude: $latitude, compassDegrees: $compassDegrees }) {
      location {
        type
        coordinates
        compassDegrees
      }
    }
  }
`;

export const CREATE_NEW_TRAVEL = gql`
  mutation createNewTravel(
    $destination: LocationInput!
    $distance: Float!
    $driver: ObjectId!
    $estimatedTime: Float!
    $origin: LocationInput!
    $vehicleType: ObjectId!
    $destinationString: String!
    $originString: String!
    $routePicture: Upload
  ) {
    createNewTravel(
      payload: {
        destination: $destination
        destinationString: $destinationString
        originString: $originString
        distance: $distance
        driver: $driver
        estimatedTime: $estimatedTime
        origin: $origin
        vehicleType: $vehicleType
      }
      routePicture: $routePicture
    ) {
      _id
      destination {
        coordinates
      }
      origin {
        coordinates
      }
      destinationString
      originString
      distance
      estimatedTime
      startDate
      finishDate
      price
      travelStatus
      travelType
      routePicture
      createdAt
    }
  }
`;

export const CREATE_NEW_SCHEDULED_TRAVEL = gql`
  mutation createNewScheduledTravel(
    $destination: LocationInput!
    $destinationString: String!
    $distance: Float!
    $estimatedTime: Float!
    $origin: LocationInput!
    $originString: String!
    $scheduledDate: Date!
    $vehicleType: ObjectId!
    $routePicture: Upload
  ) {
    createNewScheduledTravel(
      payload: {
        destination: $destination
        destinationString: $destinationString
        distance: $distance
        estimatedTime: $estimatedTime
        origin: $origin
        originString: $originString
        scheduledDate: $scheduledDate
        vehicleType: $vehicleType
      }
      routePicture: $routePicture
    ) {
      _id
      chatId
      distance
      estimatedTime
      startDate
      finishDate
      price
      travelStatus
      travelType
      routePicture
      createdAt
    }
  }
`;

export const GET_CURRENT_TRAVEL = gql`
  query findUserTravelOnCourse {
    findUserTravelOnCourse {
      _id
      clientOriginLocation {
        coordinates
      }
      destination {
        coordinates
      }
      origin {
        coordinates
      }
      driverOriginLocation {
        coordinates
      }
      destinationString
      originString
      driver {
        _id
        firstName
        lastName
        picture
        ratingAverage
        roles
        location {
          coordinates
        }
        vehicle {
          _id
          description
          licensePlate
          color
        }
      }
      distance
      startDate
      finishDate
      estimatedTime
      price
      travelStatus
      travelType
      createdAt
      routePicture
      chatId
      client {
        _id
        firstName
        lastName
        ratingAverage
        picture
        roles
      }
    }
  }
`;

export const ACCEPT_TRAVEL = gql`
  mutation acceptTravel($travelId: ObjectId!) {
    acceptTravel(payload: { travelId: $travelId }) {
      travelStatus
    }
  }
`;

export const START_TRAVEL = gql`
  mutation startTravel($travelId: ObjectId!) {
    startTravel(payload: { travelId: $travelId }) {
      travelStatus
    }
  }
`;

export const FINISH_TRAVEL = gql`
  mutation finishTravel($travelId: ObjectId!) {
    finishTravel(payload: { travelId: $travelId }) {
      travelStatus
    }
  }
`;

export const CANCEL_TRAVEL = gql`
  mutation cancelTravel($travelId: ObjectId!) {
    cancelTravel(payload: { travelId: $travelId }) {
      travelStatus
    }
  }
`;

export const REJECT_TRAVEL = gql`
  mutation rejectTravel($travelId: ObjectId!) {
    rejectTravel(payload: { travelId: $travelId }) {
      travelStatus
    }
  }
`;

export const SUB_TO_DRIVER_APPLICATIONS = gql`
  subscription driverApplications($userId: ObjectId!) {
    driverApplications(userId: $userId) {
      _id
      origin {
        coordinates
      }
      destination {
        coordinates
      }
      driverOriginLocation {
        coordinates
      }
      destinationString
      originString
      driver {
        _id
        firstName
        lastName
        ratingAverage
        picture
        roles
      }
      distance
      estimatedTime
      price
      travelStatus
      travelType
      routePicture
      createdAt
      startDate
      finishDate
      client {
        _id
        firstName
        lastName
        ratingAverage
        picture
        roles
      }
    }
  }
`;

export const SUBSCRIBE_TRAVEL = gql`
  subscription travelChanged($travelId: ObjectId!) {
    travelChanged(travelId: $travelId) {
      _id
      origin {
        coordinates
      }
      destination {
        coordinates
      }
      clientOriginLocation {
        coordinates
      }
      driverOriginLocation {
        coordinates
      }
      destinationString
      originString
      driver {
        _id
        firstName
        lastName
        picture
        ratingAverage
        roles
        location {
          coordinates
        }
        vehicle {
          _id
          description
          licensePlate
          color
        }
      }
      distance
      estimatedTime
      price
      routePicture
      travelStatus
      travelType
      createdAt
      startDate
      finishDate
      chatId
      client {
        _id
        firstName
        lastName
        ratingAverage
        picture
        roles
      }
    }
  }
`;

export const RATE_TRAVEL = gql`
  mutation createRating($message: String!, $rating: Float!, $travelId: ObjectId!, $type: String!) {
    createRating(payload: { message: $message, rating: $rating, travelId: $travelId, type: $type }) {
      _id
      client
      createdAt
      deletedAt
      deletedBy
      driver
      message
      rating
      travelId
      type
      updatedAt
    }
  }
`;

export const FIND_CLIENT_TRAVELS = gql`
  query findClientTravels {
    findClientTravels {
      _id
      createdAt
      destinationString
      originString
      ratings {
        _id
        rating
        client
        driver
        type
      }
      startDate
      finishDate
      estimatedTime
      routePicture
      scheduledDate
      travelStatus
      travelType
      distance
      estimatedTime
      price
      driver {
        _id
        firstName
        lastName
        picture
        ratingAverage
      }
    }
  }
`;

export const FIND_DRIVER_TRAVELS = gql`
  query findDriverTravels {
    findDriverTravels {
      _id
      createdAt
      destinationString
      originString
      ratings {
        _id
        rating
        client
        driver
        type
      }
      startDate
      finishDate
      estimatedTime
      routePicture
      scheduledDate
      travelStatus
      travelType
      distance
      estimatedTime
      price
      client {
        _id
        firstName
        lastName
        picture
        ratingAverage
      }
    }
  }
`;

export const GET_SCHEDULED_TRAVELS = gql`
  query getScheduledTravels($latitude: Float!, $longitude: Float!, $itemsPerPage: Float!, $page: Float!, $searchKey: String!) {
    getScheduledTravels(
      payload: { latitude: $latitude, longitude: $longitude }
      pagination: { itemsPerPage: $itemsPerPage, page: $page, searchKey: $searchKey }
    ) {
      travels {
        _id
        createdAt
        destinationString
        originString
        ratings {
          _id
          rating
          client
          driver
          type
        }
        startDate
        finishDate
        estimatedTime
        routePicture
        scheduledDate
        travelStatus
        travelType
        distance
        estimatedTime
        price
        client {
          _id
          firstName
          lastName
          picture
          ratingAverage
        }
      }
      count
    }
  }
`;

export const GET_MY_ACCEPTED_SCHEDULED_TRAVELS = gql`
  query getMyAcceptedScheduledTravels($itemsPerPage: Float!, $page: Float!, $searchKey: String!) {
    getMyAcceptedScheduledTravels(pagination: { itemsPerPage: $itemsPerPage, page: $page, searchKey: $searchKey }) {
      travels {
        _id
        createdAt
        destinationString
        originString
        ratings {
          _id
          rating
          client
          driver
          type
        }
        startDate
        finishDate
        estimatedTime
        routePicture
        scheduledDate
        travelStatus
        travelType
        distance
        estimatedTime
        price
        client {
          _id
          firstName
          lastName
          picture
          ratingAverage
        }
      }
      count
    }
  }
`;
export const FIND_SPECIFIC_TRAVEL = gql`
  query findTravelById($_id: ObjectId!) {
    findTravelById(_id: $_id) {
      _id
      client {
        _id
        picture
        firstName
        lastName
        ratingAverage
      }
      driver {
        _id
        picture
        firstName
        lastName
        ratingAverage
      }
      createdAt
      destinationString
      originString
      ratings {
        _id
        rating
        client
        driver
        type
      }
      price
      startDate
      finishDate
      estimatedTime
      routePicture
      scheduledDate
      travelStatus
      travelType
    }
  }
`;

export const ACCEPT_SCHEDULED_TRAVEL = gql`
  mutation acceptScheduledTravel($travelId: ObjectId!) {
    acceptScheduledTravel(payload: { travelId: $travelId }) {
      travelStatus
    }
  }
`;

export const MARK_AS_ON_WAY_SCHEDULED_TRAVEL = gql`
  mutation markAsOnWayScheduledTravel($travelId: ObjectId!) {
    markAsOnWayScheduledTravel(payload: { travelId: $travelId }) {
      travelStatus
    }
  }
`;

export const START_SCHEDULED_TRAVEL = gql`
  mutation startScheduledTravel($travelId: ObjectId!) {
    startScheduledTravel(payload: { travelId: $travelId }) {
      travelStatus
    }
  }
`;

export const FINISH_SCHEDULED_TRAVEL = gql`
  mutation finishScheduledTravel($travelId: ObjectId!) {
    finishScheduledTravel(payload: { travelId: $travelId }) {
      travelStatus
    }
  }
`;

export const CANCEL_SCHEDULED_TRAVEL = gql`
  mutation cancelScheduledTravel($travelId: ObjectId!) {
    cancelScheduledTravel(payload: { travelId: $travelId }) {
      travelStatus
    }
  }
`;

export const DRIVER_CANCEL_SCHEDULED_TRAVEL = gql`
  mutation driverCancelScheduledTravel($travelId: ObjectId!) {
    driverCancelScheduledTravel(payload: { travelId: $travelId }) {
      travelStatus
    }
  }
`;

import { gql } from '@apollo/client';

export const LOGIN_USER = gql`
  mutation login($email: String!, $password: String!) {
    login(payload: { email: $email, password: $password }) {
      accessToken
      refreshToken
    }
  }
`;

export const SOCIAL_NETWORK_LOGIN = gql`
  mutation loginSocialNetwork($idToken: String!, $socialNetwork: String!) {
    loginSocialNetwork(payload: { idToken: $idToken, socialNetwork: $socialNetwork }) {
      accessToken
      refreshToken
    }
  }
`;

export const SIGN_UP_USER = gql`
  mutation register($firstName: String!, $lastName: String!, $email: String!, $password: String!, $confirmPassword: String!, $birthday: String!) {
    register(
      payload: { firstName: $firstName, lastName: $lastName, email: $email, password: $password, passwordConfirm: $confirmPassword, birthday: $birthday }
    ) {
      email
    }
  }
`;

export const FORGOT_PASSWORD = gql`
  mutation sendForgotPasswordEmail($email: String!) {
    sendForgotPasswordEmail(payload: { email: $email }) {
      email
      message
    }
  }
`;

export const FORGOT_PASSWORD_TOKEN_VERIFY = gql`
  mutation forgotPasswordVerifyToken($token: String!) {
    forgotPasswordVerifyToken(payload: { token: $token }) {
      email
      message
    }
  }
`;

export const FORGOT_PASSWORD_RESET = gql`
  mutation resetPassword($email: String!, $newPassword: String!, $newPasswordConfirm: String!, $token: String!) {
    resetPassword(payload: { email: $email, newPassword: $newPassword, newPasswordConfirm: $newPasswordConfirm, token: $token }) {
      email
      message
    }
  }
`;

export const CHANGE_USER_ONLINE_STATUS = gql`
  mutation changeUserOnlineStatus($onlineStatus: String!, $logout: Boolean) {
    changeUserOnlineStatus(payload: { onlineStatus: $onlineStatus, logout: $logout }) {
      _id
      onlineStatus
      websocketId
    }
  }
`;

export const GET_ME = gql`
  query me {
    me {
      _id
      email
      birthday
      firstName
      lastName
      phoneNumber
      idNumber
      idNumberType
      roles
      picture
      idNumber
      idNumberType
      wallet {
        _id
        balance
      }
      onlineStatus
      userMembership {
        _id
        enabled
      }
      pushNotificationToken
    }
  }
`;

export const GET_WALLET_INFLOW_OUTFLOW = gql`
  query getWalletInflowOutflows($walletId: ObjectId!, $page: Float!, $itemsPerPage: Float!, $searchKey: String!) {
    getWalletInflowOutflows(walletId: $walletId, pagination: { page: $page, itemsPerPage: $itemsPerPage, searchKey: $searchKey }) {
      count
      walletInflowOutflows {
        amount
        description
        createdAt
        operation
      }
    }
  }
`;

export const UPDATE_PUSH_NOTIFICATION_TOKEN = gql`
  mutation updatePushNotificationToken($token: String!) {
    updatePushNotificationToken(payload: { token: $token }) {
      _id
      email
      birthday
      firstName
      lastName
      roles
      picture
      wallet {
        _id
        balance
      }
      onlineStatus
      userMembership {
        _id
        enabled
      }
      pushNotificationToken
    }
  }
`;

export const CREATE_FAVORITE_DRIVER = gql`
  mutation createFavoriteDriver($payload: CreateFavoriteDriverInput!) {
    createFavoriteDriver(payload: $payload) {
      _id
      createdAt
      updatedAt
      driver {
        _id
        firstName
        lastName
        picture
        ratingAverage
        vehicle {
          _id
          licensePlate
          description
        }
      }
      user
    }
  }
`;

export const GET_MY_FAVORITE_DRIVERS = gql`
  query getMyFavoriteDrivers($pagination: PaginationInput!) {
    getMyFavoriteDrivers(pagination: $pagination) {
      favoriteDrivers {
        _id
        createdAt
        updatedAt
        driver {
          _id
          firstName
          lastName
          picture
          ratingAverage
          onlineStatus
          vehicle {
            description
            licensePlate
          }
        }
        user
      }
      count
    }
  }
`;

export const GET_MY_FAVORITE_LOCATIONS = gql`
  query getMyFavoriteLocations($pagination: PaginationInput!) {
    getMyFavoriteLocations(pagination: $pagination) {
      favoriteLocations {
        _id
        createdAt
        name
        locationString
        location {
          compassDegrees
          coordinates
          type
        }
        type
        user
      }
      count
    }
  }
`;

export const CREATE_FAVORITE_LOCATION = gql`
  mutation createFavoriteLocation($payload: CreateFavoriteLocationInput!) {
    createFavoriteLocation(payload: $payload) {
      _id
      createdAt
      name
      locationString
      location {
        compassDegrees
        coordinates
        type
      }
      type
      user
    }
  }
`;

export const DELETE_FAVORITE_LOCATION = gql`
  mutation deleteMyFavoriteLocation($favoriteLocationId: ObjectId!) {
    deleteMyFavoriteLocation(favoriteLocationId: $favoriteLocationId) {
      success
    }
  }
`;

export const DELETE_FAVORITE_DRIVER = gql`
  mutation deleteMyFavoriteDriver($favoriteDriverId: ObjectId!) {
    deleteMyFavoriteDriver(favoriteDriverId: $favoriteDriverId) {
      success
    }
  }
`;

export const RECHARGE_WALLET = gql`
  mutation createPaymentValidation($payload: CreatePaymentValidationInput!) {
    createPaymentValidation(payload: $payload) {
      validationStatus
      _id
      amount
      createdAt
      paymentMethod
    }
  }
`;

export const WALLET_SUBSCRIPTION = gql`
  subscription walletChanged($walletId: ObjectId!) {
    walletChanged(walletId: $walletId) {
      _id
      balance
    }
  }
`;

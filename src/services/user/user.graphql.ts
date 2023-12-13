import { gql } from '@apollo/client';

export const UPDATE_USER = gql`
  mutation editUser($picture: Upload, $idNumber: String!, $idNumberType: String!, $firstName: String!, $lastName: String!, $phoneNumber: String!) {
    editUser(
      payload: { idNumber: $idNumber, idNumberType: $idNumberType, firstName: $firstName, lastName: $lastName, phoneNumber: $phoneNumber }
      picture: $picture
    ) {
      picture
      idNumber
      idNumberType
      firstName
      lastName
      phoneNumber
    }
  }
`;

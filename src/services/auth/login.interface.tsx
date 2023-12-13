export interface LoginData {
  email: string;
  password: string;
}

export interface LoginOutput {
  accessToken: string;
  refreshToken: string;
  fullName: string;
  email: string;
}

export interface CreateFavoriteDriverInput {
  driver: string | undefined;
}

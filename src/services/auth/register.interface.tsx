export interface RegisterData {
  birthday: string;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  confirmPassword: string;
}

export interface RegisterOutput {
  fullName: string;
  email: string;
}

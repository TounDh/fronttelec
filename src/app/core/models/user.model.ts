
export interface User {
  id?: number;
  name: string;
  surname: string;
  email: string;
  phone: string;
  birthdate: Date;
  password: string;
  confirmPassword?: string; // For form validation only
}
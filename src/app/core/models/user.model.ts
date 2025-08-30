import { Role } from './role.model';
import { Application } from './application.model';

export interface User {
  id: number;
  name: string;
  surname: string;
  email: string;
  phone: string;
  birthdate: string; // Using string for ISO date format
  password: string;
  role: Role;
  applications?: Application[];
}
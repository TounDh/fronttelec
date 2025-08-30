import { Application } from './application.model';

export interface Payment {
  id: number;
  deadline: string; // Using string for ISO date format
  total: number;
  status: string;
  application: Application;
}
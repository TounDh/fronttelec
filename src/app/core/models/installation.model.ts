import { Application } from './application.model';

export interface Installation {
  id: number;
  date: string; // Using string for ISO date format
  status: string;
  application: Application;
}
import { User } from './user.model';
import { Srvce } from './srvce.model';
import { Installation } from './installation.model';
import { Payment } from './payment.model';

export interface Application {
  id: number;
  submissionDate: string; // Using string for ISO date format
  responseDate: string; // Using string for ISO date format
  response: boolean;
  status: string;
  user: User;
  srvce: Srvce;
  installation?: Installation;
  payment?: Payment;
}
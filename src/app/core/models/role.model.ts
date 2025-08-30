import { User } from "./user.model";

export interface Role {
  id: number;
  role: boolean;
  users?: User[];
}
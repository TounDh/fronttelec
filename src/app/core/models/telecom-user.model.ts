export interface TelecomUser {
  id: number | null; // Changed from number to number | null
  name: string;
  phone: string;
  email: string;
}
// src/app/core/models/srvce.model.ts
// REMOVE THIS ENTIRE LINE: import { Offer } from './offer.model';

export interface Offer {
  id?: number | null;
  price: number;
  speed: string;
  commitment: string;
}

export interface Application {
  id?: number;
  // Add other fields as needed
}

export interface Srvce {
  id?: number | null;
  name: string;
  description: string;
  installationFees: number;
  offers: Offer[];
  applications?: Application[];
}
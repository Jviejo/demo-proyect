export interface Location {
  id: string;
  name: string;
  type: LocationType;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  address: string;
  responsible: {
    name: string;
    contact: string;
  };
  lastUpdate: Date;
  status: LocationStatus;
}

export type LocationType = 'MINE' | 'FACTORY' | 'STORE' | 'DISTRIBUTOR' | 'CUSTOMER';
export type LocationStatus = 'ACTIVE' | 'INACTIVE' | 'MAINTENANCE';

export interface LocationDetail extends Location {
  additionalInfo?: {
    description?: string;
    operatingHours?: string;
    certifications?: string[];
    notes?: string;
  };
} 
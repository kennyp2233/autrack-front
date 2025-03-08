export interface Maintenance {
    id: number;
    vehicleId: number;
    type: string;
    date: string;
    time?: string;
    mileage: number;
    cost?: number;
    location?: string;
    notes?: string;
    photos?: string[];
    status: 'pending' | 'completed';
    createdAt: string;
    updatedAt: string;
  }
  
  export interface MaintenanceType {
    id: string;
    name: string;
    icon: string;
    color: string;
  }
  
  export interface MaintenanceFormData {
    vehicleId: number;
    type: string;
    date: string;
    time?: string;
    mileage: string | number;
    cost?: string | number;
    location?: string;
    notes?: string;
    photos?: string[];
  }
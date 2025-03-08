export interface Vehicle {
  id: number;
  userId: number;
  brand: string;
  model: string;
  year: number;
  plate?: string;
  color?: string;
  mileage: number;
  lastMaintenance?: string;
  nextMaintenance?: string;
  fuelType?: string;
  vinNumber?: string;
  purchaseDate?: string;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
}

export interface VehicleFormData {
  brand: string;
  model: string;
  year: string | number;
  plate: string;
  mileage: string | number;
  fuelType: string;
  color: string;
  vinNumber?: string;
  purchaseDate?: string;
  lastMaintenance?: string;
  nextMaintenance?: string;
}
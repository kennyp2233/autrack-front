// types/Vehicle.ts
export interface Vehicle {
  id_vehiculo: number;
  id_usuario: number;
  id_marca: number;
  id_modelo: number;
  placa?: string;
  anio: number;
  kilometraje_actual: number;
  activo: boolean;
  fecha_creacion: string;
  fecha_actualizacion: string;

  // Relaciones (opcionales según el backend las incluya)
  marca?: {
    id: number;
    nombre: string;
  };
  modelo?: {
    id: number;
    nombre: string;
  };
}

export interface VehicleFormData {
  id_marca: number;
  id_modelo: number;
  anio: number | string;
  kilometraje_actual: number | string;
  placa?: string;
}
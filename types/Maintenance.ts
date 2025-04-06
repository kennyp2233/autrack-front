// types/Maintenance.ts

// Entidades principales
export interface MaintenanceCategory {
  id_categoria: number;
  nombre: string;
  descripcion?: string;
  es_sistema: boolean;
}

export interface MaintenanceType {
  id_tipo: number;
  id_categoria: number;
  nombre: string;
  descripcion?: string;
  costo_estimado?: number;
  frecuencia_recomendada_meses?: number;
  frecuencia_recomendada_km?: number;
  es_sistema: boolean;
  id_usuario?: number;
  fecha_creacion: string;

  // Relaciones (opcional)
  categoria?: MaintenanceCategory;
}

export interface MaintenanceRecord {
  id_registro: number;
  id_vehiculo: number;
  id_tipo: number;
  fecha: Date | string;
  kilometraje: number;
  costo?: number;
  notas?: string;
  fecha_creacion: Date | string;
  fecha_actualizacion: Date | string;

  // Relaciones (opcional)
  tipo_mantenimiento?: MaintenanceType;
  archivos_adjuntos?: Attachment[];
}

export interface MaintenanceReminder {
  id_recordatorio: number;
  id_vehiculo: number;
  id_tipo: number;
  fecha_vencimiento?: Date | string;
  kilometraje_vencimiento?: number;
  activo: boolean;
  fecha_creacion: Date | string;
  fecha_actualizacion: Date | string;

  // Relaciones (opcional)
  tipo_mantenimiento?: MaintenanceType;
}

export interface Attachment {
  id_archivo: number;
  id_registro: number;
  nombre_archivo: string;
  ruta_archivo: string;
  tipo_archivo: string;
  tamano_archivo: number;
  fecha_subida: Date | string;
}

// DTOs para crear y actualizar registros
export interface CreateMaintenanceRecordDto {
  id_vehiculo: number;
  id_tipo: number;
  fecha: string; // Formato ISO o YYYY-MM-DD
  kilometraje: number;
  costo?: number;
  notas?: string;
}

export interface UpdateMaintenanceRecordDto {
  id_tipo?: number;
  fecha?: string;
  kilometraje?: number;
  costo?: number;
  notas?: string;
}

export interface CreateMaintenanceReminderDto {
  id_vehiculo: number;
  id_tipo: number;
  fecha_vencimiento?: string;
  kilometraje_vencimiento?: number;
  activo?: boolean;
}

// Tipos para filtros en la UI
export interface MaintenanceFilters {
  tipo: string;
  fechaDesde: string;
  fechaHasta: string;
}
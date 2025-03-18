// app/(app)/vehicles/index.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, TextInput, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { VehicleService } from '@/api';
import { Vehicle } from '@/types/Vehicle';

export default function VehiclesListScreen() {
  const router = useRouter();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [filteredVehicles, setFilteredVehicles] = useState<Vehicle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Referencias a marcas y modelos para mostrar nombres en lugar de IDs
  const [brandsMap, setBrandsMap] = useState<Record<number, string>>({});
  const [modelsMap, setModelsMap] = useState<Record<number, string>>({});
  
  // Cargar vehículos al iniciar
  useEffect(() => {
    loadVehicles();
  }, []);
  
  // Cargar vehículos desde la API
  const loadVehicles = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Cargar vehículos
      const vehiclesData = await VehicleService.getAllVehicles();
      setVehicles(vehiclesData.filter(v => v.activo));
      setFilteredVehicles(vehiclesData.filter(v => v.activo));
      
      // Cargar marcas para mostrar nombres
      const brands = await VehicleService.getAllBrands();
      const brandMapping: Record<number, string> = {};
      brands.forEach(brand => {
        brandMapping[brand.id] = brand.nombre;
      });
      setBrandsMap(brandMapping);
      
      // Cargar modelos para las marcas encontradas
      const modelMapping: Record<number, string> = {};
      for (const vehicle of vehiclesData) {
        if (vehicle.id_marca && !modelsMap[vehicle.id_modelo]) {
          try {
            const models = await VehicleService.getModelsByBrand(vehicle.id_marca);
            models.forEach(model => {
              modelMapping[model.id] = model.nombre;
            });
          } catch (e) {
            console.error(`Error al cargar modelos para marca ${vehicle.id_marca}:`, e);
          }
        }
      }
      setModelsMap({...modelsMap, ...modelMapping});
      
    } catch (err) {
      console.error('Error al cargar vehículos:', err);
      setError('No se pudieron cargar los vehículos');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Filtrar vehículos por búsqueda
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredVehicles(vehicles);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = vehicles.filter(vehicle => {
        const brandName = brandsMap[vehicle.id_marca]?.toLowerCase() || '';
        const modelName = modelsMap[vehicle.id_modelo]?.toLowerCase() || '';
        const plate = vehicle.placa?.toLowerCase() || '';
        
        return (
          brandName.includes(query) ||
          modelName.includes(query) ||
          plate.includes(query) ||
          vehicle.anio.toString().includes(query)
        );
      });
      setFilteredVehicles(filtered);
    }
  }, [searchQuery, vehicles, brandsMap, modelsMap]);
  
  // Ir a la pantalla de detalle
  const goToVehicleDetail = (id: number) => {
    router.push(`/vehicles/${id}`);
  };
  
  // Ir a la pantalla de agregar vehículo
  const goToAddVehicle = () => {
    router.push('/vehicles/add');
  };
  
  // Renderizar cada vehículo
  const renderVehicleItem = ({ item }: { item: Vehicle }) => {
    const brandName = brandsMap[item.id_marca] || 'Marca desconocida';
    const modelName = modelsMap[item.id_modelo] || 'Modelo desconocido';
    
    return (
      <TouchableOpacity 
        style={styles.vehicleItem} 
        onPress={() => goToVehicleDetail(item.id)}
      >
        <View style={styles.iconContainer}>
          <Feather name="truck" size={24} color="#3B82F6" />
        </View>
        
        <View style={styles.vehicleInfo}>
          <Text style={styles.vehicleName}>{brandName} {modelName}</Text>
          <Text style={styles.vehicleDetails}>
            {item.anio} • {item.placa || 'Sin placa'}
          </Text>
        </View>
        
        <View style={styles.vehicleMileage}>
          <Text style={styles.mileageValue}>{item.kilometraje_actual.toLocaleString()} km</Text>
          <Feather name="chevron-right" size={20} color="#999" />
        </View>
      </TouchableOpacity>
    );
  };
  
  return (
    <View style={styles.container}>
      {/* Header con título y búsqueda */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Mis Vehículos</Text>
        
        <View style={styles.searchBar}>
          <Feather name="search" size={18} color="#999" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar vehículo..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Feather name="x" size={18} color="#999" />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>
      
      {/* Contenido principal */}
      <View style={styles.content}>
        {isLoading ? (
          <View style={styles.centerContent}>
            <ActivityIndicator size="large" color="#3B82F6" />
            <Text style={styles.loadingText}>Cargando vehículos...</Text>
          </View>
        ) : error ? (
          <View style={styles.centerContent}>
            <Feather name="alert-circle" size={40} color="#EF4444" />
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={loadVehicles}>
              <Text style={styles.retryButtonText}>Reintentar</Text>
            </TouchableOpacity>
          </View>
        ) : filteredVehicles.length === 0 ? (
          <View style={styles.centerContent}>
            <Feather name="truck" size={60} color="#999" />
            <Text style={styles.emptyText}>
              {searchQuery 
                ? 'No se encontraron vehículos con esa búsqueda' 
                : 'No tienes vehículos registrados'}
            </Text>
            {!searchQuery && (
              <TouchableOpacity style={styles.addFirstButton} onPress={goToAddVehicle}>
                <Text style={styles.addFirstButtonText}>Agregar vehículo</Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          <FlatList
            data={filteredVehicles}
            renderItem={renderVehicleItem}
            keyExtractor={item => item.id.toString()}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
      
      {/* Botón flotante para agregar */}
      {!isLoading && !error && filteredVehicles.length > 0 && (
        <TouchableOpacity style={styles.floatingButton} onPress={goToAddVehicle}>
          <Feather name="plus" size={24} color="white" />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: 'white',
    padding: 16,
    paddingTop: 60, // Ajusta según tu diseño
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 44,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    fontSize: 16,
  },
  content: {
    flex: 1,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  errorText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 16,
    backgroundColor: '#3B82F6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  retryButtonText: {
    color: 'white',
    fontWeight: '500',
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  addFirstButton: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  addFirstButtonText: {
    color: 'white',
    fontWeight: '500',
    fontSize: 16,
  },
  listContent: {
    padding: 16,
    paddingBottom: 80, // Espacio para el botón flotante
  },
  vehicleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#EBF5FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  vehicleInfo: {
    flex: 1,
  },
  vehicleName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  vehicleDetails: {
    fontSize: 14,
    color: '#666',
  },
  vehicleMileage: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mileageValue: {
    marginRight: 8,
    fontWeight: '500',
    color: '#3B82F6',
  },
  floatingButton: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 6,
  },
});
// components/vehicles/maintenance-page/MaintenanceList.tsx
import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Maintenance } from '@/types/Maintenance';
import MaintenanceItem from './MaintenanceItem';

interface MaintenanceListProps {
    maintenanceItems: Maintenance[];
    onItemPress: (id: number) => void;
    theme: any;
}

const MaintenanceList = ({ maintenanceItems, onItemPress, theme }: MaintenanceListProps) => {
    // Estado para mostrar las estadísticas de mantenimiento
    const stats = {
        totalCost: maintenanceItems.reduce((sum, item) => sum + (item.cost || 0), 0),
        count: maintenanceItems.length,
        mostRecent: maintenanceItems.length > 0 ? maintenanceItems[0].date : 'N/A'
    };

    // Formatear fecha para mostrar en estadísticas
    const formatDate = (dateString: string) => {
        try {
            // Si ya está en formato DD/MM/YYYY
            if (dateString.includes('/')) return dateString;
            
            const date = new Date(dateString);
            return date.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
        } catch (e) {
            return dateString;
        }
    };

    if (maintenanceItems.length === 0) {
        return (
            <View style={styles.emptyContainer}>
                <Feather name="clipboard" size={60} color={theme.secondaryText} style={styles.emptyIcon} />
                <Text style={[styles.emptyText, { color: theme.secondaryText }]}>
                    No hay registros de mantenimiento disponibles
                </Text>
                <Text style={[styles.emptySubtext, { color: theme.secondaryText }]}>
                    Agrega tu primer mantenimiento utilizando el botón de abajo
                </Text>
            </View>
        );
    }

    const renderItem = ({ item }: { item: Maintenance }) => (
        <MaintenanceItem 
            item={item} 
            onPress={() => onItemPress(item.id)} 
            theme={theme} 
        />
    );

    const ListHeader = () => (
        <View style={[styles.statsContainer, { backgroundColor: theme.card }]}>
            <View style={styles.statsRow}>
                <View style={styles.statItem}>
                    <Text style={[styles.statValue, { color: theme.text }]}>
                        {stats.count}
                    </Text>
                    <Text style={[styles.statLabel, { color: theme.secondaryText }]}>
                        Servicios
                    </Text>
                </View>
                
                <View style={styles.statItem}>
                    <Text style={[styles.statValue, { color: theme.primary }]}>
                        ${stats.totalCost.toLocaleString()}
                    </Text>
                    <Text style={[styles.statLabel, { color: theme.secondaryText }]}>
                        Gasto Total
                    </Text>
                </View>
                
                <View style={styles.statItem}>
                    <Text style={[styles.statValue, { color: theme.text }]}>
                        {formatDate(stats.mostRecent)}
                    </Text>
                    <Text style={[styles.statLabel, { color: theme.secondaryText }]}>
                        Último Servicio
                    </Text>
                </View>
            </View>
        </View>
    );

    return (
        <FlatList
            data={maintenanceItems}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderItem}
            ListHeaderComponent={ListHeader}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
        />
    );
};

const styles = StyleSheet.create({
    listContent: {
        padding: 16,
        paddingBottom: 90, // Espacio para el botón flotante
    },
    statsContainer: {
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    statItem: {
        alignItems: 'center',
    },
    statValue: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    statLabel: {
        fontSize: 12,
        marginTop: 4,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 32,
        marginTop: 100,
    },
    emptyIcon: {
        marginBottom: 16,
        opacity: 0.5,
    },
    emptyText: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 8,
    },
    emptySubtext: {
        fontSize: 14,
        textAlign: 'center',
        paddingHorizontal: 32,
        lineHeight: 20,
    },
});

export default MaintenanceList;
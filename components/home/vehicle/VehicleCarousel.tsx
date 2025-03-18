import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Dimensions, ScrollView } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Vehicle } from '@/types/Vehicle';
import VehicleCard from './VehicleCard';

interface VehicleCarouselProps {
    vehicles: Vehicle[];
    onViewAll: () => void;
    theme: any;
}

const CARD_WIDTH = Dimensions.get('window').width - 145; // Ancho de tarjeta con margen

const VehicleCarousel: React.FC<VehicleCarouselProps> = ({
    vehicles,
    onViewAll,
    theme
}) => {
    const router = useRouter();
    const [activeIndex, setActiveIndex] = useState(0);
    const scrollViewRef = useRef<ScrollView>(null);

    // Animación para los botones de navegación
    const buttonScaleAnim = useRef(new Animated.Value(1)).current;

    // Animar botón al presionar
    const animateButtonPress = () => {
        Animated.sequence([
            Animated.timing(buttonScaleAnim, {
                toValue: 0.9,
                duration: 100,
                useNativeDriver: true,
            }),
            Animated.timing(buttonScaleAnim, {
                toValue: 1,
                duration: 100,
                useNativeDriver: true,
            }),
        ]).start();
    };

    // Manejar presión en vehículo
    const handleVehiclePress = (vehicleId: number) => {
        router.push(`/vehicles/${vehicleId}`);
    };

    // Manejar navegación del carrusel
    const handlePrevVehicle = () => {
        if (activeIndex > 0) {
            const newIndex = activeIndex - 1;
            setActiveIndex(newIndex);
            scrollToIndex(newIndex);
            animateButtonPress();
        }
    };

    const handleNextVehicle = () => {
        if (activeIndex < vehicles.length - 1) {
            const newIndex = activeIndex + 1;
            setActiveIndex(newIndex);
            scrollToIndex(newIndex);
            animateButtonPress();
        }
    };

    // Función para desplazar al índice
    const scrollToIndex = (index: number) => {
        scrollViewRef.current?.scrollTo({
            x: index * CARD_WIDTH,
            animated: true
        });
    };

    // Detectar cambio de índice por scroll
    const handleScroll = (event: any) => {
        const contentOffsetX = event.nativeEvent.contentOffset.x;
        const newIndex = Math.round(contentOffsetX / CARD_WIDTH);

        if (newIndex !== activeIndex) {
            setActiveIndex(newIndex);
        }
    };

    // Efecto para inicializar scroll
    useEffect(() => {
        if (vehicles.length > 0 && scrollViewRef.current) {
            scrollToIndex(activeIndex);
        }
    }, []);

    // Renderizar el encabezado de la sección
    const renderSectionHeader = () => (
        <View style={styles.sectionHeader}>
            <View style={styles.titleContainer}>
                <Feather name="truck" size={18} color={theme.primary} style={styles.sectionIcon} />
                <Text style={[styles.sectionTitle, { color: theme.text }]}>
                    Mis Vehículos
                </Text>
            </View>
            <TouchableOpacity
                style={styles.viewAllButton}
                onPress={onViewAll}
                activeOpacity={0.7}
            >
                <Text style={[styles.viewAllText, { color: theme.primary }]}>Ver todos</Text>
                <Feather name="chevron-right" size={16} color={theme.primary} />
            </TouchableOpacity>
        </View>
    );

    // Si no hay vehículos disponibles
    if (vehicles.length === 0) {
        return (
            <View>
                {renderSectionHeader()}
                <View style={[styles.emptyVehicle, { backgroundColor: theme.card, borderColor: theme.border }]}>
                    <Feather name="truck" size={40} color={theme.secondaryText} />
                    <Text style={[styles.emptyText, { color: theme.secondaryText }]}>
                        No tienes vehículos registrados
                    </Text>
                    <TouchableOpacity
                        style={[styles.addButton, { backgroundColor: theme.primary }]}
                        onPress={() => router.push('/vehicles/add')}
                        activeOpacity={0.8}
                    >
                        <Feather name="plus" size={16} color="white" style={styles.addButtonIcon} />
                        <Text style={styles.addButtonText}>
                            Agregar Vehículo
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    return (
        <View>
            {renderSectionHeader()}

            <View style={styles.carouselContainer}>
                {/* Botón Anterior */}
                <Animated.View style={{ transform: [{ scale: buttonScaleAnim }] }}>
                    <TouchableOpacity
                        style={[
                            styles.navButton,
                            activeIndex === 0 && styles.navButtonDisabled,
                            { backgroundColor: theme.card }
                        ]}
                        onPress={handlePrevVehicle}
                        disabled={activeIndex === 0}
                        activeOpacity={0.7}
                    >
                        <Feather
                            name="chevron-left"
                            size={22}
                            color={activeIndex === 0 ? theme.border : theme.text}
                        />
                    </TouchableOpacity>
                </Animated.View>

                {/* Carrusel de tarjetas */}
                <ScrollView
                    ref={scrollViewRef}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    pagingEnabled
                    decelerationRate="fast"
                    snapToInterval={CARD_WIDTH}
                    snapToAlignment="center"
                    contentContainerStyle={styles.scrollViewContent}
                    onMomentumScrollEnd={handleScroll}
                    scrollEventThrottle={16}
                >
                    {vehicles.map((vehicle, index) => (
                        <View key={vehicle.id_vehiculo} style={styles.cardContainer}>
                            <VehicleCard
                                vehicle={vehicle}
                                onPress={handleVehiclePress}
                                theme={theme}
                            />
                        </View>
                    ))}
                </ScrollView>

                {/* Botón Siguiente */}
                <Animated.View style={{ transform: [{ scale: buttonScaleAnim }] }}>
                    <TouchableOpacity
                        style={[
                            styles.navButton,
                            activeIndex === vehicles.length - 1 && styles.navButtonDisabled,
                            { backgroundColor: theme.card }
                        ]}
                        onPress={handleNextVehicle}
                        disabled={activeIndex === vehicles.length - 1}
                        activeOpacity={0.7}
                    >
                        <Feather
                            name="chevron-right"
                            size={22}
                            color={activeIndex === vehicles.length - 1 ? theme.border : theme.text}
                        />
                    </TouchableOpacity>
                </Animated.View>
            </View>

            {/* Indicadores de paginación */}
            {vehicles.length > 1 && (
                <View style={styles.pagination}>
                    {vehicles.map((_, index) => (
                        <TouchableOpacity
                            key={index}
                            onPress={() => {
                                setActiveIndex(index);
                                scrollToIndex(index);
                            }}
                            activeOpacity={0.8}
                        >
                            <View
                                style={[
                                    styles.paginationDot,
                                    {
                                        width: index === activeIndex ? 20 : 8,
                                        backgroundColor: index === activeIndex
                                            ? theme.primary
                                            : theme.border
                                    }
                                ]}
                            />
                        </TouchableOpacity>
                    ))}
                </View>
            )}

            {/* Contador de vehículos */}
            {vehicles.length > 1 && (
                <Text style={[styles.vehicleCounter, { color: theme.secondaryText }]}>
                    {activeIndex + 1} de {vehicles.length}
                </Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    sectionIcon: {
        marginRight: 8,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    viewAllButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 4,
        paddingHorizontal: 2,
    },
    viewAllText: {
        fontWeight: '500',
        marginRight: 4,
    },
    carouselContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    scrollViewContent: {
        paddingHorizontal: 4,
    },
    cardContainer: {
        width: CARD_WIDTH,
    },
    navButton: {
        width: 38,
        height: 38,
        borderRadius: 19,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 3,
    },
    navButtonDisabled: {
        opacity: 0.5,
    },
    pagination: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 8,
    },
    paginationDot: {
        height: 8,
        borderRadius: 4,
        marginHorizontal: 4,
    },
    vehicleCounter: {
        textAlign: 'center',
        fontSize: 12,
        marginTop: 6,
    },
    emptyVehicle: {
        alignItems: 'center',
        padding: 24,
        borderRadius: 16,
        borderWidth: 1,
        borderStyle: 'dashed',
        marginBottom: 16,
    },
    emptyText: {
        marginVertical: 12,
        textAlign: 'center',
    },
    addButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 8,
        marginTop: 8,
    },
    addButtonIcon: {
        marginRight: 8,
    },
    addButtonText: {
        fontWeight: 'bold',
        color: 'white',
    },
});

export default VehicleCarousel;
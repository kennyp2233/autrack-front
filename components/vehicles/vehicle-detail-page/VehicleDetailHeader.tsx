import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { BaseHeader } from '@/components/ui/headers';

interface VehicleDetailHeaderProps {
    title: string;
    onBack: () => void;
    onOptionsPress: () => void;
    theme: any;
}

/**
 * Header para la página de detalle de vehículo
 * Versión mejorada del componente original con la misma funcionalidad
 */
const VehicleDetailHeader: React.FC<VehicleDetailHeaderProps> = ({
    title,
    onBack,
    onOptionsPress,
    theme
}) => {
    return (
        <BaseHeader
            backgroundColor={theme.primary}
            statusBarStyle="light-content"
        >
            <View style={styles.headerContent}>
                <TouchableOpacity
                    onPress={onBack}
                    style={styles.backButton}
                >
                    <Feather name="arrow-left" size={24} color="#fff" />
                </TouchableOpacity>

                <Text
                    style={styles.title}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                >
                    {title}
                </Text>

                <TouchableOpacity
                    onPress={onOptionsPress}
                    style={styles.optionsButton}
                >
                    <Feather name="more-vertical" size={24} color="#fff" />
                </TouchableOpacity>
            </View>
        </BaseHeader>
    );
};

const styles = StyleSheet.create({
    headerContent: {
        height: 56,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
    },
    backButton: {
        padding: 8,
        borderRadius: 20,
    },
    title: {
        flex: 1,
        fontSize: 18,
        fontWeight: 'bold',
        color: 'white',
        textAlign: 'center',
        marginHorizontal: 8,
    },
    optionsButton: {
        padding: 8,
        borderRadius: 20,
    },
});

export default VehicleDetailHeader;
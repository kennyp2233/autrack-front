import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';

interface VehicleFormHeaderProps {
    theme: any;
    imageUri?: string;
    onImagePress?: () => void;
}

const VehicleFormHeader: React.FC<VehicleFormHeaderProps> = ({
    theme,
    imageUri,
    onImagePress
}) => {
    // Colores basados en el tema
    const primaryColor = theme.primary;

    return (
        <TouchableOpacity
            style={[
                styles.imageContainer,
                { backgroundColor: `${primaryColor}15` }
            ]}
            onPress={onImagePress}
            activeOpacity={0.8}
        >
            {imageUri ? (
                // Aquí iría la imagen si estuviera implementada
                <View style={styles.imagePreview}>
                    {/* <Image source={{ uri: imageUri }} style={styles.image} /> */}
                    <Feather name="camera" size={32} color={primaryColor} />
                    <Text style={[styles.imageText, { color: primaryColor }]}>
                        Cambiar foto
                    </Text>
                </View>
            ) : (
                <View style={styles.imagePrompt}>
                    <Feather name="camera" size={32} color={primaryColor} />
                    <Text style={[styles.imageText, { color: primaryColor }]}>
                        Agregar foto
                    </Text>
                </View>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    imageContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        height: 120,
        borderRadius: 12,
        marginBottom: 20,
    },
    imagePreview: {
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100%',
    },
    imagePrompt: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    // image: {
    //     width: '100%',
    //     height: '100%',
    //     borderRadius: 12,
    // },
    imageText: {
        marginTop: 8,
        fontWeight: '500',
    },
});

export default VehicleFormHeader;
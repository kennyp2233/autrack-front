import React from 'react';
import { Animated, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';

interface SearchBarProps {
    value: string;
    onChangeText: (text: string) => void;
    onClear: () => void;
    width: Animated.AnimatedInterpolation<string>;
    theme: any;
    topPosition: number;
}

const SearchBar: React.FC<SearchBarProps> = ({
    value,
    onChangeText,
    onClear,
    width,
    theme,
    topPosition
}) => {
    // Colores basados en el tema
    const cardColor = theme.card;
    const textColor = theme.text;
    const secondaryTextColor = theme.secondaryText;
    const borderColor = theme.border;

    return (
        <Animated.View
            style={[
                styles.searchContainer,
                {
                    width,
                    backgroundColor: cardColor,
                    borderColor,
                    top: topPosition,
                }
            ]}
        >
            <Feather name="search" size={20} color={secondaryTextColor} style={styles.searchIcon} />
            <TextInput
                style={[styles.searchInput, { color: textColor }]}
                placeholder="Buscar vehículo..."
                placeholderTextColor={secondaryTextColor}
                value={value}
                onChangeText={onChangeText}
                autoFocus={true}
            />
            {value.length > 0 && (
                <TouchableOpacity
                    style={styles.clearButton}
                    onPress={onClear}
                >
                    <Feather name="x" size={18} color={secondaryTextColor} />
                </TouchableOpacity>
            )}
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        margin: 16,
        paddingHorizontal: 12,
        borderRadius: 8,
        borderWidth: 1,
        height: 48,
        position: 'absolute',
        left: 0,
        right: 0,
        zIndex: 10,
        // Añadir sombra para destacar sobre el contenido
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
    },
    searchIcon: {
        marginRight: 8,
    },
    searchInput: {
        flex: 1,
        height: 40,
        fontSize: 16,
    },
    clearButton: {
        padding: 4,
    },
});

export default SearchBar;
// components/common/headers/SearchHeader.tsx
import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import BaseHeader from './BaseHeader';

interface SearchHeaderProps {
    title: string;
    searchValue: string;
    onSearchChange: (text: string) => void;
    onSearchClear: () => void;
    placeholder?: string;
    showFilterButton?: boolean;
    onFilterPress?: () => void;
    theme: any;
}

/**
 * Header con título y barra de búsqueda integrada
 */
const SearchHeader: React.FC<SearchHeaderProps> = ({
    title,
    searchValue,
    onSearchChange,
    onSearchClear,
    placeholder = "Buscar...",
    showFilterButton = false,
    onFilterPress,
    theme
}) => {
    const headerBg = theme?.card || '#FFFFFF';
    const textColor = theme?.text || '#333333';
    const secondaryTextColor = theme?.secondaryText || '#757575';
    const inputBg = theme?.isDark ? '#333333' : '#F5F5F5';
    const borderColor = theme?.border || '#E0E0E0';
    const primaryColor = theme?.primary || '#3B82F6';

    // Automáticamente usar texto oscuro o claro basado en el color de fondo
    const statusBarStyle = theme?.isDark ? 'light-content' : 'dark-content';

    return (
        <BaseHeader
            backgroundColor={headerBg}
            statusBarStyle={statusBarStyle}
            rounded={false}
            elevation={3}
        >
            <View style={styles.container}>
                <View style={styles.headerRow}>
                    <Text style={[styles.title, { color: textColor }]}>
                        {title}
                    </Text>

                    {showFilterButton && (
                        <TouchableOpacity
                            style={styles.filterButton}
                            onPress={onFilterPress}
                        >
                            <Feather name="filter" size={20} color={primaryColor} />
                        </TouchableOpacity>
                    )}
                </View>

                <View style={[styles.searchBar, { backgroundColor: inputBg, borderColor }]}>
                    <Feather name="search" size={18} color={secondaryTextColor} />
                    <TextInput
                        style={[styles.searchInput, { color: textColor }]}
                        placeholder={placeholder}
                        placeholderTextColor={secondaryTextColor}
                        value={searchValue}
                        onChangeText={onSearchChange}
                    />
                    {searchValue.length > 0 && (
                        <TouchableOpacity onPress={onSearchClear}>
                            <Feather name="x" size={18} color={secondaryTextColor} />
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        </BaseHeader>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    filterButton: {
        padding: 8,
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 12,
        height: 44,
    },
    searchInput: {
        flex: 1,
        marginLeft: 8,
        height: '100%',
        fontSize: 16,
    }
});

export default SearchHeader;
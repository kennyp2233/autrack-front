// components/ui/PageHeaderWithSearch.tsx
import React from 'react';
import { View, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '@/contexts/ThemeContext';
import SearchBar from '@/components/ui/SearchBar';
import SectionHeader from '@/components/ui/SectionHeader';

interface PageHeaderWithSearchProps {
    title: string;
    searchValue: string;
    onSearchChange: (text: string) => void;
    onSearchClear: () => void;
    placeholder?: string;
    showFilterButton?: boolean;
    onFilterPress?: () => void;
    style?: ViewStyle;
}

/**
 * Componente de cabecera de página con barra de búsqueda y opcionalmente
 * un botón de filtro.
 */
const PageHeaderWithSearch: React.FC<PageHeaderWithSearchProps> = ({
    title,
    searchValue,
    onSearchChange,
    onSearchClear,
    placeholder = "Buscar...",
    showFilterButton = false,
    onFilterPress,
    style
}) => {
    const { theme } = useTheme();

    return (
        <View style={[styles.container, { backgroundColor: theme.card }, style]}>
            <View style={styles.headerRow}>
                <SectionHeader
                    title={title}
                    showBorder={false}
                    style={styles.sectionTitle}
                    rightContent={
                        showFilterButton && (
                            <TouchableOpacity
                                style={styles.filterButton}
                                onPress={onFilterPress}
                            >
                                <Feather name="filter" size={20} color={theme.primary} />
                            </TouchableOpacity>
                        )
                    }
                />
            </View>

            <SearchBar
                value={searchValue}
                onChangeText={onSearchChange}
                onClear={onSearchClear}
                placeholder={placeholder}
                style={styles.searchBar}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    sectionTitle: {
        flex: 1,
        padding: 0,
    },
    filterButton: {
        padding: 8,
    },
    searchBar: {
        marginTop: 8,
        marginBottom: 4,
    }
});

export default PageHeaderWithSearch;
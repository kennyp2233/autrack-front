import React from 'react';
import {
    View,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Platform,
    ViewStyle,
    StyleProp
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '@/contexts/ThemeContext';

interface SearchBarProps {
    value: string;
    onChangeText: (text: string) => void;
    onClear?: () => void;
    onFocus?: () => void;
    onBlur?: () => void;
    placeholder?: string;
    autoFocus?: boolean;
    style?: StyleProp<ViewStyle>;
    height?: number;
    showIcon?: boolean;
    width?: any;
}

/**
 * Componente de barra de búsqueda reutilizable (sin animación)
 */
const SearchBar: React.FC<SearchBarProps> = ({
    value,
    onChangeText,
    onClear,
    onFocus,
    onBlur,
    placeholder = 'Buscar...',
    autoFocus = false,
    style,
    height = 48,
    showIcon = true,
    width = '100%'
}) => {
    const { theme } = useTheme();

    const containerStyle: ViewStyle = {
        backgroundColor: theme.card,
        borderColor: theme.border,
        height,
        width,
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 12,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.1,
                shadowRadius: 2,
            },
            android: {
                elevation: 2,
            },
        }),
    };

    return (
        <View style={[containerStyle, style]}>
            {showIcon && (
                <Feather
                    name="search"
                    size={20}
                    color={theme.secondaryText}
                    style={styles.searchIcon}
                />
            )}
            <TextInput
                style={[styles.input, { color: theme.text }]}
                placeholder={placeholder}
                placeholderTextColor={theme.secondaryText}
                value={value}
                onChangeText={onChangeText}
                onFocus={onFocus}
                onBlur={onBlur}
                autoFocus={autoFocus}
            />
            {value.length > 0 && onClear && (
                <TouchableOpacity style={styles.clearButton} onPress={onClear}>
                    <Feather name="x" size={18} color={theme.secondaryText} />
                </TouchableOpacity>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    searchIcon: {
        marginRight: 8,
    },
    input: {
        flex: 1,
        fontSize: 16,
        paddingVertical: 8,
    },
    clearButton: {
        padding: 4,
    },
});

export default SearchBar;

import React, { ReactNode } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '@/contexts/ThemeContext';

interface SectionHeaderProps {
    title: string;
    actionLabel?: string;
    onAction?: () => void;
    actionIcon?: string;
    showBorder?: boolean;
    style?: ViewStyle;
    rightContent?: ReactNode;
}

/**
 * Componente de encabezado de sección reutilizable
 */
const SectionHeader: React.FC<SectionHeaderProps> = ({
    title,
    actionLabel,
    onAction,
    actionIcon,
    showBorder = true,
    style,
    rightContent
}) => {
    const { theme } = useTheme();

    return (
        <View
            style={[
                styles.container,
                showBorder && {
                    borderBottomWidth: 1,
                    borderBottomColor: theme.border
                },
                style
            ]}
        >
            <Text style={[styles.title, { color: theme.text }]}>
                {title}
            </Text>

            {rightContent || (actionLabel && onAction && (
                <TouchableOpacity
                    style={styles.actionButton}
                    onPress={onAction}
                >
                    {actionIcon && (
                        <Feather
                            name={actionIcon as any}
                            size={16}
                            color={theme.primary}
                            style={styles.actionIcon}
                        />
                    )}
                    <Text style={[styles.actionLabel, { color: theme.primary }]}>
                        {actionLabel}
                    </Text>
                </TouchableOpacity>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    actionIcon: {
        marginRight: 4,
    },
    actionLabel: {
        fontWeight: '500',
        fontSize: 14,
    }
});

export default SectionHeader;
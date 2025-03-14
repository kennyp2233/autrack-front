import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';

interface ErrorScreenProps {
    title: string;
    message: string;
    buttonText: string;
    onButtonPress: () => void;
    icon?: string;
    theme: any;
}

const ErrorScreen: React.FC<ErrorScreenProps> = ({
    title,
    message,
    buttonText,
    onButtonPress,
    icon = 'alert-circle',
    theme
}) => {
    const backgroundColor = theme.background;
    const primaryColor = theme.primary;
    const textColor = theme.text;
    const secondaryTextColor = theme.secondaryText;

    return (
        <View style={[styles.container, { backgroundColor }]}>
            <View style={[styles.header, { backgroundColor: primaryColor }]}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={onButtonPress}
                >
                    <Feather name="arrow-left" size={24} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Error</Text>
                <View style={styles.placeholderIcon} />
            </View>

            <View style={styles.errorContainer}>
                <Feather
                    name={icon as any}
                    size={60}
                    color={secondaryTextColor}
                />

                <Text style={[styles.errorTitle, { color: textColor }]}>
                    {title}
                </Text>

                <Text style={[styles.errorMessage, { color: secondaryTextColor }]}>
                    {message}
                </Text>

                <TouchableOpacity
                    style={[styles.errorButton, { backgroundColor: primaryColor }]}
                    onPress={onButtonPress}
                >
                    <Text style={styles.errorButtonText}>
                        {buttonText}
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        height: 56,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        borderBottomLeftRadius: 15,
        borderBottomRightRadius: 15,
    },
    backButton: {
        padding: 8,
    },
    headerTitle: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    placeholderIcon: {
        width: 24,
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    errorTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 24,
        marginBottom: 12,
        textAlign: 'center',
    },
    errorMessage: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 32,
        lineHeight: 22,
    },
    errorButton: {
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 8,
    },
    errorButtonText: {
        color: 'white',
        fontWeight: '600',
        fontSize: 16,
    },
});

export default ErrorScreen;
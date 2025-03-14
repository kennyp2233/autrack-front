import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Platform, StatusBar } from 'react-native';
import { Feather } from '@expo/vector-icons';

interface VehicleDetailHeaderProps {
    title: string;
    onBack: () => void;
    onOptionsPress: () => void;
    theme: any;
}

const VehicleDetailHeader: React.FC<VehicleDetailHeaderProps> = ({
    title,
    onBack,
    onOptionsPress,
    theme
}) => {
    return (
        <SafeAreaView style={[styles.header, { backgroundColor: theme.primary }]}>
            <View style={styles.statusBarPlaceholder} />
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
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    header: {
        width: '100%',
        borderBottomLeftRadius: 15,
        borderBottomRightRadius: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 6,
        zIndex: 10,
    },
    statusBarPlaceholder: {
        height: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    },
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
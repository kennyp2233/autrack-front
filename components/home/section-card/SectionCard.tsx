import React, { ReactNode } from 'react';
import { View, StyleSheet } from 'react-native';

interface SectionCardProps {
    children: ReactNode;
    style?: object;
}

const SectionCard: React.FC<SectionCardProps> = ({ children, style }) => {
    return (
        <View style={[styles.container, style]}>
            {children}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 16,
        marginBottom: 16,
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 16,
        // Shadow for depth
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
});

export default SectionCard;
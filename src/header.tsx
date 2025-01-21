import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export const Header: React.FC = () => {
    return (
        <View style={styles.header}>
            <Text style={styles.headerText}>Finance App</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        width: '100%',
        display:'flex',
        height: 60,
        backgroundColor: '#6200EE',
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerText: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
    },
});
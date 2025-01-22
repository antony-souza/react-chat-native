import React, { useState } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

export const Header: React.FC = () => {
    
    return (
        <View style={styles.header}>
                <Icon 
                    name="menu" 
                    size={30} 
                    color="white" 
                />
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 60,
        backgroundColor: '#6200EE',
        elevation: 5,
        paddingHorizontal:20
    },
});


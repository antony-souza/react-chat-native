import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

export const Header: React.FC = () => {
    return (
        <View style={styles.header}>
            <Icon name="menu" size={30} color="white" />
            <Image source={{uri: 'https://i.imgur.com/XBRmUGu.jpeg'}} style={styles.imgLogo} />
            <Text style={styles.headerText}>Duck Finance</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        height: 60,
        padding: 15,
        backgroundColor: '#6200EE',
        alignItems: 'center',
    },
    headerText: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
    },
    imgLogo:{
        width: 30,
        height: 30,
        borderRadius: 15,
    }

});
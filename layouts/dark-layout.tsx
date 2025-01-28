import React from 'react';
import { View, StyleSheet } from 'react-native';

interface IDarkLayoutProps {
    children: React.ReactNode;
  }

const LayoutPage: React.FC<IDarkLayoutProps> = ({ children }) => {
    return (
        <View style={styles.container}>
            {children}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#121212',
        padding: 16,
        height: '100%',
        zIndex: 1,
    },
});

export default LayoutPage;
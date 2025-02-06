import React from 'react';
import { View, StyleSheet } from 'react-native';
import TabsNavigation from '../components/tabs';
import Header from '../components/header';

interface IDarkLayoutProps {
    children: React.ReactNode;
    headerTitle: string
    tabs?: boolean;
    onBack?: () => void;
}

const LayoutPage: React.FC<IDarkLayoutProps> = ({ children, headerTitle, tabs, onBack }) => {
    return (
        <View style={styles.container}>
            <Header 
                title={headerTitle} 
                arrowBackFunction={onBack}
            />
            {children}
            {tabs && <TabsNavigation />}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#121212',
        height: '100%',
        zIndex: 1,
    },
});

export default LayoutPage;
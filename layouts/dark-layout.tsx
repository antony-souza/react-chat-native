import React from 'react';
import { View, StyleSheet } from 'react-native';
import TabsNavigation from '../components/tabs';
import Header from '../components/header';

interface IDarkLayoutProps {
    tabs?: boolean;
    onBack?: () => void;
    children: React.ReactNode;
    headerTitle: string
    onInformationPress?: () => void;
}

const LayoutPage: React.FC<IDarkLayoutProps> = ({ children, headerTitle, tabs, onBack, onInformationPress }) => {
    return (
        <View style={styles.container}>
            <Header 
                title={headerTitle} 
                onInformationPress={onInformationPress}
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
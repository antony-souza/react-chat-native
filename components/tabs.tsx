import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {useRouter } from 'expo-router';
import { useState } from 'react';

interface ITabsMenu {
    icon: string;
    route: string;
    name: string;
}

const TabsNavigation = () => {
    const router = useRouter();
    const [menu, setMenu] = useState<ITabsMenu[]>([
        { icon: 'user', route: '/profile', name: 'Perfil' },
        { icon: 'home', route: '/rooms', name: 'Salas' },
        { icon: 'address-book', route: '/friends', name: 'Amigos' },
        { icon: 'user-plus', route: '/add_friends', name: 'Novo Amigo' },
    ]);


    return (
        <View style={styles.container}>
            {menu.map((tab: ITabsMenu) => (
                <TouchableOpacity
                    key={tab.route}
                    style={styles.tab}
                    onPress={() => router.navigate(tab.route)}
                >
                    <Icon name={tab.icon} solid size={20} color="#fff" />
                    <Text style={styles.tabText}>{tab.name}</Text>
                </TouchableOpacity>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        backgroundColor: '#333',
        paddingVertical: 10,
        position: 'absolute',
        bottom: 0,
        width: '100%',
    },
    tab: {
        alignItems: 'center',
    },
    tabText: {
        color: '#fff',
        fontSize: 12,
        marginTop: 4,
    },
});

export default TabsNavigation;
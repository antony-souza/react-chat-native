import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { useNavigation, useRouter } from 'expo-router';

interface ITabsMenu {
    icon: string;
    route: string;
    name: string;
}

const TabsNavigation = () => {
    const router = useRouter();

    const tabsMenu:ITabsMenu[] = [
        { icon: 'home', route: '/rooms', name: 'Salas' },
        { icon: 'user-friends', route: '/friends', name: 'Amigos' },
    ]

    const goToRooms = () => {
        router.push('/rooms');
    }

    return (
        <View style={styles.container}>
            {tabsMenu.map((tab: ITabsMenu) => (
                <TouchableOpacity
                    key={tab.route}
                    style={styles.tab}
                    onPress={() => router.push(tab.route)}
                >
                    <Icon name={tab.icon} size={20} color="#fff" />
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
import { Text, TouchableOpacity, View, FlatList, StyleSheet } from "react-native";
import LayoutPage from "../../layouts/dark-layout";
import { useState } from "react";
import Icon from "react-native-vector-icons/FontAwesome5";
import { useRouter } from "expo-router";

interface IConfigList {
    name: string;
    icon: string;
    route: string;
}

const ConfigPage = () => {
    const title = "Configurações";
    const router = useRouter();
    const [configList] = useState<IConfigList[]>([
        { name: 'Alterar Informações', icon: 'user', route: '/update_profile' },
        { name: 'Segurança', icon: 'shield-alt', route: '/security' },
        { name: 'Notificações', icon: 'bell', route: '/notifications' },
        { name: 'Ajuda', icon: 'question-circle', route: '/help' },
    ]);

    const renderConfigList = ({ item }: { item: IConfigList }) => (
        <>
            <TouchableOpacity onPress={() => router.navigate(item.route)}>
                <View style={styles.card}>
                    <Icon name={item.icon} size={20} style={styles.icon} />
                    <Text style={styles.text}>{item.name}</Text>
                </View>
            </TouchableOpacity>
        </>
    )

    return (
        <LayoutPage headerTitle={title} tabs={true}>
            <FlatList
                data={configList}
                renderItem={renderConfigList}
                keyExtractor={(item) => item.name}
                contentContainerStyle={{ marginTop: 20, gap: 5 }}
            />
        </LayoutPage>
    );
};

const styles = StyleSheet.create({
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1E1E1E',
        padding: 15,
        gap: 10,
        marginVertical: 5,
        marginHorizontal: 10,
        borderRadius: 10,
        elevation: 2,
    },
    icon: {
        marginRight: 10,
        color: '#fff',
    },
    text: {
        fontSize: 16,
        fontWeight: '500',
        color: 'white',
    },
});

export default ConfigPage;

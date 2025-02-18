import { Text, TouchableOpacity, View, FlatList, StyleSheet, Image, Linking } from "react-native";
import LayoutPage from "../../layouts/dark-layout";
import { useEffect, useState } from "react";
import Icon from "react-native-vector-icons/FontAwesome5";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { httpClient } from "../../utils/generic-request";
import { environment } from "../environment/environment";

interface IUserResponse {
    id: string;
    name: string;
    email: string;
    imgUrl: string;
}

interface IConfigList {
    name: string;
    icon: string;
    route?: string;
}

const ConfigPage = () => {
    const title = "Configurações";
    const router = useRouter();
    const [user, setUser] = useState<IUserResponse>();
    const [configList] = useState<IConfigList[]>([
        { name: 'Alterar Informações', icon: 'user', route: '/put-user' },
        { name: 'Desenvolvedor', icon: 'github' },
    ]);

    useEffect(() => {
        findUser();
    }, []);

    const linkedGitHub = () => {
        Linking.openURL(environment.github);
    }

    const findUser = async () => {
        const userId = await SecureStore.getItemAsync("userId");
        const response = await httpClient.genericRequest(`${environment.getUser}/${userId}`, "GET") as IUserResponse;
        setUser(response);
    };

    const renderConfigList = ({ item }: { item: IConfigList }) => (
        <>
            <View style={styles.flatlistContainer}>
                <TouchableOpacity onPress={() => item.route ? router.push(item.route) : linkedGitHub()}>
                    <View style={styles.card}>
                        <Icon name={item.icon} size={20} style={styles.icon} />
                        <Text style={styles.text}>{item.name}</Text>
                    </View>
                </TouchableOpacity>
            </View>
        </>
    );

    return (
        <LayoutPage headerTitle={title} tabs={true}>
            <View style={styles.container}>
                <View style={styles.userContainer}>
                    <Image source={{ uri: user?.imgUrl }} style={styles.image} />
                    <Text style={styles.name}>{user?.name}</Text>
                    <Text style={styles.email}>{user?.email}</Text>
                </View>
                <FlatList
                    data={configList}
                    renderItem={renderConfigList}
                    keyExtractor={(item) => item.name}
                    contentContainerStyle={styles.flatlistContainer}
                />
            </View>
        </LayoutPage>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        gap: 20,
    },
    userContainer: {
        alignItems: 'center',
        gap: 5,
    },
    image: {
        width: 100,
        height: 100,
        borderRadius: 50,
    },
    name: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    email: {
        color: '#ccc',
        fontSize: 16,
    },
    flatlistContainer: {
        gap: 10,
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1E1E1E',
        padding: 15,
        gap: 10,
        borderRadius: 10,
        elevation: 2,
    },
    icon: {
        color: '#fff',
    },
    text: {
        fontSize: 16,
        fontWeight: '500',
        color: 'white',
    },
});

export default ConfigPage;

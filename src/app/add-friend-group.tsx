import { FlatList, Text, View, TouchableOpacity, Image, ActivityIndicator, StyleSheet, Alert } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome5";
import LayoutPage from "../../layouts/dark-layout";
import React, { useEffect, useState } from "react";
import { httpClient } from "../../utils/generic-request";
import * as Security from "expo-secure-store";
import { environment } from "../environment/environment";
import { useGlobalSearchParams, useRouter } from "expo-router";

interface IUserResponse {
    id: string;
    userId: string;
    name: string;
    image: string;
}

const AddFriendToGroup = () => {
    const title = "Adicionando Amigos ao Grupo";
    const router = useRouter();
    const { groupPrivateId } = useGlobalSearchParams() as { groupPrivateId: string };
    const [users, setUsers] = useState<IUserResponse[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchFriends = async () => {
            setLoading(true);
            try {
                const userId = await Security.getItemAsync("userId");
                const response = await httpClient.genericRequest(`${environment.findAllFriends}/${userId}`, "GET") as IUserResponse[];
                setUsers(response);
            } catch {
                Alert.alert("Erro ao buscar amigos", "Tente novamente mais tarde");
            } finally {
                setLoading(false);
            }
        };
        fetchFriends();
    }, []);

    const addFriendToGroup = async (friendId: string) => {
        try {
            setLoading(true);

            const response = await httpClient.genericRequest(`${environment.joinChat}/${groupPrivateId}/${friendId}`, "PUT");
            if (response) {
                Alert.alert(
                    "Adicionando ao grupo",
                    "Amigo adicionado com sucesso!"
                );
            }
        } catch {
            Alert.alert("Erro ao adicionar amigo ao grupo", "Tente novamente mais tarde");
        } finally {
            setLoading(false);
        }
    };

    return (
        <LayoutPage headerTitle={title} tabs={true}>
            <View style={styles.container}>
                {loading && <ActivityIndicator size="large" color="#007bff" style={styles.loader} />}
                <View style={styles.container}>
                    {loading && <ActivityIndicator size="large" color="#007bff" style={styles.loader} />}
                    {users.length > 0 ? (
                        <FlatList
                            data={users}
                            keyExtractor={(item) => item.id}
                            style={{ marginTop: 20 }}
                            renderItem={({ item }) => (
                                <View style={styles.card}>
                                    <Image source={{ uri: item.image }} style={styles.userImage} />
                                    <View style={styles.userInfo}>
                                        <Text style={styles.userName}>{item.name}</Text>
                                    </View>
                                    <TouchableOpacity style={styles.addButton} onPress={() => addFriendToGroup(item.userId)}>
                                        <Icon name="user-plus" size={24} color="#fff" />
                                    </TouchableOpacity>
                                </View>
                            )}
                        />
                    ) : (
                        !loading && <Text style={styles.noFriends}>Nenhum amigo na sua lista de amigos encontrado!</Text>
                    )}
                </View>

            </View>
        </LayoutPage>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
    },
    loader: {
        marginTop: 10,
    },
    card: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#222",
        padding: 15,
        borderRadius: 10,
        marginVertical: 8,
        shadowColor: "#000",
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
    },
    userImage: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 15,
    },
    userInfo: {
        flex: 1,
    },
    userName: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
    addButton: {
        padding: 8,
        backgroundColor: "#6200EE",
        borderRadius: 8,
    },
    noFriends: {
        textAlign: "center",
        color: "#bbb",
        fontSize: 16,
        marginTop: 10,
    },
    
});

export default AddFriendToGroup;

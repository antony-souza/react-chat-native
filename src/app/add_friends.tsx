import { FlatList, Text, View, TextInput, TouchableOpacity, Image, ActivityIndicator, StyleSheet, Alert } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome5";
import LayoutPage from "../../layouts/dark-layout";
import React, { useState } from "react";
import { httpClient } from "../../utils/generic-request";
import * as Security from "expo-secure-store";
import { environment } from "../environment/environment";

interface IUserResponse {
    id: string;
    name: string;
    email: string;
    imgUrl: string;
}

const AddFriends = () => {
    const title = "Adicionando Amigos";
    const [users, setUsers] = useState<IUserResponse[]>([]);
    const [name, setName] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSearch = async () => {
        setLoading(true);
        try {
            const response = await httpClient.genericRequest(`${environment.findByName}/${name}`, "GET") as IUserResponse[];
            setUsers(response);
        } catch (error) {
            Alert.alert("Erro ao buscar usuários");
            console.error("Erro ao buscar usuários", error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddFriend = async (friendId: string) => {
        try {
            setLoading(true);
            const userId = await Security.getItemAsync("userId");
            if (!userId) return;

            const response = await httpClient.genericRequest(environment.sendFriendRequest, "POST", { requesterUserId: userId, friendId: friendId });
            if (response) {
                Alert.alert("Solicitação de amizade enviada com sucesso");
                setLoading(false);
            }
        } catch {
            Alert.alert("Erro ao enviar solicitação de amizade");
            setLoading(false);
        }
        finally{
            setLoading(false);
        }
    };

    return (
        <LayoutPage headerTitle={title} tabs={true}>
            <View style={styles.container}>
                <TextInput
                    style={styles.input}
                    placeholder="Digite o nome do usuário"
                    placeholderTextColor="#aaa"
                    value={name}
                    onChangeText={setName}
                />
                <TouchableOpacity
                    style={[styles.button, name.trim() === "" && styles.buttonDisabled]}
                    onPress={handleSearch}
                    disabled={name.trim() === ""}
                >
                    <Text style={styles.buttonText}>Buscar</Text>
                </TouchableOpacity>

                {loading && <ActivityIndicator size="large" color="#007bff" style={styles.loader} />}

                <FlatList
                    data={users}
                    keyExtractor={(item) => item.id}
                    style={{ marginTop: 20 }}
                    renderItem={({ item }) => (
                        <View style={styles.card}>
                            <Image source={{ uri: item.imgUrl }} style={styles.userImage} />
                            <View style={styles.userInfo}>
                                <Text style={styles.userName}>{item.name}</Text>
                                <Text style={styles.userEmail}>{item.email}</Text>
                            </View>
                            {loading ? (
                                <ActivityIndicator size="small" color="#007bff" />
                            ) : (
                                (
                                    <TouchableOpacity style={styles.addButton} onPress={() => handleAddFriend(item.id)}>
                                        <Icon name="user-plus" size={24} color="#fff" />
                                    </TouchableOpacity>
                                )
                            )}
                        </View>
                    )}
                />
            </View>
        </LayoutPage>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
    },
    input: {
        borderWidth: 1,
        padding: 10,
        borderRadius: 5,
        marginBottom: 10,
        color: "#fff",
        borderColor: "#aaa",
    },
    button: {
        backgroundColor: "#6200EE",
        padding: 10,
        borderRadius: 5,
        alignItems: "center",
    },
    buttonText: {
        color: "#fff",
        fontWeight: "bold",
    },
    buttonDisabled: {
        backgroundColor: "#aaa",
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
    userEmail: {
        color: "#bbb",
        fontSize: 14,
    },
    addButton: {
        padding: 8,
        backgroundColor: "#6200EE",
        borderRadius: 8,
    },
});

export default AddFriends;

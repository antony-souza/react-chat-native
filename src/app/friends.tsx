import { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, ActivityIndicator, Alert } from "react-native";
import * as Security from 'expo-secure-store';
import { httpClient } from "../../utils/generic-request";
import { environment } from "../environment/environment";
import Header from "../../components/header";
import LayoutPage from "../../layouts/dark-layout";
import Icon from "react-native-vector-icons/FontAwesome5";
import { useRouter } from "expo-router";


interface IFriend{
    id: string,
    name: string,
    image: string,
}

interface IFriendResponse{
    friend: IFriend,
    id: string,
}

interface IFriends {
    id: string;
    requesterUserId: string;
    requesterUserName: string;
    requesterUserImg: string;
}

const FriendsPage = () => {
    const title = "Amigos";
    const router = useRouter()
    const [friends, setFriends] = useState<IFriend[]>([]);
    const [requestsFriends, setRequestsFriends] = useState<IFriends[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        fetchFriends();
        listAllFriendRequest();
    }, []);

    const listAllFriendRequest = async () => {
        try {
            const userId = await Security.getItemAsync('userId');
            if (!userId) return;

            const response = await httpClient.genericRequest(`${environment.listAllFriendRequest}/${userId}`, "GET") as IFriends[];

            setRequestsFriends(response);
        } catch (error) {
            Alert.alert("Erro ao buscar solicitações de amizade");
        } finally {
            setLoading(false);
        }
    };

    const fetchFriends = async () => {
        try {
            const userId = await Security.getItemAsync('userId');
            if (!userId) return;

            const response = await httpClient.genericRequest(`${environment.findAllFriends}/${userId}`, "GET") as IFriendResponse[];

            if (!response) {
                Alert.alert("Falha ao buscar amigos");
                return;
            }
            
            const friends = response.map(item => item.friend);
            setFriends(friends);
        } catch (error) {
            Alert.alert("Erro ao buscar amigos");
        } finally {
            setLoading(false);
        }
    };

    const acceptFriendRequest = async (id: string) => {
        try {
            const friendId = await Security.getItemAsync('userId');
            if (!friendId) return;

            const response = await httpClient.genericRequest(`${environment.acceptFriendRequest}/${friendId}/${id}`, "PUT");
            if (!response) {
                Alert.alert("Falha ao aceitar solicitação de amizade");
                return;
            }

            listAllFriendRequest();
            fetchFriends();
        } catch (error) {
            Alert.alert("Erro ao aceitar solicitação de amizade");
        }
    }

    const rejectFriendRequest = async (id: string) => {
        try {
            setLoading(true);
            const friendId = await Security.getItemAsync('userId');
            if (!friendId) return;

            await httpClient.genericRequest(`${environment.rejectFriendRequest}/${friendId}/${id}`, "PUT");

            listAllFriendRequest();
        } catch (error) {
            Alert.alert("Falha ao rejeitar solicitação de amizade");
        }
        finally {
            setLoading(false);
        }
    };

    const removeFriend = async (id: string) => {
        try {
            setLoading(true);

            await httpClient.genericRequest(`${environment.removeFriend}/${id}`, "PUT");

            fetchFriends();
        } catch (error) {
            Alert.alert("Falha ao remover amigo");
        }
        finally {
            setLoading(false);
        }
    };

    const goToFriendChat = async (groupName: string, friendId: string, friendImgUrl: string) => {
        const userId = await Security.getItemAsync('userId') as string;
        const formData = new FormData();

        formData.append("name", groupName);
        formData.append("users", userId);
        formData.append("private", "true");
        formData.append("users", friendId);
        const file = {
            uri: friendImgUrl,
            name: `chat.${friendImgUrl.split('.').pop()}`,
            type: `image/${friendImgUrl.split('.').pop()}`,
        };

        formData.append("imgUrl", file as any);

        const response = await httpClient.genericRequest(environment.createRoom, "POST", formData);
        if (response.statusCode === 400 || response.statusCode === 500 || response.statusCode === 501) {
            Alert.alert("Falha ao criar sala.");
            return;
        }
        
        router.push({
            pathname: "/chat",
            params: { groupName: groupName, groupId: `${friendId}-${userId}` },
        });
    };

    const renderAllFriends = ({ item }: { item: IFriend }) => (
        <View style={styles.card}>
            <Image
                source={{ uri: item.image }}
                style={styles.image} />
            <View style={styles.info}>
                <Text style={styles.friendName}>{item.name}</Text>
            </View>
            <TouchableOpacity onPress={() => goToFriendChat(item.name, item.id, item.image)}>
                <Icon name="comment-dots" size={24} color="#fff" style={styles.icon} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => removeFriend(item.id)}>
                {loading ?
                    <ActivityIndicator size="small" color="#6200EE" />
                    : <Icon name="user-minus" size={24} color="red" style={styles.icon} />}
            </TouchableOpacity>
        </View>
    );

    const renderRequestsFriends = ({ item }: { item: IFriends }) => (
        <View style={styles.card}>
            <Image source={{ uri: item.requesterUserImg }} style={styles.image} />
            <View style={styles.info}>
                <Text style={styles.friendName}>{item.requesterUserName}</Text>
            </View>
            <View style={styles.actions}>
                <TouchableOpacity onPress={() => acceptFriendRequest(item.id)}>
                    <Icon name="user-check" size={24} color="green" style={styles.icon} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => rejectFriendRequest(item.id)}>
                    <Icon name="user-times" size={24} color="red" style={styles.icon} />
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <LayoutPage>
            <Header title={title} />
            <View style={styles.container}>
                <Text style={styles.sectionTitle}>Solicitações de Amizade</Text>
                {loading ? (
                    <ActivityIndicator size="large" color="#6200EE" />
                ) : requestsFriends.length > 0 ? (
                    <FlatList
                        data={requestsFriends}
                        keyExtractor={(item) => item.id}
                        renderItem={renderRequestsFriends}
                        contentContainerStyle={styles.list}
                    />
                ) : (
                    <Text style={styles.noFriendsText}>Nenhuma solicitação pendente</Text>
                )}

                <Text style={styles.sectionTitle}>Amigos</Text>
                {loading ? (
                    <ActivityIndicator size="large" color="#6200EE" />
                ) : friends.length > 0 ? (
                    <FlatList
                        data={friends}
                        keyExtractor={(item) => item.id}
                        renderItem={renderAllFriends}
                        contentContainerStyle={styles.list}
                    />
                ) : (
                    <Text style={styles.noFriendsText}>Nenhum amigo encontrado</Text>
                )}
            </View>
        </LayoutPage>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 16,
    },
    list: {
        paddingBottom: 16,
    },
    card: {
        flexDirection: "row",
        backgroundColor: "#1E1E1E",
        borderRadius: 12,
        padding: 12,
        marginBottom: 16,
        alignItems: "center",
        shadowColor: "#000",
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 5,
        justifyContent: "space-between",
    },
    image: {
        width: 60,
        height: 60,
        borderRadius: 30,
        marginRight: 12,
    },
    info: {
        flex: 1,
        justifyContent: "center",
    },
    friendName: {
        fontSize: 18,
        color: "#fff",
        fontWeight: "bold",
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#fff",
        marginBottom: 10,
        marginTop: 20,
    },
    noFriendsText: {
        textAlign: "center",
        fontSize: 16,
        marginTop: 20,
        color: "#fff",
    },
    actions: {
        flexDirection: "row",
        gap: 10,
    },
    icon: {
        marginHorizontal: 8,
    },
})

export default FriendsPage;
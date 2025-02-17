import { Text, TouchableOpacity, View, FlatList, StyleSheet, Image, Alert } from "react-native";
import LayoutPage from "../../layouts/dark-layout";
import { useEffect, useState } from "react";
import { httpClient } from "../../utils/generic-request";
import { environment } from "../environment/environment";
import { useGlobalSearchParams, useRouter } from "expo-router";
import Icon from "react-native-vector-icons/FontAwesome5";
import * as Security from "expo-secure-store";

interface IChatResponse {
    userId: string;
    userName: string;
    userImgUrl: string;
    userEmail: string;
    chatId: string;
    chatName: string;
    chatImgUrl: string;
}

const InformationChat = () => {
    const title = "Informações do Grupo";
    const { groupId } = useGlobalSearchParams() as { groupId: string };
    const router = useRouter()
    const [chat, setChat] = useState<IChatResponse[]>([]);

    useEffect(() => {
        findChatInfo();
    }, []);

    const findChatInfo = async () => {
        const response = await httpClient.genericRequest(`${environment.getChatInfo}/${groupId}`, "GET") as IChatResponse[]
        setChat(response);
    };

    const handleRouterToAddMembers = () => {
        router.navigate({
            pathname: "add-friend-group",
            params: { groupPrivateId: groupId }
        });
    }

    const removeMember = async (userId: string) => {
        const adminId = await Security.getItemAsync('userId');
        
        const response = await httpClient.genericRequest(`${environment.removeUserFromChat}/${groupId}/${userId}/${adminId}`, "PUT");

        if (response) {
            findChatInfo();
        }
    }

    const confirmRemoveUser = (userId: string) => {
        Alert.alert(
            "Remover Membro",
            "Tem certeza que deseja remover esse membro?",
            [
                {
                    text: "Não",
                    style: "cancel"
                },
                {
                    text: "Sim",
                    onPress: () => removeMember(userId)
                }
            ]
        );
    }

    const renderMembers = ({ item }: { item: IChatResponse }) => (
        <View style={styles.arrayUsers}>
            <Image source={{ uri: item.userImgUrl }} style={styles.imgUser} />
            <View style={styles.userInfo}>
                <Text style={styles.userName}>{item.userName}</Text>
                <Text style={styles.userEmail}>{item.userEmail}</Text>
            </View>
            <TouchableOpacity onPress={() => confirmRemoveUser(item.userId)} style={styles.removeIcon}>
                <Icon name="user-times" size={20} color="red" />
            </TouchableOpacity>
        </View>
    );

    return (
        <LayoutPage headerTitle={title} tabs={false}>
            <View style={styles.container}>
                <View style={styles.chatContainer}>
                    <Image source={{ uri: chat[0]?.chatImgUrl }} style={styles.imageChat} />
                    <Text style={styles.name}>{chat[0]?.chatName}</Text>
                </View>
                <View style={styles.titleAndAddMembers}>
                    <Text style={styles.sectionTitle}>Membros</Text>
                    <TouchableOpacity onPress={handleRouterToAddMembers}>
                        <Text style={styles.addMembers}>Adicionar Membros</Text>
                    </TouchableOpacity>
                </View>
                <FlatList
                    data={chat}
                    renderItem={renderMembers}
                    keyExtractor={item => item.userId}
                    style={styles.flatlistContainer}
                    ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
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
    chatContainer: {
        alignItems: 'center',
        gap: 5,
    },
    imageChat: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderColor: '#fff',
        borderWidth: 2,
    },
    name: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    titleAndAddMembers: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    sectionTitle: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
    },
    addMembers: {
        color: '#6200EE',
        fontSize: 16,
    },
    flatlistContainer: {
        marginTop: 10,
    },
    arrayUsers: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1E1E1E',
        padding: 15,
        gap: 10,
        borderRadius: 10,
        elevation: 2,
    },
    userInfo: {
        flex: 1,
    },
    userName: {
        fontSize: 16,
        fontWeight: '500',
        color: 'white',
    },
    userEmail: {
        fontSize: 14,
        color: '#aaa',
    },
    imgUser: {
        width: 50,
        height: 50,
        borderRadius: 25,
    },
    removeIcon: {
        marginLeft: 'auto',
    },
});

export default InformationChat;

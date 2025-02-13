import { Text, TouchableOpacity, View, FlatList, StyleSheet, Image } from "react-native";
import LayoutPage from "../../layouts/dark-layout";
import { useEffect, useState } from "react";
import { httpClient } from "../../utils/generic-request";
import { environment } from "../environment/environment";
import { useGlobalSearchParams } from "expo-router";


interface IChatResponse {
    userId: string;
    userName: string;
    userImgUrl: string;
    chatId: string;
    chatName: string;
    chatImgUrl: string;
}

const InformationChat = () => {
    const title = "Informações do Grupo";
    const { groupId } = useGlobalSearchParams() as { groupId: string };
    const [chat, setChat] = useState<IChatResponse[]>([]);

    useEffect(() => {
        findChatInfo();
    }, []);

    const findChatInfo = async () => {
        const response = await httpClient.genericRequest(`${environment.getChatInfo}/${groupId}`, "GET") as IChatResponse[]
        setChat(response);
    };

    const renderMembers = ({ item }: { item: IChatResponse }) => (
        <View style={styles.arrayUsers}>
            <Image source={{ uri: item.userImgUrl }} style={styles.imgUser} />
            <Text style={styles.userName}>{item.userName}</Text>
        </View>
    );

    return (
        <LayoutPage headerTitle={title} tabs={false}>
            <View style={styles.container}>
                <View style={styles.chatContainer}>
                    <Image source={{ uri: chat[0]?.chatImgUrl }} style={styles.imageChat} />
                    <Text style={styles.name}>{chat[0]?.chatName}</Text>
                </View>
                <Text style={styles.sectionTitle}>Membros</Text>
                <FlatList
                    data={chat}
                    renderItem={renderMembers}
                    keyExtractor={item => item.userId}
                    style={styles.flatlistContainer}
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
    sectionTitle: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 10,
    },
    flatlistContainer: {
        gap: 1,
    },
    arrayUsers: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1E1E1E',
        padding: 10,
        gap: 10,
        borderRadius: 10,
        elevation: 2,
    },
    userName: {
        fontSize: 16,
        fontWeight: '500',
        color: 'white',
    },
    imgUser: {
        width: 50,
        height: 50,
        borderRadius: 25,
    }
});

export default InformationChat;

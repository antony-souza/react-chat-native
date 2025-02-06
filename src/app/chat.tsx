import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    FlatList,
    Image,
} from 'react-native';
import io from 'socket.io-client';
import * as SecureStore from 'expo-secure-store';
import { useRouter } from 'expo-router';
import LayoutPage from '../../layouts/dark-layout';
import { useGlobalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { environment } from '../environment/environment';
import { httpClient } from '../../utils/generic-request';

interface IMessage {
    clientId: string;
    message: string;
    userImg: string;
    userName: string;
    userId: string;
}

interface IUserResponse {
    _id: string;
    name: string;
    imgUrl: string;
}

const ChatPage: React.FC = () => {
    const { groupName, groupId } = useGlobalSearchParams() as { groupName: string; groupId: string };
    const router = useRouter();
    const [messages, setMessages] = useState<IMessage[]>([]);
    const [newMessage, setNewMessage] = useState<string>('');
    const [socket, setSocket] = useState<any>(null);
    const [userId, setUserId] = useState<string | null>(null);
    const [userName, setUserName] = useState<string | null>(null);
    const [userImg, setUserImg] = useState<string | null>(null);

    useEffect(() => {
        findOneUser();
        handleHistoryMessages();
        webSocketClient();
    }, []);

    const handleHistoryMessages = async () => {
        const chatId = groupId; 
        const response = await httpClient.genericRequest(`${environment.historyMessages}/${chatId}`, "GET");
        if (response && Array.isArray(response)) {
            const mappedMessages = response.map((msg: any) => ({
                clientId: msg._id,
                message: msg.message,
                userImg: msg.userImgUrl,
                userName: msg.userName,
                userId: msg.userId,
            }));
            setMessages(mappedMessages)
        }
    };

    const webSocketClient = async () => {
        const socketConnection = io(environment.apiUrl, {
            autoConnect: true,
        });
        setSocket(socketConnection);

        socketConnection.emit('joinGroup', userName, groupName);

        socketConnection.on('msgGroup', (data: IMessage) => {
            setMessages((prevMessages) => [...prevMessages, data]);
        });
    };

    const findOneUser = async (): Promise<IUserResponse> => {
        const userId = await SecureStore.getItemAsync('userId');
        const response = await httpClient.genericRequest(`${environment.getUser}/${userId}`, 'GET') as IUserResponse;
        setUserId(response._id);
        setUserName(response.name);
        setUserImg(response.imgUrl);

        return response;
    };

    const handleSendMessage = () => {
        if (newMessage.trim() && socket && userId && userImg && userName) {
            const messageData: IMessage = {
                clientId: userId,
                message: newMessage,
                userImg: userImg,
                userId: userId,
                userName: userName,
            };
            socket.emit('sendMessage', { groupName, groupId, ...messageData });
            setNewMessage('');
        }
    };

    const handleLeaveGroup = () => {
        if (socket) {
            socket.emit('leaveGroup', groupName);
            socket.disconnect();
        }
        router.back()
    };

    const renderMessage = ({ item }: { item: IMessage }) => (
        <View
            style={[
                styles.messageContainer,
                item.clientId === userId ? styles.messageRight : styles.messageLeft,
            ]}
        >
            <View style={styles.messageHeader}>
                <Image
                    source={{ uri: item.userImg }}
                    style={styles.senderPhoto}
                />
                <Text style={styles.senderName}>{item.userName}</Text>
            </View>
            <Text style={styles.messageText}>{item.message}</Text>
        </View>
    );

    return (
        <LayoutPage headerTitle={groupName} onBack={handleLeaveGroup}>
            <View style={styles.container}>
                <View style={styles.chatBox}>
                    <FlatList
                        data={messages}
                        renderItem={renderMessage}
                        keyExtractor={(item, index) => index.toString()}
                        style={styles.messagesList}
                    />
                </View>
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Digite sua mensagem"
                        placeholderTextColor={'#999'}
                        value={newMessage}
                        onChangeText={setNewMessage}
                    />
                    <TouchableOpacity onPress={handleSendMessage} style={styles.sendButton}>
                        <Text style={styles.sendButtonText}>Enviar</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </LayoutPage>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-between',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
        backgroundColor: '#1e1e1e',
        borderBottomWidth: 1,
        borderBottomColor: '#333',
    },
    backButton: {
        marginRight: 10,
    },
    groupName: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    chatBox: {
        flex: 1,
        margin: 10,
        padding: 10,
        borderRadius: 10,
    },
    messagesList: {
        flex: 1,
    },
    messageContainer: {
        maxWidth: '70%',
        marginVertical: 5,
        padding: 10,
        gap: 5,
        borderRadius: 10,
    },
    messageLeft: {
        alignSelf: 'flex-start',
        backgroundColor: '#333',
    },
    messageRight: {
        alignSelf: 'flex-end',
        backgroundColor: '#6200EE',
    },
    messageHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
    },
    senderPhoto: {
        width: 30,
        height: 30,
        borderRadius: 15,
        marginRight: 5,
    },
    senderName: {
        color: '#fff',
        fontWeight: 'bold',
    },
    messageText: {
        color: '#fff',
        fontSize: 16,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        backgroundColor: '#1e1e1e',
    },
    input: {
        flex: 1,
        height: 40,
        backgroundColor: '#333',
        color: '#fff',
        borderRadius: 8,
        paddingHorizontal: 10,
    },
    sendButton: {
        marginLeft: 10,
        backgroundColor: '#6200EE',
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 8,
    },
    sendButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});

export default ChatPage;

import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList, Image } from 'react-native';
import io from 'socket.io-client';
import { httpClient } from '../../utils/generic-request';
import { environment } from '../../environment/environment';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LayoutPage from '../../layouts/dark-layout';

interface IUserApiResponse {
    id?: string;
    name: string;
    userImg: string;
}

interface IMessageSocketResponse {
    user: IUserApiResponse;
    messageData: string;
}

interface IMsgGroupSocketResponse {
    clientId: string;
    message: string;
}

const ChatPage: React.FC = () => {
    const [messages, setMessages] = useState<IMessageSocketResponse[]>([]);
    const [newMessage, setNewMessage] = useState<string>('');
    const [socket, setSocket] = useState<any>(null);
    const [userName, setUserName] = useState<string | null>(null);
    const [userImg, setUserImg] = useState<string | null>(null);

    useEffect(() => {

        const fetchUserData = async () => {
            const storedUserName = await AsyncStorage.getItem('userName');
            const storedUserImg = await AsyncStorage.getItem('userImg');

            setUserName(storedUserName);
            setUserImg(storedUserImg);
        };

        fetchUserData();

        const socketConnection = io(environment.apiUrl, {
            autoConnect: true,
        });
        setSocket(socketConnection);

        socketConnection.on('msgGroup', (data: IMsgGroupSocketResponse) => {
            setMessages((prevMessages) => [
                ...prevMessages,
                {
                    user: {
                        name: userName || "Usuário Desconhecido",
                        userImg: userImg || "defaultImageUrl",
                    },
                    messageData: data.message,
                },
            ]);
        });

        return () => {
            socketConnection.disconnect();
        };
    }, [userName, userImg]);

    const handleSendMessage = () => {
        if (newMessage.trim() && socket) {
            const groupId = 'duckenterprise';
            socket.emit('sendMessage', { groupId, message: newMessage });
            setNewMessage('');
        }
    };

    const handleJoinGroup = () => {
        const groupId = 'duckenterprise';
        if (socket) {
            socket.emit('joinGroup', groupId);
        }
    };

    return (
        <LayoutPage>
            <View style={styles.container}>
                <FlatList
                    data={messages}
                    renderItem={({ item }) => (
                        <View style={styles.messageContainer}>
                            <View style={styles.messageHeader}>
                                <Image source={{ uri: item.user.userImg }} style={styles.senderPhoto} />
                                <Text style={styles.senderName}>{item.user.name}</Text>
                            </View>
                            <Text style={styles.messageText}>{item.messageData}</Text>
                        </View>
                    )}
                    keyExtractor={(item, index) => index.toString()}
                    style={styles.messagesList}
                />


                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Digite sua mensagem"
                        value={newMessage}
                        onChangeText={setNewMessage}
                    />
                    <TouchableOpacity onPress={handleSendMessage} style={styles.sendButton}>
                        <Text style={styles.sendButtonText}>Enviar</Text>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity onPress={handleJoinGroup} style={styles.joinButton}>
                    <Text style={styles.joinButtonText}>Entrar na sala</Text>
                </TouchableOpacity>
            </View>
        </LayoutPage>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-between',
    },
    messagesList: {
        flex: 1,
        marginBottom: 20,
    },
    messageContainer: {
        padding: 10,
        backgroundColor: '#333',
        marginBottom: 10,
        borderRadius: 8,
    },
    messageHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
    },
    senderPhoto: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 10,
    },
    senderName: {
        color: '#fff',
        fontWeight: 'bold',
    },
    messageText: {
        color: '#fff',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        backgroundColor: '#121212',
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
    joinButton: {
        backgroundColor: '#6200EE',
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 8,
        marginBottom: 10,
    },
    joinButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});

export default ChatPage;

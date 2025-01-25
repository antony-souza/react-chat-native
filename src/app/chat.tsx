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
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import LayoutPage from '../../layouts/dark-layout';
import { useGlobalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { environment } from '../environment/environment';

interface IMessage {
    clientId: string;
    message: string;
    userImg: string;
    userName: string;
    userId: string;
}

const ChatPage: React.FC = () => {
    const { groupName } = useGlobalSearchParams();
    const router = useRouter();
    const [messages, setMessages] = useState<IMessage[]>([]);
    const [newMessage, setNewMessage] = useState<string>('');
    const [socket, setSocket] = useState<any>(null);
    const [userId, setUserId] = useState<string | null>(null);
    const [userName, setUserName] = useState<string | null>(null);
    const [userImg, setUserImg] = useState<string | null>(null);

    useEffect(() => {
        const fetchUserData = async () => {
            const storedUserId = await AsyncStorage.getItem('@userId');
            const storedUserName = await AsyncStorage.getItem('@userName');
            const storedUserImg = await AsyncStorage.getItem('@userImg');

            setUserId(storedUserId);
            setUserName(storedUserName);
            setUserImg(storedUserImg);
        };

        fetchUserData();

        const socketConnection = io(environment.apiUrl, {
            autoConnect: true,
        });
        setSocket(socketConnection);

        socketConnection.emit('joinGroup', groupName);

        socketConnection.on('msgGroup', (data: IMessage) => {
            setMessages((prevMessages) => [...prevMessages, data]);
        });

        return () => {
            socketConnection.disconnect();
        };
    }, []);

    const handleSendMessage = () => {
        if (newMessage.trim() && socket && userId && userImg && userName) {
            const messageData: IMessage = {
                clientId: userId,
                message: newMessage,
                userImg: userImg,
                userId: userId,
                userName: userName,
            };
            socket.emit('sendMessage', { groupName: groupName, ...messageData });
            setNewMessage('');
        }
    };

    const handleLeaveGroup = () => {
        if (socket) {
            socket.emit('leaveGroup', groupName);
            socket.disconnect();
        }
        router.push('/rooms');
    };

    return (
        <LayoutPage>
            <View style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={handleLeaveGroup} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color="#fff" />
                    </TouchableOpacity>
                    <Text style={styles.groupName}>{groupName}</Text>
                    <Text>{''}</Text>
                </View>
                <View style={styles.chatBox}>
                    <FlatList
                        data={messages}
                        renderItem={({ item }) => (
                            <View
                                style={[
                                    styles.messageContainer,
                                    item.clientId === userId
                                        ? styles.messageRight
                                        : styles.messageLeft,
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
                        )}
                        keyExtractor={(item, index) => index.toString()}
                        style={styles.messagesList}
                    />
                </View>
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

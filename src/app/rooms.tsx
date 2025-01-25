import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
} from 'react-native';
import LayoutPage from '../../layouts/dark-layout';
import * as SecureStore from 'expo-secure-store';
import { useRouter } from 'expo-router';

const RoomSelectionPage: React.FC = () => {
    const [roomName, setRoomName] = useState<string>('');
    const [userName, setUserName] = useState<string>('');

    const router = useRouter();

    const fetchUserData = async () => {
        const storedUserName = await SecureStore.getItemAsync('userName') || '';
        setUserName(storedUserName);
    };

    useEffect(() => {
        fetchUserData
    }, []);

    const handleCreateOrJoinRoom = () => {
        if (!roomName.trim()) {
            Alert.alert('Erro', 'Por favor, insira um nome para a sala.');
            return;
        }

        router.push({
            pathname: '/chat',
            params: { groupName: roomName },
        });
    };

    return (
        <LayoutPage>
            <View style={styles.container}>
                <Text style={styles.title}>{userName},</Text>
                <Text style={styles.title}>Bem-vindo ao DuckChat!</Text>
                <Text style={styles.subtitle}>Crie ou entre em uma sala</Text>

                <TextInput
                    style={styles.input}
                    placeholder="Digite o nome da sala"
                    placeholderTextColor="#aaa"
                    value={roomName}
                    onChangeText={setRoomName}
                />

                <TouchableOpacity
                    onPress={handleCreateOrJoinRoom}
                    style={styles.button}
                >
                    <Text style={styles.buttonText}>Entrar na Sala</Text>
                </TouchableOpacity>
            </View>
        </LayoutPage>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 16,
        color: '#ccc',
        marginBottom: 20,
    },
    input: {
        width: '100%',
        height: 50,
        backgroundColor: '#333',
        borderRadius: 10,
        paddingHorizontal: 15,
        color: '#fff',
        fontSize: 16,
        marginBottom: 20,
    },
    button: {
        width: '100%',
        height: 50,
        backgroundColor: '#6200EE',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default RoomSelectionPage;

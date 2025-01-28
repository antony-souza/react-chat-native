import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
} from 'react-native';
import LayoutPage from '../../layouts/dark-layout';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { useRouter } from 'expo-router';
import Header from '../../components/header';


const RoomSelectionPage: React.FC = () => {
    const title = 'DuckChat';
    const [roomName, setRoomName] = useState<string>('');

    const router = useRouter();

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

    const handleListRooms = () => {
        router.push('/allrooms');
    }

    return (
        <LayoutPage>
            <Header title={title} />
            <View style={styles.container}>
                <Icon name="comments" style={styles.logoContainer} />
                <Text style={styles.title}>Bem-vindo ao DuckChat!</Text>
                <Text style={styles.subtitle}>Crie ou entre em uma sala</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Digite o nome da sala"
                    placeholderTextColor="#aaa"
                    value={roomName}
                    onChangeText={setRoomName}
                />

                <View style={styles.buttonGroup}>
                    <TouchableOpacity
                        onPress={handleCreateOrJoinRoom}
                        style={styles.button}
                    >
                        <Text style={styles.buttonText}>Entrar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={handleCreateOrJoinRoom}
                        style={styles.button}
                    >
                        <Text style={styles.buttonText}>Criar Sala</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={handleListRooms}
                        style={styles.button}
                    >
                        <Text style={styles.buttonText}>Listar Salas</Text>
                    </TouchableOpacity>
                </View>
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
    buttonGroup: {
        width: '100%',
        marginTop: 10,
    },
    button: {
        width: '100%',
        height: 50,
        backgroundColor: '#6200EE',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        marginBottom: 10, 
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    logoContainer: {
        justifyContent: "center",
        fontSize: 100,
        alignItems: "center",
        color: "#6200EE",
        padding: 20,
    },
});

export default RoomSelectionPage;

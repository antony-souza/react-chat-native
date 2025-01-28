import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from "react-native";
import LayoutPage from "../../layouts/dark-layout";
import { useEffect, useState } from "react";
import { environment } from "../environment/environment";
import { httpClient } from "../../utils/generic-request";
import Icon from "react-native-vector-icons/FontAwesome5";
import Header from "../../components/header";
import { useGlobalSearchParams, useRouter } from "expo-router";

interface IRoomsList {
    id: string;
    name: string;
    imgUrl: string;
}

const RoomsListPage = () => {
    const { groupId } = useGlobalSearchParams();
    const [rooms, setRooms] = useState<IRoomsList[]>([]);

    const title: string = "Salas";
    const router = useRouter();

    useEffect(() => {
        handleListRooms();
    }, []);


    const handleListRooms = async (): Promise<IRoomsList[]> => {
        const response = await httpClient.genericRequest(environment.finAllChats, "GET") as IRoomsList[];
        setRooms(response);

        return response;
    };

    const handlePathChat = (groupName: string, groupId:string) => {
        router.push({
            pathname: "/chat",
            params: { groupName, groupId: groupId },
        });
    };

    const handlePathNewRoom = () => {
        router.push("/new_room");
    }

    const renderRoom = ({ item }: { item: IRoomsList }) => (
        <TouchableOpacity onPress={() => handlePathChat(item.name, item.id)} style={styles.card}>
            <Image source={{ uri: item.imgUrl }} style={styles.image} />
            <View style={styles.info}>
                <Text style={styles.roomName}>{item.name}</Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <LayoutPage>
            <Header title={title} />
            <View style={styles.container}>
                <TouchableOpacity style={styles.newRoomButton} onPress={handlePathNewRoom}>
                    <Icon name="users" size={20} color="#fff" />
                    <Text style={styles.newRoomText}>Nova Sala</Text>
                </TouchableOpacity>
                <FlatList
                    data={rooms}
                    renderItem={renderRoom}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.list}
                />
            </View>
        </LayoutPage>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    newRoomButton: {
        backgroundColor: "#6200EE",
        flexDirection: "row",
        justifyContent: "center",
        gap: 8,
        padding: 12,
        borderRadius: 8,
        alignItems: "center",
        marginBottom: 16,
    },
    newRoomText: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "bold",
    },
    title: {
        fontSize: 24,
        color: "#fff",
        fontWeight: "bold",
        marginBottom: 16,
        textAlign: "center",
    },
    list: {
        paddingBottom: 16,
    },
    card: {
        flexDirection: "row",
        backgroundColor: "#1E1E1E",
        borderRadius: 12,
        padding: 12,
        marginBottom: 8,
        alignItems: "center",
        shadowColor: "#000",
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 5,
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
    roomName: {
        fontSize: 18,
        color: "#fff",
        fontWeight: "bold",
    },
});

export default RoomsListPage;
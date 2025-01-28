import { View, Text, StyleSheet, FlatList, Image } from "react-native";
import LayoutPage from "../../layouts/dark-layout";
import { useEffect, useState } from "react";
import { environment } from "../environment/environment";
import { httpClient } from "../../utils/generic-request";
import Header from "../../components/header";

interface IRoomsList {
    id: string;
    name: string;
    imgUrl: string;
}

export const RoomsListPage = () => {
    const [rooms, setRooms] = useState<IRoomsList[]>([]);

    useEffect(() => {
        handleListRooms();
    }, []);

    const handleListRooms = async () => {
        const response = await httpClient.genericRequest(environment.finAllChats, "GET") as IRoomsList[];
        setRooms(response);
        console.log(response);
    };

    const renderRoom = ({ item }: { item: IRoomsList }) => (
        <View style={styles.card}>
            <Image source={{ uri: item.imgUrl }} style={styles.image} />
            <View style={styles.info}>
                <Text style={styles.roomName}>{item.name}</Text>
            </View>
        </View>
    );

    return (
        <LayoutPage>
            <Header />
            <View style={styles.container}>
                <Text style={styles.title}>Lista de Salas</Text>
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

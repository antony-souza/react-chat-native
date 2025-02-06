import { Text, View, Image, StyleSheet, Alert } from "react-native";
import LayoutPage from "../../layouts/dark-layout";
import { useEffect, useState } from "react";
import { environment } from "../environment/environment";
import { httpClient } from "../../utils/generic-request";
import * as SecureStore from "expo-secure-store";

interface IUserResponse {
    name: string;
    email: string;
    imgUrl: string;
}

const Profile = () => {
    const title = "Profile";
    const [user, setUser] = useState<IUserResponse>();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchUser();
    }, []);

    const fetchUser = async () => {
        try {
            setLoading(true);
            const userId = await SecureStore.getItemAsync("userId");
            const response = await httpClient.genericRequest(`${environment.getUser}/${userId}`, "GET") as IUserResponse;
            setUser(response);
        } catch (error) {
            Alert.alert("Falha ao buscar as informações de perfil");
            setLoading(false);
        }
        finally {
            setLoading(false);
        }
    }

    return (
        <LayoutPage headerTitle={title} tabs={true}>
            <View style={styles.container}>
                <Image
                    source={{ uri: user?.imgUrl }}
                    style={styles.avatar}
                />
                <Text style={styles.name}>{user?.name}</Text>
                <Text style={styles.email}>{user?.email}</Text>
            </View>
        </LayoutPage>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        padding: 20,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 10,
    },
    name: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#fff",
    },
    email: {
        fontSize: 16,
        color: "#ccc",
    },
});

export default Profile;

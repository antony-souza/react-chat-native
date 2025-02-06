import { Text, View, Image, StyleSheet } from "react-native";
import LayoutPage from "../../layouts/dark-layout";

const Profile = () => {
    const title = "Profile";



    const userExemple = {
        name: "Antony Souza",
        email: "antony@example.com",
        avatar: "https://i.pravatar.cc/150?img=3"
    };

    return (
        <LayoutPage headerTitle={title} tabs={true}>
            <View style={styles.container}>
                <Image source={{ uri: userExemple.avatar }} style={styles.avatar} />
                <Text style={styles.name}>{userExemple.name}</Text>
                <Text style={styles.email}>{userExemple.email}</Text>
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

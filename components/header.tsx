import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";

interface IHeaderProps {
    title: string;
    arrowBackFunction?: () => void
}

const Header:React.FC<IHeaderProps> = ({title, arrowBackFunction}) => {
    const router = useRouter();

    const onLogoutPress = async () => {
        await SecureStore.deleteItemAsync("userId");
        router.push("/");
    }

    const handleBackPage = () => {
        if (arrowBackFunction) {
            arrowBackFunction();
        } else {
            router.back();
        }
    }

    return (
        <View style={styles.header}>
            <TouchableOpacity onPress={handleBackPage}>
                <Ionicons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.title}>{title}</Text>
            <TouchableOpacity onPress={onLogoutPress}>
                <Ionicons name="log-out-outline" size={24} color="#fff" />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: 16,
        backgroundColor: "#1E1E1E",
        height: 60,
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#fff",
    },
});

export default Header;

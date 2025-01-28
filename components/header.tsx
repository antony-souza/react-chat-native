import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons"; // Biblioteca de ícones

interface HeaderProps {
    onMenuPress: () => void;
    onLogoutPress: () => void;
}

const Header = () => {

    const onMenuPress = () => {
        console.log("Menu Pressed");
    }

    const onLogoutPress = () => {
        console.log("Logout Pressed");
    }

    return (
        <View style={styles.header}>
            <TouchableOpacity onPress={onMenuPress}>
                <Ionicons name="menu" size={24} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.title}>DuckChat</Text>
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

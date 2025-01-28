import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons"; // Biblioteca de ícones

interface IHeaderProps {
    title: string;
}

interface IMenuProps {
    icon: string;
    name: string;
}

const Header:React.FC<IHeaderProps> = ({title}) => {
    const menuItems:IMenuProps[] = [
        { icon: "home", name: "Criar Sala" },
        { icon: "chatbox", name: "Salas" },
        { icon: "person", name: "Profile" },
    ]

    const onMenuPress = () => {
        
    }

    const onLogoutPress = () => {
        console.log("Logout Pressed");
    }

    return (
        <View style={styles.header}>
            <TouchableOpacity onPress={onMenuPress}>
                <Ionicons name="menu" size={24} color="#fff" />
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

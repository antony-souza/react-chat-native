import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome5";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";

interface IHeaderProps {
    title: string;
    subTitleInformation?: boolean;
    group?: boolean;
    onInformationPress?: () => void;
    arrowBackFunction?: () => void;
}

const Header: React.FC<IHeaderProps> = ({ title, subTitleInformation, group, arrowBackFunction, onInformationPress }) => {
    const router = useRouter();

    const onLogoutPress = async () => {
        await SecureStore.deleteItemAsync("userId");
        router.push("/");
    };

    const handleBackPage = () => {
        if (arrowBackFunction) {
            arrowBackFunction();
        } else {
            router.back();
        }
    };

    return (
        <View style={styles.header}>
            <TouchableOpacity onPress={handleBackPage}>
                <Icon name="arrow-left" size={24} color="#fff" />
            </TouchableOpacity>

            {group ? (
                <TouchableOpacity style={styles.textContainer} onPress={onInformationPress}>
                    <Text style={styles.title}>{title}</Text>
                    {subTitleInformation && <Text style={styles.subTitle}>Informações</Text>}
                </TouchableOpacity>
            ) : (
                <View style={styles.textContainer}>
                    <Text style={styles.title}>{title}</Text>
                </View>
            )}

            <TouchableOpacity onPress={onLogoutPress}>
                <Icon name="sign-out-alt" size={24} color="#fff" />
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
    textContainer: {
        alignItems: "center",
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#fff",
    },
    subTitle: {
        fontSize: 12,
        color: "#fff",
        marginTop: -3,
    },
});

export default Header;

import React, { useState } from "react";
import { Text, View, TouchableOpacity, TextInput, StyleSheet, Image, ActivityIndicator, Alert } from "react-native";
import LayoutPage from "../../layouts/dark-layout";
import * as ImagePicker from "expo-image-picker";
import { httpClient } from "../../utils/generic-request";
import { environment } from "../environment/environment";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";

const PutUser = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [profileImage, setProfileImage] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    
    const router = useRouter();
    const title = "Alterar Informações";

    const updateUser = async () => {
        setLoading(true);

        try {
            const formData = new FormData();
            const userId = await SecureStore.getItemAsync("userId") as string
            formData.append("_id", userId);
            if (name.trim()) formData.append("name", name);
            if (email.trim()) formData.append("email", email);
            if (password.trim()) formData.append("password", password);

            if (profileImage) {
                const uriParts = profileImage.split(".");
                const fileType = uriParts[uriParts.length - 1];
                formData.append("imgUrl", {
                    uri: profileImage,
                    name: `profile.${fileType}`,
                    type: `image/${fileType}`,
                } as any);
            }

            const update = await httpClient.genericRequest(`${environment.putUser}`, "PUT", formData);
            
            if (update.statusCode >= 400) {
                throw new Error("Falha ao atualizar usuário.");
            }

            Alert.alert("Usuário atualizado com sucesso.");
            router.push("/config");
        } catch (error) {
            Alert.alert("Erro", "Falha ao atualizar usuário.");
        } finally {
            setLoading(false);
        }
    };

    const handlePickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
            alert("É necessário conceder permissão para acessar a galeria de imagens.");
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            quality: 1,
        });

        if (!result.canceled) {
            setProfileImage(result.assets[0].uri);
        }
    };

    return (
        <LayoutPage headerTitle={title}>
            <View style={styles.container}>
                <TouchableOpacity style={styles.imagePicker} onPress={handlePickImage}>
                    {profileImage ? (
                        <Image source={{ uri: profileImage }} style={styles.imagePreview} />
                    ) : (
                        <Text style={styles.imagePickerText}>Selecione uma imagem</Text>
                    )}
                </TouchableOpacity>
                <TextInput
                    style={styles.input}
                    placeholder="Nome"
                    value={name}
                    onChangeText={setName}
                    placeholderTextColor="#ccc"
                />
                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    value={email}
                    onChangeText={setEmail}
                    placeholderTextColor="#ccc"
                />
                <TextInput
                    style={styles.input}
                    placeholder="Senha"
                    value={password}
                    secureTextEntry
                    onChangeText={setPassword}
                    placeholderTextColor="#ccc"
                />
                <TouchableOpacity
                    style={[styles.button, (name || email || password || profileImage) ? {} : styles.buttonDisabled]}
                    onPress={updateUser}
                    disabled={!name && !email && !password && !profileImage}
                >
                    {loading ? (
                        <ActivityIndicator size="small" color="#fff" />
                    ) : (
                        <Text style={styles.buttonText}>Salvar</Text>
                    )}
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.button, { backgroundColor: "red" }]}
                    onPress={() => router.push("/config")}
                >
                    <Text style={styles.buttonText}>Cancelar</Text>
                </TouchableOpacity>
            </View>
        </LayoutPage>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        marginTop: 16,
        gap: 16,
    },
    input: {
        backgroundColor: "#1E1E1E",
        color: "#fff",
        borderRadius: 8,
        padding: 12,
        marginBottom: 8,
    },
    imagePicker: {
        backgroundColor: "#1E1E1E",
        borderRadius: 8,
        padding: 12,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 16,
    },
    imagePickerText: {
        color: "#ccc",
    },
    imagePreview: {
        width: 100,
        height: 100,
        borderRadius: 8,
    },
    button: {
        backgroundColor: "#6200EE",
        padding: 12,
        borderRadius: 8,
        alignItems: "center",
    },
    buttonDisabled: {
        backgroundColor: "#888",
    },
    buttonText: {
        color: "#fff",
        fontWeight: "bold",
    },
});

export default PutUser;

import React, { useState } from "react";
import { Text, View, TouchableOpacity, TextInput, StyleSheet, Image, ActivityIndicator } from "react-native";
import LayoutPage from "../../layouts/dark-layout";
import Header from "../../components/header";
import { Controller, useForm } from "react-hook-form";
import * as ImagePicker from "expo-image-picker";
import { httpClient } from "../../utils/generic-request";
import { environment } from "../environment/environment";
import { useRouter } from "expo-router";

interface INewRoom {
    name: string;
    imgUrl: string;
}

const NewRoom = () => {
    const [loading, setLoading] = useState(false);
    const { control, handleSubmit, setValue, watch, formState: { isValid } } = useForm<INewRoom>();
    const [profileImage, setProfileImage] = useState<string | null>(null);

    const title = "Nova Sala";
    const imgUrl = watch("imgUrl");
    const router = useRouter()

    const handleCreateRoom = async (data: INewRoom) => {
        setLoading(true);

        try {
            const formData = new FormData();
            formData.append("name", data.name);

            if (profileImage) {
                const uri = profileImage;
                const uriParts = uri.split('.');
                const fileType = uriParts[uriParts.length - 1];

                formData.append('imgUrl', {
                    uri,
                    name: `chat.${fileType}`,
                    type: `image/${fileType}`,
                } as any);
            }

            const createRoom = await httpClient.genericRequest(environment.createRoom, "POST", formData);
            console.log(createRoom);
            if (createRoom.statusCode === 400 || createRoom.statusCode === 500 || createRoom.statusCode === 501 || createRoom.statusCode === 404) {
                setLoading(false);
                alert("Falha ao criar sala.");
                return;
            }

            setLoading(false);
            alert("Sala criada com sucesso.");
            router.push("/rooms");

        } catch (error) {
            console.error("Erro ao criar sala:", error);
            alert("Falha ao criar sala.");
        }

    };

    const handleCancel = () => {
        router.push("/rooms");
    }

    const handlePickImage = async () => {

        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            alert('É necessário conceder permissão para acessar a galeria de imagens.');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            quality: 1,
        });

        if (!result.canceled) {
            setProfileImage(result.assets[0].uri);
            setValue('imgUrl', result.assets[0].uri);
        }
    };

    return (
        <LayoutPage headerTitle={title}>
            <View style={styles.container}>
                <Controller
                    control={control}
                    name="imgUrl"
                    rules={{ required: "Imagem é obrigatória." }}
                    render={() => (
                        <TouchableOpacity style={styles.imagePicker} onPress={handlePickImage}>
                            {imgUrl ? (
                                <Image source={{ uri: imgUrl }} style={styles.imagePreview} />
                            ) : (
                                <Text style={styles.imagePickerText}>Selecione uma imagem</Text>
                            )}
                        </TouchableOpacity>
                    )}
                />
                <Controller
                    control={control}
                    name="name"
                    rules={{ required: "Nome da sala é obrigatório." }}
                    render={({ field: { onChange, value }, fieldState: { error } }) => (
                        <TextInput
                            style={[styles.input, error ? styles.inputError : {}]}
                            placeholder="Nome da Sala"
                            value={value}
                            onChangeText={onChange}
                            placeholderTextColor="#ccc"
                        />
                    )}
                />
                <TouchableOpacity
                    style={[styles.button, !isValid ? { backgroundColor: "#888" } : {}]}
                    onPress={handleSubmit(handleCreateRoom)}
                    disabled={!isValid || loading}
                >
                    {loading ? (
                        <ActivityIndicator size="small" color="#fff" />
                    ) : (
                        <Text style={styles.buttonText}>Criar Sala</Text>
                    )}
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.button, { backgroundColor: "red" }]}
                    onPress={handleCancel}
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
    inputError: {
        borderColor: "red",
        borderWidth: 1,
    },
    errorText: {
        color: "red",
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
    buttonText: {
        color: "#fff",
        fontWeight: "bold",
    },
});

export default NewRoom;

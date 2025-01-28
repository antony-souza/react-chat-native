import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View, ActivityIndicator, Linking } from "react-native";
import { Controller, useForm } from "react-hook-form";
import Icon from 'react-native-vector-icons/FontAwesome5';
import { Link, useRouter } from "expo-router";
import { httpClient } from "../../utils/generic-request";
import { InputCase } from "../../components/input";
import * as SecureStore from "expo-secure-store";
import { environment } from "../environment/environment";

interface IAuth {
    email: string;
    password: string;
}

interface IResponseAuth {
    id: string;
    name: string;
    userImg: string;
    status: number;
}

export default function AuthPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const linkedCreateAccount = () => {
        Linking.openURL(environment.webCreateAccount);
    }

    const { control, handleSubmit, formState: { isValid } } = useForm<IAuth>({
        mode: "onChange"
    });

    const onSubmit = async (data: IAuth) => {
        setLoading(true);
        try {
            const response = await httpClient.genericRequest(environment.auth, "POST", data) as IResponseAuth;

            if (response) {
                await SecureStore.setItemAsync("userId", response.id);

                router.push("/rooms");
            }
        } catch (error) {
            console.error("Erro ao autenticar:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Icon
                name="user-friends"
                size={80}
                color="#6200EE"
                style={styles.icon}
            />

            <Controller
                control={control}
                name="email"
                rules={{
                    required: "Email é obrigatório",
                    pattern: {
                        value: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/,
                        message: "Email inválido"
                    }
                }}
                render={({ field: { onChange, value } }) => (
                    <InputCase
                        icon="envelope"
                        placeholder="Email"
                        value={value}
                        onChange={onChange}
                        keyboardType="email-address"
                    />
                )}
            />

            <Controller
                control={control}
                name="password"
                rules={{
                    required: "Senha é obrigatória",
                    minLength: {
                        value: 6,
                        message: "Senha deve ter no mínimo 6 caracteres"
                    }
                }}
                render={({ field: { onChange, value } }) => (
                    <InputCase
                        icon="lock"
                        placeholder="Senha"
                        value={value}
                        onChange={onChange}
                        secureTextEntry
                    />
                )}
            />

            <TouchableOpacity
                style={[styles.button, !isValid ? { backgroundColor: "#888" } : {}]}
                onPress={handleSubmit(onSubmit)}
                disabled={!isValid || loading}
            >
                {loading ? (
                    <ActivityIndicator size="small" color="#fff" />
                ) : (
                    <Text style={styles.buttonText}>Entrar</Text>
                )}
            </TouchableOpacity>

            <View style={styles.linksContainer}>
                <TouchableOpacity onPress={linkedCreateAccount}>
                    <Text style={styles.link}>Criar conta</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#121212",
        padding: 20,
    },
    icon: {
        marginBottom: 20,
    },
    button: {
        width: "100%",
        backgroundColor: "#6200EE",
        padding: 15,
        borderRadius: 8,
        alignItems: "center",
        marginTop: 10,
    },
    buttonText: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "bold",
    },
    linksContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%",
        marginTop: 20,
    },
    link: {
        color: "#BB86FC",
        fontSize: 14,
    },
});

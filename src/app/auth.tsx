import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View, ActivityIndicator } from "react-native";
import { Controller, useForm } from "react-hook-form";
import Icon from 'react-native-vector-icons/FontAwesome5';
import { environment } from "../../environment";
import { Link, useRouter } from "expo-router";
import { httpClient } from "../../utils/generic-request";
import { InputCase } from "../../components/input";
import AsyncStorage from '@react-native-async-storage/async-storage';

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

    const { control, handleSubmit, formState: { isValid } } = useForm<IAuth>({
        mode: "onChange"
    });

    const onSubmit = async (data: IAuth) => {
        setLoading(true); 
        try {
            const response = await httpClient.genericRequest(environment.auth, "POST", data) as IResponseAuth;
    
            if (response) {
                if (response.userImg) {
                    await AsyncStorage.setItem("userImg", response.userImg);
                }
    
                if (response.id) {
                    await AsyncStorage.setItem("userId", response.id);
                }
    
                if (response.name) {
                    await AsyncStorage.setItem("userName", response.name);
                }
    
                router.push("/rooms");
            }
        } catch (error) {
            
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.logoContainer}>
            <Icon
                name="mug-hot"
                size={60}
                color="white"
                style={{ marginBottom: 20 }}
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
                <Link 
                    href={"/recovery"} 
                    style={styles.link}
                >Esqueceu a senha?</Link>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    logoContainer: {
        flex: 1,
        backgroundColor: "#121212",
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
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
        justifyContent: "flex-end",
        width: "100%",
        marginTop: 20,
    },
    link: {
        color: "#BB86FC",
        fontSize: 14,
    },
});

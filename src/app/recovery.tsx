import React from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { Control, Controller, useForm } from "react-hook-form";
import Icon from 'react-native-vector-icons/FontAwesome5';
import { environment } from "../../environment/environment";
import { Link } from "expo-router";
import { httpClient } from "../../utils/generic-request";
import { InputCase } from "../../components/input";

interface IAuth {
    email: string;
    password: string;
}

export default function RecoveryPassword() {

    const { control, handleSubmit, formState: { isValid } } = useForm<IAuth>({
        mode: "onChange"
    });

    const onSubmit = async (data: IAuth) => {
        return await httpClient.genericRequest(environment.auth, "POST", data);
    };


    return (
        <View style={styles.logoContainer}>
            <Icon
                name="lock"
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
                        placeholder="Digite o email de recuperação"
                        value={value}
                        onChange={onChange}
                        keyboardType="email-address"
                    />
                )}
            />
            <TouchableOpacity
                style={[styles.button, !isValid ? { backgroundColor: "#888" } : {}]}
                onPress={handleSubmit(onSubmit)}
                disabled={!isValid}
            >
                <Text style={styles.buttonText}>Enviar</Text>
            </TouchableOpacity>
            <View style={styles.button}>
                <Link href={"/"} style={styles.buttonText}>Voltar</Link>
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
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#1E1E1E",
        borderRadius: 8,
        marginBottom: 10,
        paddingHorizontal: 10,
    },
    inputIcon: {
        marginRight: 10,
        fontSize: 20,
        color: "#888",
    },
    input: {
        flex: 1,
        color: "#fff",
        padding: 15,
        fontSize: 16,
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

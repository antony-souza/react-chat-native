import React from "react";
import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { Control, Controller, useForm } from "react-hook-form";
import Icon from 'react-native-vector-icons/FontAwesome5';

export function AuthPage() {
    const { control, handleSubmit } = useForm();

    const onSubmit = (data: any) => {
        console.log(data);
    };
    
    return (
    
        <View style={styles.container}>
            <Icon 
                name="mug-hot" 
                size={60}
                color="white"
                style={{ marginBottom: 20 }}
            />

            <Controller
                control={control}
                name="email"
                rules={{ required: "Email é obrigatório" }}
                render={({ field: { onChange, value } }) => (
                    <TextInput
                        style={styles.input}
                        placeholder="Email"
                        placeholderTextColor="#888"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        onChangeText={onChange}
                        value={value}
                    />
                )}
            />

            <Controller
                control={control}
                name="password"
                rules={{ required: "Senha é obrigatória" }}
                render={({ field: { onChange, value } }) => (
                    <TextInput
                        style={styles.input}
                        placeholder="Senha"
                        placeholderTextColor="#888"
                        secureTextEntry
                        autoCapitalize="none"
                        onChangeText={onChange}
                        value={value}
                    />
                )}
            />

            <TouchableOpacity style={styles.button} onPress={handleSubmit(onSubmit)}>
                <Text style={styles.buttonText}>Entrar</Text>
            </TouchableOpacity>

            <View style={styles.linksContainer}>
                <TouchableOpacity>
                    <Text style={styles.link}>Esqueceu a senha?</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#121212",
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    title: {
        fontSize: 32,
        color: "#fff",
        fontWeight: "bold",
        marginBottom: 30,
    },
    input: {
        width: "100%",
        backgroundColor: "#1E1E1E",
        color: "#fff",
        borderRadius: 8,
        padding: 15,
        marginBottom: 10,
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

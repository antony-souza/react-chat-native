import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Image,
    ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Controller, useForm } from 'react-hook-form';
import * as ImagePicker from 'expo-image-picker';
import * as SecureStore from "expo-secure-store";

import { httpClient } from '../../utils/generic-request';
import { environment } from '../environment/environment';
import LayoutPage from '../../layouts/dark-layout';
import { InputCase } from '../../components/input';

interface ICreateAccount {
    name: string;
    email: string;
    password: string;
    imgUrl: string;
}

const CreateAccountPage: React.FC = () => {
    const router = useRouter();
    const { control, handleSubmit, setValue, formState: { isValid } } = useForm<ICreateAccount>();
    const [profileImage, setProfileImage] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const handleCreateAccount = async (data: ICreateAccount) => {
        setLoading(true);
        const formData = new FormData();

        formData.append('name', data.name);
        formData.append('email', data.email);
        formData.append('password', data.password);

        if (profileImage) {
            const uri = profileImage;
            const uriParts = uri.split('.');
            const fileType = uriParts[uriParts.length - 1];

            formData.append('imgUrl', {
                uri,
                name: `profile.${fileType}`,
                type: `image/${fileType}`,
            } as any);
        }
        const response = await httpClient.genericRequest(environment.createUser, 'POST', formData);
        console.log(response);
        if (response.statusCode === 400 || response.statusCode === 500) {
            alert(response.message);
            setLoading(false);
            return;
        }
        alert('Conta criada com sucesso!');
        setLoading(false);

        await Promise.all([
            SecureStore.deleteItemAsync('userId'),
            SecureStore.deleteItemAsync('userName'),
            SecureStore.deleteItemAsync('userImg'),
        ]);

        router.push('/auth');
    };

    const handleGoBack = () => {
        router.push('/auth');
    };

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
        <LayoutPage>
            <View style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color="#fff" />
                    </TouchableOpacity>
                    <Text style={styles.title}>Criar Conta</Text>
                    <Text>{''}</Text>
                </View>
                <View style={styles.formContainer}>
                    <Controller
                        control={control}
                        name="imgUrl"
                        defaultValue=""
                        rules={{ required: 'Foto de perfil é obrigatória' }}
                        render={({ field: { value } }) => (
                            <View style={styles.imagePickerContainer}>
                                {profileImage && (
                                    <Image source={{ uri: profileImage }} style={styles.profileImage} />
                                )}
                                <TouchableOpacity onPress={handlePickImage} style={styles.imagePickerButton}>
                                    <Text style={styles.imagePickerText}>Selecionar Foto de Perfil</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    />
                    <Controller
                        control={control}
                        name="name"
                        defaultValue=""
                        rules={{ required: 'Nome é obrigatório' }}
                        render={({ field: { onChange, value } }) => (
                            <InputCase
                                icon="user"
                                placeholder="Nome de usuário"
                                value={value}
                                onChange={onChange}
                            />
                        )}
                    />
                    <Controller
                        control={control}
                        name="email"
                        defaultValue=""
                        rules={{
                            required: 'Email é obrigatório',
                            pattern: {
                                value: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/,
                                message: 'Email inválido',
                            },
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
                        defaultValue=""
                        rules={{
                            required: 'Senha é obrigatória',
                            minLength: {
                                value: 6,
                                message: 'Senha deve ter no mínimo 6 caracteres',
                            },
                        }}
                        render={({ field: { onChange, value } }) => (
                            <InputCase
                                icon="lock"
                                placeholder="Senha - Senha deve ter no mínimo 6 caracteres"
                                value={value}
                                onChange={onChange}
                                secureTextEntry
                            />
                        )}
                    />
                    <TouchableOpacity
                        onPress={handleSubmit(handleCreateAccount)}
                        style={[styles.createButton, !isValid ? { backgroundColor: "#888" } : {}]}
                        disabled={!isValid || loading }
                    >
                        {loading ? <ActivityIndicator size="small" color="#fff" /> :
                            <Text style={styles.createButtonText}>Criar Conta</Text>
                        }
                    </TouchableOpacity>
                </View>
            </View>
        </LayoutPage>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    backButton: {
        marginRight: 10,
    },
    title: {
        color: '#fff',
        fontSize: 24,
        fontWeight: 'bold',
    },
    formContainer: {
        backgroundColor: '#333',
        padding: 20,
        borderRadius: 10,
    },
    createButton: {
        backgroundColor: '#6200EE',
        paddingVertical: 15,
        borderRadius: 8,
        alignItems: 'center',
    },
    createButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    imagePickerContainer: {
        marginBottom: 15,
        alignItems: 'center',
    },
    imagePickerButton: {
        backgroundColor: '#444',
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 8,
    },
    imagePickerText: {
        color: '#fff',
        fontSize: 14,
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 10,
    },
});

export default CreateAccountPage;

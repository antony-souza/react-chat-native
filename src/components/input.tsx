import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

interface InputProps {
    icon: string;
    placeholder: string;
    value: string;
    onChangeText: (text: string) => void;
    secureTextEntry?: boolean;
}

const Input: React.FC<InputProps> = ({ icon, placeholder, value, onChangeText, secureTextEntry }) => {
    return (
        <View style={styles.container}>
            <Icon name={icon} size={20} style={styles.icon} />
            <TextInput
                style={styles.input}
                placeholder={placeholder}
                value={value}
                onChangeText={onChangeText}
                secureTextEntry={secureTextEntry}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ccc',    
        borderRadius: 5,
        padding: 10,
        marginVertical: 10,
    },
    icon: {
        marginRight: 10,
    },
    input: {
        flex: 1,
    },
});

export default Input;
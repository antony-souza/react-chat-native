import React from "react";
import { StyleSheet, TextInput, View } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome5";

interface CustomInputProps {
  icon: string;
  placeholder: string;
  value: string;
  onChange: (text: string) => void;
  keyboardType?: "default" | "email-address" | "numeric";
  secureTextEntry?: boolean;
  placeholderTextColor?: string;
}

export const InputCase: React.FC<CustomInputProps> = ({
  icon,
  placeholder,
  value,
  onChange,
  keyboardType = "default",
  secureTextEntry = false,
  placeholderTextColor = "#888",
}) => {
  return (
    <View style={styles.inputContainer}>
      <Icon name={icon} style={styles.inputIcon} />
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor={placeholderTextColor}
        keyboardType={keyboardType}
        secureTextEntry={secureTextEntry}
        autoCapitalize="none"
        onChangeText={onChange}
        value={value}
      />
    </View>
  );
};

const styles = StyleSheet.create({
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
});

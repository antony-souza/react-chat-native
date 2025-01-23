import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Control, Controller, useForm } from "react-hook-form";
import Icon from "react-native-vector-icons/FontAwesome5";
import { environment } from "../../environment/environment";
import { httpClient } from "../../utils/generic-request";
import { InputCase } from "../../components/input";
import { Link } from "expo-router";

interface IAuth {
  email: string;
  code: string;
  password: string;
}

export default function RecoveryPassword() {
  const [step, setStep] = useState(1); 
  const { control, handleSubmit, formState: { isValid } } = useForm<IAuth>({ mode: "onChange" });

  const handleEmailSubmit = async (data: { email: string }) => {
    /* await httpClient.genericRequest(`${environment.auth}/send-code`, "POST", { email: data.email }); */
    setStep(2); 
  };

  const handleCodeSubmit = async (data: { code: string }) => {
    /* await httpClient.genericRequest(`${environment.auth}/verify-code`, "POST", { code: data.code }); */
    setStep(3);
  };

  const handlePasswordSubmit = async (data: { password: string }) => {
    /* await httpClient.genericRequest(`${environment.auth}/update-password`, "POST", { password: data.password }); */
    alert("Senha atualizada com sucesso!");
  };

  return (
    <View style={styles.container}>
      <Icon name="lock" size={60} color="white" style={{ marginBottom: 20 }} />

      {step === 1 && (
        <Controller
          control={control}
          name="email"
          rules={{
            required: "Email é obrigatório",
            pattern: {
              value: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/,
              message: "Email inválido",
            },
          }}
          render={({ field: { onChange, value } }) => (
            <InputCase
              icon="envelope"
              placeholder="Digite seu email"
              value={value}
              onChange={onChange}
              keyboardType="email-address"
              />
          )}
        />
      )}

      {step === 2 && (
        <Controller
          control={control}
          name="code"
          rules={{ required: "Código é obrigatório" }}
          render={({ field: { onChange, value } }) => (
            <InputCase
              icon="key"
              placeholder="Digite o código de verificação"
              value={value}
              onChange={onChange}
              keyboardType="numeric"
            />
          )}
        />
      )}

      {step === 3 && (
        <Controller
          control={control}
          name="password"
          rules={{
            required: "Senha é obrigatória",
            minLength: { value: 6, message: "Senha deve ter pelo menos 6 caracteres" },
          }}
          render={({ field: { onChange, value } }) => (
            <InputCase
              icon="lock"
              placeholder="Digite sua nova senha"
              value={value}
              onChange={onChange}
              secureTextEntry
            />
          )}
        />
      )}

      <TouchableOpacity
        style={[styles.button, !isValid ? { backgroundColor: "#888" } : {}]}
        onPress={handleSubmit(
          step === 1
            ? handleEmailSubmit
            : step === 2
            ? handleCodeSubmit
            : handlePasswordSubmit
        )}
        disabled={!isValid}
      >
        <Text style={styles.buttonText}>{step === 3 ? "Atualizar Senha" : "Avançar"}</Text>
      </TouchableOpacity>

      {step > 1 && (
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => setStep(step - 1)}
        >
          <Text style={styles.backButtonText}>Voltar</Text>
        </TouchableOpacity>
      )}
      {
        step === 1 && (
          <View style={styles.backButton}>
            <Link href={"/"} style={styles.backButtonText}>Voltar para o login</Link>
          </View>
        )
      }
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
  backButton: {
    marginTop: 10,
    padding: 10,
    alignItems: "center",
  },
  backButtonText: {
    color: "#BB86FC",
    fontSize: 16,
  },
});

import { useState } from "react";
import { Button, SafeAreaView, Text, TextInput, Alert } from "react-native";

import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system/legacy";

export default function App() {
  const [estado, setEstado] = useState("Desconectado");
  const [ip, setIp] = useState("10.56.2.8"); // IP ACTUAL DE LA PC

  const enviarImagen = async () => {
    const permiso = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permiso.granted) {
      Alert.alert("Permiso denegado");
      return;
    }

    const resultado = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      quality: 1,
    });

    if (resultado.canceled) {
      return;
    }

    const imagen = resultado.assets[0];

    setEstado("Conectando...");

    const ws = new WebSocket(`ws://${ip}:8080`);

    ws.onopen = async () => {
      console.log("Conectado");

      setEstado("Enviando imagen...");

      try {
        const base64 = await FileSystem.readAsStringAsync(imagen.uri, {
          encoding: "base64",
        });

        console.log("Enviando imagen:", imagen.fileName);
        console.log("Base64 tamaño:", base64.length);

        ws.send(
          JSON.stringify({
            type: "file",
            name: imagen.fileName || "foto.jpg",
            data: base64,
          }),
        );
      } catch (error) {
        console.log(error);

        Alert.alert("Error leyendo imagen");

        setEstado("Error");
      }
    };

    ws.onmessage = (event) => {
      console.log("Servidor:", event.data);

      Alert.alert("Éxito", event.data);

      setEstado("Imagen enviada");

      ws.close();
    };

    ws.onerror = (error) => {
      console.log("Error WS:", error);

      Alert.alert("Error de conexión");

      setEstado("Error");
    };

    ws.onclose = () => {
      console.log("WebSocket cerrado");
    };
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        gap: 20,
        padding: 20,
      }}
    >
      <Text>{estado}</Text>

      <TextInput
        value={ip}
        onChangeText={setIp}
        placeholder="IP de la PC"
        style={{
          borderWidth: 1,
          width: 250,
          padding: 10,
          borderRadius: 10,
        }}
      />

      <Button title="Seleccionar foto y enviar" onPress={enviarImagen} />
    </SafeAreaView>
  );
}

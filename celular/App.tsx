import { useState } from "react";
import { Button, SafeAreaView, Text } from "react-native";

export default function App() {
  const [estado, setEstado] = useState("Desconectado");

  const conectar = () => {
    const ws = new WebSocket("ws://10.56.2.38:8080");

    ws.onopen = () => {
      console.log("Conectado");
      setEstado("Conectado a la PC");

      ws.send(
        JSON.stringify({
          type: "hello",
          device: "iPhone 13 Pro",
        }),
      );
    };

    ws.onmessage = (event) => {
      console.log("Servidor:", event.data);
    };

    ws.onerror = (error) => {
      console.log(error);
      setEstado("Error");
    };

    ws.onclose = () => {
      setEstado("Desconectado");
    };
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>{estado}</Text>

      <Button title="Conectar a PC" onPress={conectar} />
    </SafeAreaView>
  );
}

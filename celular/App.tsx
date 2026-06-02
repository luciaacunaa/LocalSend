import { useState } from "react";
import { Button, SafeAreaView, Text } from "react-native";

export default function App() {
  const [estado, setEstado] = useState("Desconectado");
  const [socket, setSocket] = useState<WebSocket | null>(null);

  const conectar = () => {
    const ws = new WebSocket("ws://10.56.2.28:8080");

    ws.onopen = () => {
      console.log("Conectado");
      setEstado("Conectado a la PC");

      setSocket(ws);

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
      setSocket(null);
    };
  };

  const enviarArchivo = () => {
    if (!socket) {
      console.log("No hay conexión");
      return;
    }

    socket.send(
      JSON.stringify({
        type: "file-offer",
        name: "foto.jpg",
        size: 123456,
      }),
    );
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

      <Button title="Enviar archivo" onPress={enviarArchivo} />
    </SafeAreaView>
  );
}
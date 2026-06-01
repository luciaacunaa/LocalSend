export function connectToDesktop() {
  const ws = new WebSocket("ws://10.56.2.38:8080");

  ws.onopen = () => {
    console.log("Conectado a la PC");

    ws.send(
      JSON.stringify({
        type: "hello",
        device: "iPhone",
      }),
    );
  };

  ws.onmessage = (event) => {
    console.log("Servidor:", event.data);
  };

  ws.onerror = (error) => {
    console.log("Error:", error);
  };

  ws.onclose = () => {
    console.log("Desconectado");
  };

  return ws;
}

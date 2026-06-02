const { WebSocketServer } = require("ws");

let wss;

function startWebSocketServer() {
  wss = new WebSocketServer({
    port: 8080,
  });

  console.log("WebSocket escuchando en puerto 8080");

  wss.on("connection", (ws, req) => {
    console.log("Cliente conectado:", req.socket.remoteAddress);

   ws.on("message", (message) => {
  const data = JSON.parse(message.toString());

  if (data.type === "hello") {
    console.log("Dispositivo:", data.device);
  }

  if (data.type === "file-offer") {
    console.log("Archivo ofrecido:");
    console.log("Nombre:", data.name);
    console.log("Tamaño:", data.size);

    ws.send(
      JSON.stringify({
        type: "accepted",
      }),
    );
  }
});

    ws.send("Conectado al servidor");
  });
}

module.exports = {
  startWebSocketServer,
};

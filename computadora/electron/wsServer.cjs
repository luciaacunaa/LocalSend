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
      console.log("Mensaje recibido:", message.toString());
    });

    ws.send("Conectado al servidor");
  });
}

module.exports = {
  startWebSocketServer,
};

const { WebSocketServer } = require("ws");
const fs = require("fs");
const path = require("path");

function startWebSocketServer() {
  const wss = new WebSocketServer({
    port: 8080,
  });

  console.log("WebSocket escuchando en puerto 8080");

  wss.on("connection", (ws, req) => {
    console.log("Cliente conectado:", req.socket.remoteAddress);

    ws.on("message", (message) => {
      const data = JSON.parse(message.toString());

      if (data.type === "file") {
        console.log("Recibiendo:", data.name);

        const carpeta = path.join(process.cwd(), "archivos_recibidos");

        if (!fs.existsSync(carpeta)) {
          fs.mkdirSync(carpeta);
        }

        const ruta = path.join(carpeta, data.name);

        fs.writeFileSync(ruta, Buffer.from(data.data, "base64"));

        console.log("Guardado en:", ruta);

        ws.send(`Archivo guardado: ${data.name}`);
      }
    });
  });
}

module.exports = {
  startWebSocketServer,
};

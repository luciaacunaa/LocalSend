const dgram = require("dgram");

const PORT = 53317;

const server = dgram.createSocket("udp4");

server.on("listening", () => {
  const address = server.address();

  console.log(`UDP escuchando en ${address.address}:${address.port}`);
});

server.on("message", (msg, remote) => {
  console.log(`Mensaje recibido de ${remote.address}`);

  console.log(msg.toString());
});

function startUDPServer() {
  server.bind(PORT);
}

module.exports = {
  startUDPServer,
};

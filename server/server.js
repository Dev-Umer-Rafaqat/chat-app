const http = require("http");
const app = require("./app");
const connectDB = require("./config/db");
const attachWebSocketServer = require("./websocket/websocket.server");
const { PORT } = require("./config/env");

async function startServer() {
  await connectDB();

  const httpServer = http.createServer(app);
  attachWebSocketServer(httpServer);

  httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();

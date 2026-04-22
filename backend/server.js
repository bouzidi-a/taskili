require('dotenv').config();
const http       = require('http');
const { Server } = require('socket.io');
const app        = require('./src/app');
const connectDB  = require('./src/config/db');

const { PORT } = process.env;

const startServer = async () => {
  await connectDB();

  const server = http.createServer(app);

  const io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL || 'http://localhost:5173',
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  require('./src/config/socket')(io);

  server.listen(PORT, () => {
    console.log(` Server running on http://localhost:${PORT}`);
  });
};

startServer();
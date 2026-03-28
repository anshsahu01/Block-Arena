import "dotenv/config";
import http from "http";
import mongoose from "mongoose";
import { Server } from "socket.io";
import app from "./app.js";
import { connectDB } from "./config/db.js";
import { ensureGridSeeded } from "./services/block.service.js";
import { handleGridSocket } from "./sockets/grid.socket.js";
import { authenticateSocket } from "./middlewares/socket-auth.middleware.js";
import { assertRateLimiterReady, closeRedisConnection } from "./utils/rate-limit.js";

const server = http.createServer(app);

const allowedOrigins = [
  process.env.CLIENT_URL,
  ...(process.env.CORS_ORIGINS ? process.env.CORS_ORIGINS.split(",") : []),
]
  .map((origin) => origin?.trim())
  .filter(Boolean);

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

io.use(authenticateSocket);

io.on("connection", (socket) => {
  handleGridSocket(io, socket);
});

const PORT = process.env.PORT || 5000;
let isShuttingDown = false;

const gracefulShutdown = async () => {
  if (isShuttingDown) {
    console.log("[Server] Shutdown already in progress...");
    return;
  }

  isShuttingDown = true;
  console.log("\n[Server] Graceful shutdown initiated...");

  const forceShutdownTimer = setTimeout(() => {
    console.error("[Server] Forced shutdown after timeout");
    process.exit(1);
  }, 10000);

  try {
    io.close();

    await new Promise((resolve, reject) => {
      server.close((error) => {
        if (error) {
          reject(error);
          return;
        }

        resolve();
      });
    });

    await closeRedisConnection();
    await mongoose.connection.close(false);

    clearTimeout(forceShutdownTimer);
    console.log("[Server] Shutdown complete");
    process.exit(0);
  } catch (error) {
    clearTimeout(forceShutdownTimer);
    console.error("[Server] Shutdown error:", error.message);
    process.exit(1);
  }
};

process.on("SIGTERM", gracefulShutdown);
process.on("SIGINT", gracefulShutdown);

server.on("error", (error) => {
  if (error.code === "EADDRINUSE") {
    console.error(`[Server] Port ${PORT} is already in use. Update PORT in server/.env or stop the other process.`);
    process.exit(1);
  }

  console.error("[Server] Failed to start:", error.message);
  process.exit(1);
});

connectDB().then(async () => {
  await assertRateLimiterReady();
  await ensureGridSeeded();
  server.listen(PORT, () => {
    console.log(`[Server] Running on port ${PORT}`);
  });
});

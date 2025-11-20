import app from "./app.js";
import connectDb from "./config/db.js";
import { createServer } from "http";
import { Server } from "socket.io";
import { connectRedis } from "./config/redis.js";

const PORT = process.env.PORT || 5000;

// create HTTP server from express app
const httpServer = createServer(app);

// Initialize Socket.IO with CORS config
const io = new Server(httpServer, {
  cors: {
    origin: [process.env.CLIENT_URL!],
    credentials: true,
    methods: ["GET", "POST"],
  },
});

// Socket.IO connection handling
io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);
  // Handle disconnection
  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

// Start server
httpServer.listen(PORT, async () => {
  try {
    await connectDb();
    await connectRedis();
    console.log(`Server is running on port ${PORT}`);
    console.log(`Socket.IO is ready`);
  } catch (err) {
    console.error("Database connection failed:", err);
  }
});

export { io };

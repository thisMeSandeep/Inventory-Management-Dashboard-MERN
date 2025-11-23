import { io, Socket } from "socket.io-client";

// Remove /api/v1 from backend URL for Socket.IO connection
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL?.replace(/\/api\/v\d+$/, "") || "http://localhost:5000";

// Create socket instance with configuration
const socket: Socket = io(BACKEND_URL, {
  autoConnect: false,
  withCredentials: true,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  transports: ["websocket", "polling"],
});

// Connection event listeners for debugging
socket.on("connect", () => {
  console.log("Socket connected:", socket.id);
});

socket.on("disconnect", (reason) => {
  console.log("Socket disconnected:", reason);
});

socket.on("connect_error", (error) => {
  console.error(" Socket connection error:", error.message);
});

socket.on("reconnect", (attemptNumber) => {
  console.log("Socket reconnected after", attemptNumber, "attempts");
});

socket.on("reconnect_error", (error) => {
  console.error("Socket reconnection error:", error.message);
});

export default socket;

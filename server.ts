import express from "express";
import path from "path";
import http from "http";
import { Server } from "socket.io";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";

import userRoutes from "./server/routes/user.routes.js";
import bookingRoutes from "./server/routes/booking.routes.js";
import apiV1Routes from "./server/routes/index.js";

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"]
  }
});

const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Socket.IO Connection & Real-Time Handlers
io.on("connection", (socket) => {
  console.log(`Socket connected: ${socket.id}`);

  socket.on("join_room", (conversationId) => {
    socket.join(conversationId);
    console.log(`Socket ${socket.id} joined room: ${conversationId}`);
  });

  socket.on("message:send", (messageData) => {
    const { conversationId } = messageData;
    io.to(conversationId).emit("message:receive", messageData);
  });

  socket.on("message:typing", ({ conversationId, userId, userName }) => {
    socket.to(conversationId).emit("message:typing", { userId, userName });
  });

  socket.on("message:stopTyping", ({ conversationId, userId }) => {
    socket.to(conversationId).emit("message:stopTyping", { userId });
  });

  socket.on("message:read", ({ conversationId, messageId }) => {
    socket.to(conversationId).emit("message:read", { messageId });
  });

  socket.on("notification:new", (notification) => {
    io.emit("notification:new", notification);
  });

  socket.on("disconnect", () => {
    console.log(`Socket disconnected: ${socket.id}`);
  });
});

// API Routes
app.use("/api/v1", apiV1Routes);
app.use("/api/users", userRoutes);
app.use("/api/bookings", bookingRoutes);

// Connect to MongoDB Atlas (Gracefully handles missing connection string or placeholder during initial setup/preview)
const MONGODB_URI = process.env.MONGODB_URI || "";
if (MONGODB_URI && !MONGODB_URI.includes("username:password") && !MONGODB_URI.includes("cluster.mongodb.net")) {
  mongoose.connect(MONGODB_URI)
    .then(() => console.log("Connected to MongoDB Atlas successfully"))
    .catch((err) => console.error("MongoDB connection error:", err.message));
} else {
  console.log("MongoDB URI is a placeholder or not configured. Running in robust standalone mode.");
}

// API Health Check
app.get("/api/health", (req, res) => {
  res.json({ 
    status: "ok", 
    app: "KaamSathi API", 
    version: "1.0.0",
    database: mongoose.connection.readyState === 1 ? "connected" : "disconnected (setup mode)"
  });
});

// Sample API routes structure for KaamSathi
app.get("/api/workers", (req, res) => {
  // Mock worker list for initial preview and architecture testing
  const sampleWorkers = [
    {
      id: "w1",
      name: "Ramesh Kumar",
      category: "Electrician",
      rating: 4.8,
      reviewsCount: 124,
      hourlyRate: 250,
      location: "South Delhi, Delhi",
      experienceYears: 8,
      verified: true,
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
      bio: "Expert residential & commercial wiring, inverter repair, and appliance installation."
    },
    {
      id: "w2",
      name: "Suresh Sharma",
      category: "Plumber",
      rating: 4.9,
      reviewsCount: 98,
      hourlyRate: 300,
      location: "Connaught Place, Delhi",
      experienceYears: 10,
      verified: true,
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150",
      bio: "Specialized in pipe leakage fixing, bathroom fittings, water tank cleaning, and geyser installation."
    },
    {
      id: "w3",
      name: "Amit Verma",
      category: "Carpenter",
      rating: 4.7,
      reviewsCount: 76,
      hourlyRate: 350,
      location: "Noida Sector 62, UP",
      experienceYears: 6,
      verified: true,
      avatar: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150",
      bio: "Custom modular furniture design, door/window repairs, bed and wardrobe assembly."
    },
    {
      id: "w4",
      name: "Pooja Devi",
      category: "House Helper",
      rating: 4.9,
      reviewsCount: 210,
      hourlyRate: 200,
      location: "Gurugram Phase 4, Haryana",
      experienceYears: 5,
      verified: true,
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150",
      bio: "Deep home cleaning, dusting, kitchen sanitization, and laundry assistance."
    }
  ];
  res.json({ success: true, data: sampleWorkers });
});

app.get("/api/categories", (req, res) => {
  const categories = [
    { id: "electrician", name: "Electrician", icon: "Zap", count: 1420 },
    { id: "plumber", name: "Plumber", icon: "Wrench", count: 1280 },
    { id: "carpenter", name: "Carpenter", icon: "Hammer", count: 950 },
    { id: "painter", name: "Painter", icon: "Paintbrush", count: 820 },
    { id: "mason", name: "Mason", icon: "Home", count: 640 },
    { id: "cleaner", name: "Cleaner", icon: "Sparkles", count: 1850 },
    { id: "driver", name: "Driver", icon: "Car", count: 1120 },
    { id: "helper", name: "House Helper", icon: "Users", count: 2300 },
  ];
  res.json({ success: true, data: categories });
});

// Vite middleware setup for development / static serving for production
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*all', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  server.listen(PORT, "0.0.0.0", () => {
    console.log(`KaamSathi server running on port ${PORT}`);
  });
}

startServer();


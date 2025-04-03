import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.route.js";
import customTrainingsRoutes from "./routes/customTrainingsRoutes.route.js";
import trainingRecordRoutes from "./routes/trainingRecord.route.js";
import userRoutes from "./routes/user.route.js";
import feedbackRoutes from "./routes/feedback.route.js";
import feedRoutes from "./routes/feed.route.js";
import charRoomRoutes from "./routes/chatroom.route.js";
import planRoutes from "./routes/plan.route.js";
import exerciseRoutes from "./routes/exercise.route.js";
import trainingRoutes from "./routes/training.route.js";
import calendarRoutes from "./routes/calendar.route.js";
import foodRoutes from "./routes/food.route.js";
import cors from "cors";
import path from "path";
import http from "http";
import { connectDb } from "./libs/db.js";
import { connectDbMySql } from "./libs/mysqldb.js";
import { fileURLToPath } from "url";
import { Server } from "socket.io";
import Message from "./models/message.model.js";
import Room from "./models/room.model.js";
import e from "express";

// Tạo __filename và __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: "50mb" }));
app.use(
  cors({
    origin: ["http://localhost:8081", "http://localhost:3000"],
    credentials: true,
  })
);
// app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(cookieParser());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:8081", "http://localhost:3000"],
    credentials: true,
  },
});

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api/auth", authRoutes);
app.use("/api/customtrainings", customTrainingsRoutes);
app.use("/api/trainingrecord", trainingRecordRoutes);
app.use("/api/user", userRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use("/api/exercises", exerciseRoutes);
app.use("/api/feed", feedRoutes);
app.use("/api/chatroom", charRoomRoutes);
app.use("/api/plan", planRoutes);
app.use("/api/trainings", trainingRoutes);
app.use("/api/calendar", calendarRoutes);
app.use("/api/foods", foodRoutes);

let chatRooms = [];
export let userSockets = {};
io.on("connection", (socket) => {
  socket.on("register", (userId) => {
    userSockets[userId] = socket.id;
    console.log(`User ${userId} connected with socketId ${socket.id}`);
  });

  // socket.on("joinRoom", (roomId) => {
  //     socket.join(roomId);
  //     console.log(`User joined room: ${roomId}`);
  // });

  // socket.on("leaveRoom", (roomId) => {
  //     socket.leave(roomId);
  //     console.log(`User left room: ${roomId}`);
  // });

  socket.on("createPrivateRoom", ({ userId, userProfileId }) => {
    const roomId = [userId, userProfileId].sort().join("_");

    const existingRoom = chatRooms.find((room) => room._id === roomId);
    if (!existingRoom) {
      // Nếu chưa tồn tại, tạo mới phòng chat
      chatRooms.unshift({
        _id: roomId,
        roomType: "private",
        members: [userId, userProfileId],
        messages: [],
      });
    }

    socket.join(roomId);

    socket.emit("roomsList", chatRooms);
  });

  socket.on("sendMessage", async (message) => {
    const { roomId, sender, content } = message;

    const messageBeSent = await Message.findById(message._id).populate(
      "sender"
    );

    const room = await Room.findByIdAndUpdate(
      roomId,
      {
        lastMessage: {
          senderId: sender._id,
          content: content,
          createdAt: new Date(),
        },
      },
      { new: true }
    );
    const needToSend =
      room.members[0] == sender._id ? room.members[1] : room.members[0];

    if (userSockets[needToSend]) {
      io.to(userSockets[needToSend]).emit("newMessage", messageBeSent);
    }
  });

  socket.on("disconnect", (reason) => {
    for (let userId in userSockets) {
      if (userSockets[userId] === socket.id) {
        delete userSockets[userId];
        console.log(`User ${userId} disconnected`);
        break;
      }
    }
  });
});

server.listen(PORT, async () => {
  await connectDb();

  // await connectDbMySql();
  console.log(`Server is running on port ${PORT}`);
});

export default app;

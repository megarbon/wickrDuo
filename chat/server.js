const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const formatMessage = require("./utils/messages");
const createAdapter = require("@socket.io/redis-adapter").createAdapter;
const redis = require("redis");
require("dotenv").config();
const path = require("path");

const { createClient } = redis;
const {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers,
  getRoomMessages,
  addMessage,
  clearRoomMessages,
} = require("./utils/users");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Set static folder
app.use(express.static(path.join(__dirname, "public")));

// Function to format system messages
const systemMessage = (text) => formatMessage('System', text);

// Redis clients setup
const pubClient = createClient({ url: "redis://redis:6379" });
const subClient = pubClient.duplicate();

// Socket.io Redis adapter setup
(async () => {
  await pubClient.connect();
  io.adapter(createAdapter(pubClient, subClient));
})();

// Run when client connects
io.on("connection", (socket) => {
  console.log(io.of("/").adapter);
  
  // Join room event
  socket.on("joinRoom", ({ username, room }) => {
    const user = userJoin(socket.id, username, room);

    socket.join(user.room);

    // Welcome current user
    socket.emit("message", systemMessage("Welcome to the chat!"));

    // Send previous messages if public room
    if (user.roomType === 'public') {
      const messages = getRoomMessages(user.room);
      messages.forEach(message => {
        socket.emit("message", message);
      });
    }

    // Broadcast when a user connects (system message)
    socket.broadcast
      .to(user.room)
      .emit("message", systemMessage(`${user.username} has joined the chat`));

    // Send users and room info
    io.to(user.room).emit("roomUsers", {
      room: user.room,
      users: getRoomUsers(user.room),
    });
  });

  // Listen for chatMessage
  socket.on("chatMessage", (msg) => {
    const user = getCurrentUser(socket.id);

    const message = formatMessage(user.username, msg);
    io.to(user.room).emit("message", message);

    // Add message to room messages if public
    if (user.roomType === 'public') {
      addMessage(user.room, message);
    }
  });

  // Runs when client disconnects
  socket.on("disconnect", () => {
    const user = userLeave(socket.id);

    if (user) {
      io.to(user.room).emit(
        "message",
        systemMessage(`${user.username} has left the chat`)
      );

      // Send users and room info
      io.to(user.room).emit("roomUsers", {
        room: user.room,
        users: getRoomUsers(user.room),
      });

      // Clear room messages if private
      if (user.roomType === 'private') {
        clearRoomMessages(user.room);
      }
    }
  });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

const express = require("express");
const http = require("http");
const socketIO = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

// Serve static files from the "public" directory
app.use(express.static(__dirname + "/public"));

// Define a route for the root URL
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

const users = {}; // Object to store usernames associated with sockets


// Socket.IO connection handling
io.on("connection", (socket) => {
  console.log("A user connected");

  // Listen for messages from the client
  socket.on("chat message", (msg) => {
    // Broadcast the message to all connected clients
    io.emit("chat message", {
      message: msg.message,
      username: users[socket.id],
    });
  });

  // Listen for username submission
  socket.on("submit username", (username) => {
    users[socket.id] = username;
  });

  // Listen for disconnection
  socket.on("disconnect", () => {
    console.log("A user disconnected");
    delete users[socket.id]; // Remove user on disconnection
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

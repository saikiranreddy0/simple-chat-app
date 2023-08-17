const socket = io();

document.getElementById("form").addEventListener("submit", (e) => {
  e.preventDefault();
  const input = document.getElementById("input");
  const username = document.getElementById("username").value;
  const message = input.value;
  input.value = "";
  socket.emit("chat message", {message, username});
});

socket.on("chat message", (msg) => {
  const messages = document.getElementById("messages");
  const li = document.createElement("li");

  // Combine the username and message content
  li.textContent = `${msg.username}: ${msg.message}`;

  messages.appendChild(li);
});

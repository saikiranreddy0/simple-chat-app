const socket = io();
let username = ""; // Variable to store the entered username

// Display the login modal when the page loads
window.addEventListener("load", () => {
  const loginModal = document.getElementById("login-modal");
  loginModal.style.display = "block"; // Show the modal
});

// Function to handle joining the chat
function joinChat() {
  const usernameInput = document.getElementById("username-input-modal");
  username = usernameInput.value.trim();

  if (username === "") {
    alert("Please enter a valid username.");
    return;
  }

  // Hide the login modal
  document.getElementById("login-modal").style.display = "none";

  // Emit the "submit username" event to the server
  socket.emit("submit username", username);
}

// Attach the joinChat function to the modal button click event
document
  .getElementById("join-button-modal")
  .addEventListener("click", joinChat);

 // Allow submitting username by pressing Enter key
document.getElementById("username-input-modal").addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault(); // Prevent form submission
    joinChat();
  }
});

// Submit message form event listener
document.getElementById("form").addEventListener("submit", (e) => {
  e.preventDefault();
  const input = document.getElementById("input");
  const message = input.value;
  input.value = "";

  // Emit the "chat message" event with the message
  socket.emit("chat message", { message, username });
});

// Socket event listener for receiving messages
socket.on("chat message", (msg) => {
  const messages = document.getElementById("messages");
  const li = document.createElement("li");

  // Display the username and message
  li.textContent = `${msg.username}: ${msg.message}`;

  messages.appendChild(li);
});

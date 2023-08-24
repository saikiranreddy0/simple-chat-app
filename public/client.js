const socket = io();
let username = ""; // Variable to store the entered username
let joinedChat = false; // Variable to track whether user has joined the chat

// Emojis mapping
const emojis = {
  react: "⚛️",
  woah: "😲",
  hey: "👋",
  lol: "😂",
  like: "🤍",
  congratulations: "🎉",
};

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
  joinedChat = true;

  // Enable the message input and send button
  document.getElementById("input").disabled = false;
  document.getElementById("send-button").disabled = false;

  // Emit the "submit username" event to the server
  socket.emit("submit username", username);
}

// Attach the joinChat function to the modal button click event
document
  .getElementById("join-button-modal")
  .addEventListener("click", joinChat);

// Allow submitting username by pressing Enter key
document
  .getElementById("username-input-modal")
  .addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Prevent form submission
      joinChat();
    }
  });

// Submit message form event listener
document.getElementById("form").addEventListener("submit", (e) => {
  e.preventDefault();

  // Check if the user has joined the chat with a username
  if (!joinedChat) {
    alert("Please enter your username before sending messages.");
    return;
  }

  const input = document.getElementById("input");
  let message = input.value;
  input.value = "";

  // Check for slash commands
  if (message.startsWith("/")) {
    const command = message.slice(1).toLowerCase(); // Remove the leading slash
    handleSlashCommand(command);
    return;
  }

  // Replace specific words with emojis
  message = message.replace(/\b\w+\b/g, (word) => {
    const emoji = emojis[word.toLowerCase()];
    return emoji ? emoji : word;
  });

  // Emit the "chat message" event with the message
  socket.emit("chat message", { message });
});

// Handle slash commands
function handleSlashCommand(command) {
  const messages = document.getElementById("messages");
  const li = document.createElement("li");

  switch (command) {
    case "help":
      li.textContent =
        "Available slash commands:\n" +
        "\n /help - Display the list of available commands and their functions.\n" +
        "\n /clear - Clear the chat messages.\n" +
        "\n /random - Display a random number.";
      break;

    case "clear":
      messages.innerHTML = ""; // Clear the chat messages
      li.textContent = "Chat has been cleared.";
      break;

    case "random":
       const maxRandomNumber = 100000;
      const randomNumber = Math.floor(Math.random() * maxRandomNumber) + 1; // Generate a random number between 1 and 100
      li.textContent = `Random number: ${randomNumber}`;
      break;

    default:
      li.textContent = `Unknown command: ${command}`;
      break;
  }

  messages.appendChild(li);
}

// Socket event listener for receiving messages
socket.on("chat message", (msg) => {
  const messages = document.getElementById("messages");
  const li = document.createElement("li");

  // Display the username and message
  li.textContent = `${username}: ${msg.message}`;

  messages.appendChild(li);
});
socket.on("submit username", (uname)=> username=uname)
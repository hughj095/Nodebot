// DOM element references
const chatbotToggler = document.querySelector(".chatbot-toggler");
const closeBtn = document.querySelector(".close-btn");
const chatbox = document.querySelector(".chatbox");
const chatInput = document.querySelector(".chat-input textarea");
const sendChatBtn = document.querySelector(".chat-input span");


// code for URL input box here
document.getElementById("trainButton").addEventListener("click", function () {
            // Add your JavaScript logic here for handling the button click event
            alert("Training Chatbot with URL: " + document.getElementById("urlInput").value);
        });

// User message and initial input height
let userMessage = null;
const inputInitHeight = chatInput.scrollHeight;

// Create a chat list item with the given message and class name
const createChatLi = (message, className) => {
    const chatLi = document.createElement("li");
    chatLi.classList.add("chat", `${className}`);
    let chatContent = className === "outgoing" ? `<p></p>` : `<span class="material-symbols-outlined">smart_toy</span><p></p>`;
    chatLi.innerHTML = chatContent;
    chatLi.querySelector("p").textContent = message;
    return chatLi;
}

// Generate a response from the server for the given user message
const generateResponse = async (chatElement, userMessage) => {
    const messageElement = chatElement.querySelector("p");
    
    try {
        // Make an API request to the chat endpoint
        const response = await fetch("/api/chat", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ userMessage })
        });

        // Handle successful API response
        if (!response.ok) {
            throw new Error(`Request failed with status ${response.status}`);
        }

        const { result } = await response.json();

        // Handle response with an error message
        if (result.error) {
            throw new Error(result.error.message.trim());
        }

        // Set the chat message content from the response
        messageElement.textContent = result.choices[0].message.content.trim();
    } catch (error) {
        // Display error message in the chat
        messageElement.classList.add("error");
        messageElement.textContent = error.message;
    }
    chatbox.scrollTo(0, chatbox.scrollHeight);
}

// Handle user's chat input
const handleChat = () => {
    userMessage = chatInput.value.trim();
    if(!userMessage) return;

    // Clear input and adjust input height
    chatInput.value = "";
    chatInput.style.height = `${inputInitHeight}px`;

    // Append user's message to the chatbox
    chatbox.appendChild(createChatLi(userMessage, "outgoing"));
    chatbox.scrollTo(0, chatbox.scrollHeight);
    
    // Show "Thinking..." message and generate response
    setTimeout(() => {
        const incomingChatLi = createChatLi("Thinking...", "incoming");
        chatbox.appendChild(incomingChatLi);
        chatbox.scrollTo(0, chatbox.scrollHeight);
        generateResponse(incomingChatLi, userMessage);
    }, 600);
}

// Event listeners for input and button interactions
chatInput.addEventListener("input", () => {
    // Adjust input height dynamically
    chatInput.style.height = `${inputInitHeight}px`;
    chatInput.style.height = `${chatInput.scrollHeight}px`;
});

chatInput.addEventListener("keydown", (e) => {
    // Handle Enter key press for sending chat (if conditions met)
    if(e.key === "Enter" && !e.shiftKey && window.innerWidth > 800) {
        e.preventDefault();
        handleChat();
    }
});

// Event listeners for chatbot UI interactions
sendChatBtn.addEventListener("click", handleChat);
closeBtn.addEventListener("click", () => document.body.classList.remove("show-chatbot"));
chatbotToggler.addEventListener("click", () => document.body.classList.toggle("show-chatbot"));

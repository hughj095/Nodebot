// Import necessary modules
require("dotenv").config();
const express = require("express");
const app = express();
const path = require("path");

// Middlewares
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Route: Serve the "index" file for the root path
app.get("/", (req, res) => {
    res.sendFile("index");
});

// API endpoint: Handle chat interaction
app.post("/api/chat", async (req, res) => {
    try {
        const { userMessage } = req.body;

        // Configure API request to OpenAI
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
            },
            body: JSON.stringify({
                model: 'gpt-3.5-turbo',
                messages: [{ role: 'user', content: userMessage }],
            }),
        };
        
        const response = await fetch("https://api.openai.com/v1/chat/completions", requestOptions);
        const data = await response.json();
        res.json({ result: data }); // Respond with chat result
    } catch (error) {
        res.status(500).json({ result: "Something went wrong!" });
    }
});

module.exports = app;
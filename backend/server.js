const express = require("express");
const axios = require("axios");
const cors = require("cors");
const path = require("path");
require("dotenv").config(); // Certifique-se de que o dotenv está carregado

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "../frontend"))); // Serve static files from frontend

// Route for root URL
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/index.html")); // Serve index.html
});

// Endpoint to generate startup ideas
app.post("/generate-idea", async (req, res) => {
  const userInput =
    req.body.input?.trim() || "Gere uma ideia de startup inovadora"; // Default prompt if none provided

  // Verifique se o input é válido
  if (!userInput || typeof userInput !== "string") {
    return res.status(400).json({ error: "Input inválido." });
  }

  const jsonPayload = {
    contents: [
      {
        parts: [
          {
            text: userInput,
          },
        ],
      },
    ],
  };

  try {
    console.log("Payload:", JSON.stringify(jsonPayload, null, 2)); // Log do payload

    // Chamada à API do Gemini
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`, // Usando a chave da API do .env
      jsonPayload,
      {
        headers: {
          "Content-Type": "application/json", // Apenas o cabeçalho Content-Type necessário
        },
      }
    );

    console.log("API Response:", response.data); // Log da resposta da API

    res.status(200).json(response.data);
  } catch (error) {
    console.error(
      "Error calling Gemini API:",
      error.response ? error.response.data : error.message
    );
    res.status(500).json({
      error: "Failed to generate content",
      details: error.response ? error.response.data : "No details available",
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

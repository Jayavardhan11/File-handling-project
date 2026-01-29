import express from "express";
import { protect } from "../middleware/auth.js";

const router = express.Router();

const systemPrompt = `You are a helpful assistant for TechCorp's file management system. 
You help employees with:
- How to use the application features
- File uploads, previews, and management
- Privacy and sharing settings
- Troubleshooting issues
- General company file management questions

Key information:
- The app supports: Images, Videos, Audio files, and PDFs for preview
- Files can be marked Public (visible to all employees) or Private (only for you)
- This is a company-only application - only @techcorp.com employees can access it
- Users can upload, preview, edit, download, and share files

Be concise, friendly, professional, and helpful. Keep responses under 150 words.
Always be company-friendly and professional in tone.`;

// Using Google Gemini API
const GEMINI_API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

async function chat(message) {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY not set in environment");
  }

  try {
    const url = `${GEMINI_API_URL}?key=${process.env.GEMINI_API_KEY}`;
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `${systemPrompt}\n\nEmployee: ${message}\nAssistant:`,
              },
            ],
          },
        ],
        generationConfig: {
          maxOutputTokens: 150,
          temperature: 0.7,
          topP: 0.9,
        },
      }),
    });

    const text = await response.text();
    console.log("Gemini Response status:", response.status);

    // Check if response is HTML (error page)
    if (text.includes("<!doctype") || text.includes("<html")) {
      throw new Error(
        "Gemini service temporarily unavailable. Please try again.",
      );
    }

    if (!response.ok) {
      console.error("Gemini API Error:", text.substring(0, 200));

      // Better error detection
      if (response.status === 401 || response.status === 403) {
        throw new Error("Invalid or expired Gemini API key");
      }
      if (response.status === 429) {
        throw new Error(
          "Gemini API rate limit exceeded. Please try again in a few minutes.",
        );
      }
      if (response.status === 503) {
        throw new Error("Gemini service is temporarily unavailable.");
      }

      throw new Error(`API error: ${response.status}`);
    }

    const data = JSON.parse(text);
    const botMessage =
      data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ||
      "I'm having trouble understanding that. Could you rephrase?";

    return botMessage;
  } catch (error) {
    console.error("Chat function error:", error);
    throw error;
  }
}

// Test endpoint to validate Gemini API key
router.post("/test-api", async (req, res) => {
  try {
    console.log("Testing Gemini API key...");

    if (!process.env.GEMINI_API_KEY) {
      return res.status(400).json({
        status: "error",
        message: "GEMINI_API_KEY not configured in environment",
      });
    }

    const url = `${GEMINI_API_URL}?key=${process.env.GEMINI_API_KEY}`;
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: "Hello",
              },
            ],
          },
        ],
        generationConfig: {
          maxOutputTokens: 10,
        },
      }),
    });

    const text = await response.text();

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        return res.status(401).json({
          status: "error",
          message: "Invalid or expired Gemini API key",
          statusCode: response.status,
        });
      }
      if (response.status === 429) {
        return res.status(429).json({
          status: "error",
          message: "API rate limit exceeded",
          statusCode: response.status,
        });
      }

      return res.status(response.status).json({
        status: "error",
        message: text.substring(0, 200),
        statusCode: response.status,
      });
    }

    res.json({
      status: "success",
      message: "Gemini API key is valid and working",
      statusCode: response.status,
    });
  } catch (error) {
    console.error("API test error:", error);
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
});

// Chat endpoint
router.post("/", protect, async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || message.trim().length === 0) {
      return res.status(400).json({
        error: "Message is required",
      });
    }

    console.log("Chat request received:", message);
    const botMessage = await chat(message);
    console.log("Chat response sent:", botMessage);

    res.json({
      response: botMessage,
      category: "ai",
    });
  } catch (error) {
    console.error("Chat error:", error.message);
    res.status(500).json({
      error: "Failed to process chat message",
      details: error.message,
    });
  }
});

export default router;

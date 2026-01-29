import { useState, useRef, useEffect } from "react";
import { IoSend } from "react-icons/io5";
import { MdClose } from "react-icons/md";
import { BiSolidChat } from "react-icons/bi";
import { FiHelpCircle, FiBook } from "react-icons/fi";
import api from "../api/client";
import "./Chatbot.css";

// Knowledge base for common questions
const KNOWLEDGE_BASE = {
  "file upload":
    "To upload files, go to Dashboard → File Upload section. Click the upload area or drag and drop files. Supported formats: images, videos, audio, and PDFs.",
  "how to upload":
    "To upload files, go to Dashboard → File Upload section. Click the upload area or drag and drop files. Supported formats: images, videos, audio, and PDFs.",
  "file preview":
    "Previews are available for: Images (JPG, PNG, GIF), Videos (MP4, WebM), Audio (MP3, WAV), and PDFs. Other file types can be downloaded but not previewed.",
  preview:
    "Previews are available for: Images (JPG, PNG, GIF), Videos (MP4, WebM), Audio (MP3, WAV), and PDFs. Other file types can be downloaded but not previewed.",
  "edit file":
    "Click on any file in your dashboard, then click the Edit button to update description and privacy settings.",
  edit: "Click on any file in your dashboard, then click the Edit button to update description and privacy settings.",
  "public private":
    "Files can be marked as Public (viewable by all company employees) or Private (only for you). Change this in the file edit panel.",
  privacy:
    "Files can be marked as Public (viewable by all company employees) or Private (only for you). Change this in the file edit panel.",
  download:
    "Click on any file and select the Download button to save it to your device.",
  security:
    "This application is restricted to TechCorp employees only. Only valid @techcorp.com email addresses can register and access the system.",
  "who can access":
    "This application is restricted to TechCorp employees only. Only valid @techcorp.com email addresses can register and access the system.",
  company:
    "This is TechCorp's private file management system for employees only. All content is secure and company-owned.",
  help: "I'm here to help! Ask me about file uploads, previews, editing, privacy settings, or how the application works.",
  features:
    "Features: File upload (images, videos, audio, PDFs), Preview files, Edit descriptions and privacy, Download files, Share with team, Real-time updates, and AI Assistant.",
};

// Function to find best matching answer from knowledge base
const getKnowledgeAnswer = (message) => {
  const lowerMessage = message.toLowerCase();

  for (const [keyword, answer] of Object.entries(KNOWLEDGE_BASE)) {
    if (lowerMessage.includes(keyword)) {
      return answer;
    }
  }

  return null;
};

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hi! 👋 I'm your TechCorp File Handler Assistant. I can help you with:\n• How to upload and preview files\n• File privacy settings\n• How the application works\n• General questions\n\nWhat would you like to know?",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();

    if (!input.trim()) return;

    // Add user message
    const userMessage = {
      id: messages.length + 1,
      text: input,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      // First, try to answer from knowledge base
      const knowledgeAnswer = getKnowledgeAnswer(input);

      let botReply;
      if (knowledgeAnswer) {
        botReply = knowledgeAnswer;
      } else {
        // If not in knowledge base, use AI
        const response = await api.post("/chat", {
          message: input,
        });
        botReply = response.data.response;
      }

      const botMessage = {
        id: messages.length + 2,
        text: botReply,
        sender: "bot",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Chat error:", error);

      const errorMessage = {
        id: messages.length + 2,
        text: "Sorry, I couldn't process that. Try asking about:\n• How to upload files\n• File previews\n• Privacy settings\n• Or any other questions!",
        sender: "bot",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickQuestion = (question) => {
    setInput(question);
  };

  return (
    <>
      {/* Chat Button (Floating) */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="chat-button"
          title="Open Assistant"
        >
          <BiSolidChat size={24} />
          <span className="chat-badge">?</span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="chat-container">
          {/* Header */}
          <div className="chat-header">
            <div className="chat-header-content">
              <BiSolidChat size={20} />
              <div>
                <h3>TechCorp Assistant</h3>
                <p className="chat-subtitle">File Management Help</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="close-btn"
              title="Close"
            >
              <MdClose size={20} />
            </button>
          </div>

          {/* Messages */}
          <div className="chat-messages">
            {messages.map((msg) => (
              <div key={msg.id} className={`message ${msg.sender}`}>
                <div className="message-content">
                  <p style={{ whiteSpace: "pre-wrap" }}>{msg.text}</p>
                  <span className="message-time">
                    {msg.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>
            ))}

            {loading && (
              <div className="message bot">
                <div className="message-content">
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Questions */}
          {messages.length === 1 && !loading && (
            <div className="quick-questions">
              <button
                className="quick-btn"
                onClick={() => handleQuickQuestion("How do I upload files?")}
              >
                <FiBook size={16} /> How to upload
              </button>
              <button
                className="quick-btn"
                onClick={() =>
                  handleQuickQuestion("What file types are supported?")
                }
              >
                <FiBook size={16} /> File types
              </button>
              <button
                className="quick-btn"
                onClick={() => handleQuickQuestion("How do I share files?")}
              >
                <FiHelpCircle size={16} /> Sharing
              </button>
            </div>
          )}

          {/* Input */}
          <form onSubmit={sendMessage} className="chat-input-form">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me anything..."
              disabled={loading}
            />
            <button type="submit" disabled={loading || !input.trim()}>
              <IoSend size={18} />
            </button>
          </form>
        </div>
      )}
    </>
  );
}

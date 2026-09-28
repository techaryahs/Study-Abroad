"use client";

import { useState } from "react";
import { chatbotQuestions } from "@/data/chatbotData";

interface Message {
  sender: "user" | "bot";
  text: string;
}

export default function ChatBot() {
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: "bot",
      text: "👋 Hello! I'm EduLeader AI Assistant. Ask me anything about Study Abroad, Student Visa, Universities, Scholarships or SOP.",
    },
  ]);

  const [loading, setLoading] = useState(false);

  const askQuestion = (question: string, answer: string) => {
    setMessages((prev) => [
      ...prev,
      {
        sender: "user",
        text: question,
      },
    ]);

    setLoading(true);

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: answer,
        },
      ]);

      setLoading(false);
    }, 1000);
  };

  return (
    <div className="space-y-8">

      {/* Chat Messages */}

      <div className="space-y-4">

        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${
              msg.sender === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[75%] rounded-2xl px-5 py-4 shadow-sm ${
                msg.sender === "bot"
                  ? "bg-blue-50 text-gray-800"
                  : "bg-[#16364F] text-white"
              }`}
            >
              <div className="text-xs font-semibold mb-2 opacity-70">
                {msg.sender === "bot"
                  ? "🤖 EduLeader AI"
                  : "👤 You"}
              </div>

              <div>{msg.text}</div>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-blue-50 rounded-2xl px-5 py-4 shadow-sm">
              <div className="text-xs font-semibold mb-2">
                🤖 EduLeader AI
              </div>

              <div className="animate-pulse">
                Typing...
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Suggested Questions */}

      <div>

        <h3 className="font-bold text-[#16364F] text-lg mb-4">
          💡 Suggested Questions
        </h3>

        <div className="grid gap-3">

          {chatbotQuestions.map((item, index) => (
            <button
              key={index}
              onClick={() => askQuestion(item.question, item.answer)}
              className="text-left rounded-xl border border-gray-300 bg-white px-5 py-4 hover:bg-[#16364F] hover:text-white transition-all duration-300"
            >
              {item.question}
            </button>
          ))}

        </div>

      </div>

    </div>
  );
}
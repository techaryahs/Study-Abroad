"use client";

import Link from "next/link";
import ChatBot from "@/components/chatbot/ChatBot";

export default function StudyAbroadAssistant() {
  return (
    <main className="min-h-screen bg-[#F8F6F2]">

      <div className="max-w-5xl mx-auto py-16 px-6">

        <Link
          href="/ai-services"
          className="text-[#16364F] font-semibold hover:underline"
        >
          ← Back to AI Services
        </Link>

        <div className="mt-6 rounded-3xl bg-white shadow-xl border border-gray-200 overflow-hidden">

          <div className="bg-[#16364F] p-6">

            <h1 className="text-3xl font-bold text-white">
              🤖 EduLeader AI Assistant
            </h1>

            <p className="text-gray-300 mt-2">
              Ask anything about Study Abroad & Student Visa.
            </p>

          </div>

          <div className="p-8">

            <ChatBot />

          </div>

        </div>

      </div>

    </main>
  );
}
"use client";

import AIServiceCard from "@/components/ai/AIServiceCard";

export default function AIServicesPage() {
  return (
    <main className="min-h-screen bg-[#F8F6F2]">

      <section className="max-w-7xl mx-auto px-6 py-20">

        <div className="text-center mb-16">

          <h1 className="text-5xl font-extrabold text-[#16364F]">
            AI Services
          </h1>

          <p className="mt-6 text-xl text-gray-600 max-w-3xl mx-auto">
            Experience intelligent AI tools designed to simplify every step
            of your study abroad journey.
          </p>

        </div>

        <div className="grid md:grid-cols-2 gap-8">

          <AIServiceCard
            title="Study Abroad AI Assistant"
            description="Ask instant questions about visas, admissions, universities, scholarships and much more."
            icon="🤖"
            href="/ai-services/study-abroad-assistant"
            buttonText="Start Chatting"
          />

          <AIServiceCard
            title="AI SOP Generator"
            description="Generate professional Statements of Purpose using AI."
            icon="📝"
            href="/ai-services/sop-generator"
            buttonText="Open Tool"
          />

          <AIServiceCard
            title="Mock Interview AI"
            description="Practice university and visa interviews using AI."
            icon="🎤"
            href="/ai_services/mock_interview_ai"
            buttonText="Open Tool"
          />

          <AIServiceCard
            title="AI Plagiarism Checker"
            description="Check originality of SOPs and academic documents."
            icon="🔍"
            href="/ai_services/ai_plagirism_tool"
            buttonText="Open Tool"
          />

        </div>

      </section>

    </main>
  );
}
"use client";

import { useState, useRef } from "react";
import { HighSchoolModal, SuccessModal } from "./profile/HighSchool";
import { UnderGradModal } from "./profile/UnderGrad";
import { MastersModal } from "./profile/Masters";
import { AnimatePresence } from "framer-motion";
import ProjectFormModal from "./profile/Add-Projects";
import AddVolunteer from "./profile/Volunteering";

interface ProfileCard {
  id: number;
  icon: string;
  title: string;
  description: string;
  skipped: boolean;
  added: boolean;
}

const initialCards: ProfileCard[] = [
  { id: 1, icon: "🏫", title: "Target University", description: "Where do you wish to pursue higher education?", skipped: false, added: false },
  { id: 2, icon: "🎓", title: "High School", description: "Where did you spend the final years of school life?", skipped: false, added: false },
  { id: 3, icon: "📘", title: "Undergrad Degree", description: "Enter your bachelor's degree details.", skipped: false, added: false },
  { id: 4, icon: "🎓", title: "Master's Degree", description: "Do you hold a master's degree? Submit the details here.", skipped: false, added: false },
  { id: 5, icon: "📝", title: "Test Scores", description: "Enter your standardized test scores.", skipped: false, added: false },
  { id: 6, icon: "💼", title: "Work Experience", description: "Submit work experience details here.", skipped: false, added: false },
  { id: 7, icon: "🔬", title: "Add Research", description: "Did you know? Adding research experience boosts your profile.", skipped: false, added: false },
  { id: 8, icon: "💻", title: "Add Projects", description: "Include your professional or academic projects.", skipped: false, added: false },
  { id: 9, icon: "🤝", title: "Volunteering", description: "List your volunteering activities and contributions.", skipped: false, added: false },
];
export default function ProfileRecommendationsPage() {
  const [cards, setCards] = useState<ProfileCard[]>(initialCards);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [openFormId, setOpenFormId] = useState<number | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showVolunteer, setShowVolunteer] = useState(false);

  const visibleCount = 3;
  const addedCount = cards.filter((c) => c.added).length;
  const total = cards.length;
  const progressPercent = Math.round((addedCount / total) * 100);

  const scroll = (direction: "left" | "right") => {
    const next =
      direction === "right"
        ? Math.min(currentIndex + 1, total - visibleCount)
        : Math.max(currentIndex - 1, 0);
    setCurrentIndex(next);
  };

  const handleAction = (id: number, action: "skip" | "add") => {
    setCards((prev) =>
      prev.map((c) =>
        c.id === id
          ? { ...c, skipped: action === "skip", added: action === "add" }
          : c
      )
    );
  };

  const visibleCards = cards.slice(currentIndex, currentIndex + visibleCount);

  return (
    <main className="min-h-screen bg-[#F0F4FF] flex items-center justify-center p-6 font-sans">
      <div className="w-full max-w-4xl">
        {/* Card Container */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-center text-lg">
              ⭐
            </div>
            <h2 className="text-lg font-semibold text-gray-700 tracking-tight">
              Recommended for you
            </h2>
          </div>

        <AnimatePresence>
          {openFormId === 2 && (
            <HighSchoolModal 
              isOpen={true} 
              onClose={() => setOpenFormId(null)} 
              onSubmit={() => { setOpenFormId(null); setShowSuccess(true); handleAction(2, "add"); }} 
            />
          )}

          {openFormId === 3 && (
            <UnderGradModal 
              isOpen={true} 
              onClose={() => setOpenFormId(null)} 
              onSubmit={() => { setOpenFormId(null); setShowSuccess(true); handleAction(3, "add"); }} 
            />
          )}

          {openFormId === 4 && (
            <MastersModal 
              isOpen={true} 
              onClose={() => setOpenFormId(null)} 
              onSubmit={() => { setOpenFormId(null); setShowSuccess(true); handleAction(4, "add"); }} 
            />
          )}
          
          {openFormId === 8 && (
              <ProjectFormModal
                isOpen={true}
                onClose={() => setOpenFormId(null)}
              />
            )}
            
         {openFormId === 9 && (
  <AddVolunteer
    isOpen={true}
    onClose={() => setOpenFormId(null)}
    onSubmit={() => {
      setOpenFormId(null);
      setShowSuccess(true);
      handleAction(9, "add");
    }}
  />
)}

          {showSuccess && <SuccessModal onClose={() => setShowSuccess(false)} />}
        </AnimatePresence>

          {/* Profile Status */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-gray-800">Profile Status</span>
              <span className="text-sm font-medium text-gray-500">
                {addedCount}/{total}
              </span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2 mb-3 overflow-hidden">
              <div
                className="h-2 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <p className="text-sm text-gray-500 leading-relaxed">
              Complete your profile to enhance visibility and increase your reach. Help people know you better.
            </p>
          </div>

          {/* Carousel */}
          <div className="relative flex items-center gap-3">
            {/* Left Arrow */}
            <button
              onClick={() => scroll("left")}
              disabled={currentIndex === 0}
              className="flex-shrink-0 w-9 h-9 rounded-full border border-gray-200 bg-white shadow-sm flex items-center justify-center text-gray-500 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              ‹
            </button>

            {/* Cards */}
            <div className="flex-1 grid grid-cols-3 gap-4 overflow-hidden" ref={scrollRef}>
              {visibleCards.map((card) => (
                <div
                  key={card.id}
                  className="rounded-xl border border-gray-200 bg-white hover:shadow-md p-5 flex flex-col gap-3 transition-all duration-300"
                >
                  <div className="flex items-start gap-3">
                    <span className="text-3xl leading-none">{card.icon}</span>
                    <div>
                      <h3 className="font-semibold text-gray-800 text-sm leading-snug">
                        {card.title}
                      </h3>
                      <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                        {card.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-auto">
                    <button
                      onClick={() => handleAction(card.id, "skip")}
                      className="flex-1 py-2 rounded-lg text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
                    >
                      Skip
                    </button>
                    <button
                      onClick={() => {
                        handleAction(card.id, "add");
                        setOpenFormId(card.id);
                      }}
                      className="flex-1 py-2 rounded-lg text-sm font-semibold text-white bg-emerald-500 hover:bg-emerald-600 active:scale-95 transition-all"
                    >
                      Add
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Right Arrow */}
            <button
              onClick={() => scroll("right")}
              disabled={currentIndex >= total - visibleCount}
              className="flex-shrink-0 w-9 h-9 rounded-full border border-gray-200 bg-white shadow-sm flex items-center justify-center text-gray-500 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              ›
            </button>
          </div>

          {/* Dot Indicators */}
          <div className="flex justify-center gap-1.5 mt-6">
            {Array.from({ length: total - visibleCount + 1 }).map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === currentIndex
                    ? "w-5 bg-emerald-500"
                    : "w-1.5 bg-gray-300"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Progress Summary */}
        {addedCount > 0 && (
          <p className="text-center text-sm text-gray-500 mt-4">
            🎉 You've completed{" "}
            <span className="font-semibold text-emerald-600">{addedCount}</span> of{" "}
            <span className="font-semibold">{total}</span> profile sections
          </p>
        )}
      </div>
    </main>
  );
}
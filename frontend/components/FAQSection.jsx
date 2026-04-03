"use client";

import { useState } from "react";

export default function FAQSection() {
  const [activeIndex, setActiveIndex] = useState(0);

  const faqs = [
    {
      question:
        "Do you only help for applications to the US? What about other countries?",
      answer:
        "We support applications to most countries including but not limited to USA, Canada, Germany, Ireland, UK, Australia, India, and Singapore.",
    },
    {
      question: "Does the price include GST/Taxes?",
      answer: "Yes, all taxes are included in the price.",
    },
    {
      question:
        "Since the services are offered online, how do we ensure the process will be as smooth as an offline consulting service?",
      answer:
        "We use structured sessions, tools, and clear communication to ensure a smooth experience.",
    },
    {
      question: "What is the best time for me to enroll in the services?",
      answer: "The earlier you start, the better your planning and outcomes.",
    },
    {
      question:
        "Are the timelines mentioned on the website followed religiously?",
      answer: "Yes, we strictly follow timelines and commitments.",
    },
    {
      question: "Are there any ongoing discount offers?",
      answer: "Discounts may be available occasionally.",
    },
  ];

  const toggleFAQ = (index) => {
    setActiveIndex(index === activeIndex ? -1 : index);
  };

  return (
    <div className="bg-[#f5f6f8] py-16">

      <div className="max-w-[1200px] mx-auto px-20">

        {/* TITLE */}
        <h2 className="text-center text-[32px] text-gray-800 font-medium mb-10">
          Frequently Asked Questions!
        </h2>

        {/* FAQ LIST */}
        <div className="space-y-4">

          {faqs.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-lg border border-gray-200 overflow-hidden"
            >

              {/* QUESTION */}
              <div
                onClick={() => toggleFAQ(index)}
                className="flex justify-between items-center px-6 py-5 cursor-pointer"
              >
                <span className="text-gray-700 font-medium">
                  {item.question}
                </span>

                {/* ICON */}
                <div className="w-8 h-8 flex items-center justify-center bg-yellow-400 rounded-md text-white text-lg">
                  {activeIndex === index ? "−" : "+"}
                </div>
              </div>

              {/* ANSWER */}
              {activeIndex === index && (
                <div className="px-6 pb-5 text-gray-600 text-sm">
                  {item.answer}
                </div>
              )}

            </div>
          ))}

        </div>

      </div>

    </div>
  );
}
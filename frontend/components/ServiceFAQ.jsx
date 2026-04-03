"use client";
import { useState } from "react";

export default function ServiceFAQ() {
  const [activeIndex, setActiveIndex] = useState(0);

  const faqs = [
    {
      question: "Do you only help for applications to the US? What about other countries?",
      answer:
        "We support applications to most countries including but not limited to USA, Canada, Germany, Ireland, UK, Australia, India, and Singapore.",
    },
    {
      question: "Does the price include GST/Taxes?",
      answer: "Yes, all taxes are included.",
    },
    {
      question: "Since the services are offered online, how do we ensure the process will be as smooth as an offline consulting service?",
      answer: "We use structured sessions and tools to ensure a smooth experience.",
    },
    {
      question: "What is the best time for me to enroll in the services?",
      answer: "The earlier, the better.",
    },
    {
      question: "Are the timelines mentioned on the website followed religiously?",
      answer: "Yes, we strictly follow timelines.",
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
    <div className="bg-[#f5efe3] py-16">
      <div className="max-w-[1200px] mx-auto px-20">

        <h2 className="text-center text-[36px] font-medium text-black mb-10">
          Frequently Asked Questions!
        </h2>

        <div className="space-y-5">
          {faqs.map((item, index) => (
            <div
              key={index}
              className="border border-gray-300 rounded-lg bg-white px-6 py-5 cursor-pointer"
              onClick={() => toggleFAQ(index)}
            >
              <div className="flex justify-between items-center">
                <span className="text-[16px] font-medium text-gray-700">
                  {item.question}
                </span>

                <span className="bg-yellow-400 text-white w-8 h-8 flex items-center justify-center rounded-md text-lg font-bold">
                  {activeIndex === index ? "−" : "+"}
                </span>
              </div>

              {activeIndex === index && (
                <p className="mt-4 text-gray-600 text-sm">
                  {item.answer}
                </p>
              )}
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
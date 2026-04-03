"use client";
import { useState } from "react";

export default function FAQCanada() {
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
      answer: "Yes, all taxes are included.",
    },
    {
      question:
        "Since the services are offered online, how do we ensure the process will be as smooth as an offline consulting service?",
      answer:
        "We ensure smooth delivery through structured sessions and expert guidance.",
    },
    {
      question: "What is the best time for me to enroll in the services?",
      answer: "The earlier, the better.",
    },
    {
      question:
        "Are the timelines mentioned on the website followed religiously?",
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
      <div className="max-w-[1100px] mx-auto px-6">

        {/* TITLE */}
        <h2 className="text-center text-[34px] font-medium text-gray-700 mb-10">
          Frequently Asked Questions!
        </h2>

        {/* FAQ LIST */}
        <div className="space-y-4">

          {faqs.map((item, index) => (
            <div
              key={index}
              className="bg-white border rounded-lg p-5 shadow-sm"
            >

              {/* QUESTION */}
              <div
                className="flex justify-between items-center cursor-pointer"
                onClick={() => toggleFAQ(index)}
              >
                <h3 className="text-[17px] font-semibold text-[#4a5568]">
                  {item.question}
                </h3>

                <div className="w-[28px] h-[28px] flex items-center justify-center rounded-md bg-yellow-400 text-white font-bold">
                  {activeIndex === index ? "−" : "+"}
                </div>
              </div>

              {/* ANSWER */}
              {activeIndex === index && (
                <p className="mt-3 text-[#6b7280] text-[15px] leading-relaxed">
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
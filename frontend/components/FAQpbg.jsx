"use client";

import { useState } from "react";

export default function FAQSimple() {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      question:
        "Do you only help for applications to the US? What about other countries?",
      answer:
        "We support applications to most countries including but not limited to USA, Canada, Germany, Ireland, UK, Australia, India, and Singapore.",
    },
    {
      question: "Does the price include GST/Taxes?",
      answer: "Yes, all prices are inclusive of applicable taxes.",
    },
    {
      question:
        "Since the services are offered online, how do we ensure the process will be as smooth as an offline consulting service?",
      answer:
        "We use structured workflows, Zoom sessions, and continuous support to ensure a smooth experience.",
    },
    {
      question: "What is the best time for me to enroll in the services?",
      answer: "The earlier you start, the better your preparation will be.",
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

  const toggle = (index) => {
    setOpenIndex(openIndex === index ? -1 : index);
  };

  return (
    <div className="bg-[#f5efe3] py-16">

      <div className="max-w-[1100px] mx-auto px-6">

        {/* TITLE */}
        <h2 className="text-center text-[36px] text-gray-800 font-medium mb-10">
          Frequently Asked Questions!
        </h2>

        {/* FAQ LIST */}
        <div className="space-y-4">

          {faqs.map((item, index) => (
            <div
              key={index}
              className="bg-white border border-gray-200 rounded-lg px-6 py-5"
            >

              {/* QUESTION */}
              <div
                onClick={() => toggle(index)}
                className="flex justify-between items-center cursor-pointer"
              >
                <h3 className="text-[17px] font-semibold text-[#4a5568]">
                  {item.question}
                </h3>

                <div className="w-[30px] h-[30px] bg-yellow-400 text-white flex items-center justify-center rounded-md text-xl">
                  {openIndex === index ? "−" : "+"}
                </div>
              </div>

              {/* ANSWER */}
              {openIndex === index && (
                <p className="mt-4 text-[15px] text-gray-600">
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
// "use client";

// import { useState } from "react";
// import "./gre.css";

// export default function FAQSection() {
//   const [activeIndex, setActiveIndex] = useState(0);

//   const faqs = [
//     {
//       question: "Do we cover both Quantitative and Verbal sections during the session?",
//       answer: "Yes, schedules for both the sections will be covered.",
//     },
//     {
//       question: "Is one hour enough to evaluate my performance and build the schedule?",
//       answer: "Yes, one hour is enough for evaluation and planning.",
//     },
//     {
//       question: "Will I be recommended Study Material along with the plan?",
//       answer: "Yes, you will get recommended study material.",
//     },
//     {
//       question: "Do you only help for applications to the US? What about other countries?",
//       answer: "We help for multiple countries including US, UK, Canada, etc.",
//     },
//     {
//       question: "Does the price include GST/Taxes?",
//       answer: "Yes, all taxes are included.",
//     },
//     {
//       question: "What is the duration of the prep-plan?",
//       answer: "It depends on your target and timeline.",
//     },
//     {
//       question: "Am I going to be given unlimited coaching sessions throughout the plan we build?",
//       answer: "Support is provided based on the selected plan.",
//     },
//     {
//       question: "Since the services are offered online, how do we ensure the process will be as smooth as an offline consulting service?",
//       answer: "We use structured sessions and tools to ensure smooth experience.",
//     },
//     {
//       question: "What is the best time for me to enroll in the services?",
//       answer: "The earlier, the better.",
//     },
//     {
//       question: "Are the timelines mentioned on the website followed religiously?",
//       answer: "Yes, we strictly follow timelines.",
//     },
//     {
//       question: "Are there any ongoing discount offers?",
//       answer: "Discounts may be available occasionally.",
//     },
//   ];

//   const toggleFAQ = (index) => {
//     setActiveIndex(index === activeIndex ? -1 : index);
//   };

//   return (
//     <div className="faq-section">

//       <div className="container">

//         <h2 className="faq-title">Frequently Asked Questions!</h2>

//         <div className="faq-list">

//           {faqs.map((item, index) => (
//             <div
//               key={index}
//               className={`faq-item ${activeIndex === index ? "active" : ""}`}
//             >

//               {/* QUESTION */}
//               <div
//                 className="faq-question"
//                 onClick={() => toggleFAQ(index)}
//               >
//                 <span>{item.question}</span>

//                 <span className="faq-icon">
//                   {activeIndex === index ? "−" : "+"}
//                 </span>
//               </div>

//               {/* ANSWER */}
//               {activeIndex === index && (
//                 <div className="faq-answer">
//                   {item.answer}
//                 </div>
//               )}

//             </div>
//           ))}

//         </div>

//       </div>

//     </div>
//   );
// }

"use client";

import { useState } from "react";

export default function FAQSection() {
  const [activeIndex, setActiveIndex] = useState(0);

  const faqs = [
    {
      question: "Do we cover both Quantitative and Verbal sections during the session?",
      answer: "Yes, schedules for both the sections will be covered.",
    },
    {
      question: "Is one hour enough to evaluate my performance and build the schedule?",
      answer: "Yes, one hour is enough for evaluation and planning.",
    },
    {
      question: "Will I be recommended Study Material along with the plan?",
      answer: "Yes, you will get recommended study material.",
    },
    {
      question: "Do you only help for applications to the US? What about other countries?",
      answer: "We help for multiple countries including US, UK, Canada, etc.",
    },
    {
      question: "Does the price include GST/Taxes?",
      answer: "Yes, all taxes are included.",
    },
    {
      question: "What is the duration of the prep-plan?",
      answer: "It depends on your target and timeline.",
    },
    {
      question: "Am I going to be given unlimited coaching sessions throughout the plan we build?",
      answer: "Support is provided based on the selected plan.",
    },
    {
      question: "Since the services are offered online, how do we ensure the process will be as smooth as an offline consulting service?",
      answer: "We use structured sessions and tools to ensure smooth experience.",
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
    <div className="bg-[#f7f7f7] py-16">

      <div className="max-w-[1200px] mx-auto px-20">

        <h2 className="text-[34px] text-center mb-10 text-black font-medium">
          Frequently Asked Questions!
        </h2>

        <div className="space-y-4">

          {faqs.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-lg border p-5 cursor-pointer"
            >

              {/* QUESTION */}
              <div
                className="flex justify-between items-center"
                onClick={() => toggleFAQ(index)}
              >
                <span className="font-medium text-gray-700">
                  {item.question}
                </span>

                <span className="w-7 h-7 flex items-center justify-center bg-yellow-400 text-white rounded">
                  {activeIndex === index ? "−" : "+"}
                </span>
              </div>

              {/* ANSWER */}
              {activeIndex === index && (
                <div className="mt-3 text-gray-600">
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
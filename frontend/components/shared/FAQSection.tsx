"use client";

import { useState } from "react";
import { Plus, Minus } from "lucide-react";

export type FAQ = {
    question: string;
    answer: string;
}

export const defaultFaqs: FAQ[] = [
    {
        question: "Do you only help for applications to the US? What about other countries?",
        answer: "We support applications to most countries including but not limited to USA, Canada, Germany, Ireland, UK, Australia, India, and Singapore."
    },
    {
        question: "Does the price include GST/Taxes?",
        answer: "All charges on the website are inclusive of the GST/Taxes."
    },
    {
        question: "Since the services are offered online, how do we ensure the process will be as smooth as an offline consulting service?",
        answer: "Over the years, we have worked with clients from over 55 countries. We believe the most important part of any service is the support. Hence, we go to tremendous lengths to ensure that you are getting the support you need, as quickly as possible. A dedicated support representative is provided to you on WhatsApp for both calls and texts during working hours. In case you are unable to reach your support representative on WhatsApp, we also have a live chat feature on the website where we respond instantly during working hours (and over emails for any queries received outside working hours). Apart from that, your dashboard will be your single point of access for any status updates regarding the services. Most of our clients have rated the experience superior to any offline consulting firm that you repeatedly need to visit for status updates or availing services. We follow strict timelines and are always a message/call away!"
    },
    {
        question: "What is the best time for me to enroll in the services?",
        answer: "For the best support, we advise enrolling in advance. Please note that you can avail of the service you buy anytime within 1 year of your purchase. Hence, many students enroll with us as early as a year in advance and enjoy our support in your profile building and applications."
    },
    {
        question: "Are the timelines mentioned on the website followed religiously?",
        answer: "Please note that these begin from the date of your input submission (if required for the service you are going for). The timelines as mentioned on the service purchase bar above are extremely accurate in most cases. Our current record shows that 98.3% of the deadlines have been met as mentioned on the website. However, in extremely rare cases, the average timeline mentioned on the website may be exceeded. This happens with less than 2 cases for every 98 that we deliver on time."
    },
    {
        question: "Are there any ongoing discount offers?",
        answer: "Please keep an eye out for any active promo codes or seasonal discounts available directly on our website or our social media properties."
    }
];

type FAQItemProps = {
    question: string;
    answer: string;
    isOpen: boolean;
    onClick: () => void;
};

function FAQItem({ question, answer, isOpen, onClick }: FAQItemProps) {
    return (
        <div className={`border rounded-2xl overflow-hidden transition-all duration-300 ${isOpen ? 'bg-white border-[#D4A848]/30 shadow-lg' : 'bg-white border-[#D4A848]/10 shadow-sm hover:border-[#D4A848]/30 hover:shadow-md hover:-translate-y-0.5'}`}>
            <button 
                onClick={onClick}
                className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none group"
            >
                <span className={`font-bold text-[15px] pr-8 transition-colors ${isOpen ? 'text-[#D4A848]' : 'text-[#362B25] group-hover:text-[#D4A848]'}`}>{question}</span>
                <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all border ${isOpen ? 'bg-[#D4A848] text-white border-[#D4A848] rotate-180' : 'bg-transparent text-[#D4A848] border-[#D4A848]/20 group-hover:bg-[#D4A848]/10 group-hover:border-[#D4A848]'}`}>
                    {isOpen ? <Minus size={16} strokeWidth={3} /> : <Plus size={16} strokeWidth={3} />}
                </div>
            </button>
            <div 
                className="overflow-hidden transition-all duration-300 ease-in-out"
                style={{ 
                    maxHeight: isOpen ? '1000px' : '0px',
                    opacity: isOpen ? 1 : 0 
                }}
            >
                <div className="px-6 pb-6">
                    <p className="text-[#675F5B] text-[14.5px] leading-relaxed pt-2">
                        {answer}
                    </p>
                </div>
            </div>
        </div>
    );
}

export default function FAQSection({ faqs = defaultFaqs }: { faqs?: FAQ[] }) {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    return (
        <section className="py-24 px-8 md:px-20 bg-[#F8F6F1] border-y border-[#D4A848]/10 relative z-10 w-full">
            <div className="max-w-4xl mx-auto space-y-12">
                <div className="text-center space-y-4">
                    <h2 className="text-3xl md:text-4xl font-semibold text-[#362B25]">
                        Frequently Asked <span className="text-[#D4A848]">Questions</span>
                    </h2>
                    <div className="w-24 h-[2px] bg-[#D4A848] mx-auto" />
                </div>

                <div className="grid gap-4">
                    {faqs.map((faq, idx) => (
                        <FAQItem 
                            key={idx} 
                            question={faq.question} 
                            answer={faq.answer} 
                            isOpen={openIndex === idx}
                            onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}

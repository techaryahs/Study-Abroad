"use client";

import Image from "next/image";
import { useState } from "react";
import { MdVideoCall } from "react-icons/md";
import { FaWhatsapp } from "react-icons/fa";
import { FaUserTie } from "react-icons/fa";
import { FaFileAlt } from "react-icons/fa";
import { FaIdBadge } from "react-icons/fa";
import DiscussionSection from "@/components/shared/DiscussionSection";
export default function UsMockInterviewPage() {

  return (
    <div className="w-full bg-white text-gray-800">

      {/* ================= HERO ================= */}
      <section className="bg-[#f7f4ef] py-16 px-6 md:px-16">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-10 items-center">

          {/* LEFT */}
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-black mb-4">
              US VISA MOCK INTERVIEW
            </h1>

            <p className="text-lg text-gray-600 mb-6">
              The final step to your US visa is a Visa interview with an officer
              from the US consulate. Ace the interview with proven tricks and
              techniques.
            </p>

            <DiscussionSection serviceId="us-mock-interview" />
          </div>

          {/* RIGHT IMAGE */}
          <div className="flex justify-center">
            <Image
              src="/visa.jpg" // 👈 add image in public folder
              alt="Visa Interview"
              width={400}
              height={400}
              className="rounded-xl"
            />
          </div>
        </div>
      </section>

      {/* ================= MODAL ================= */}
     

      {/* ================= ABOUT ================= */}
    <section className="py-16 px-6 md:px-16">
  <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-10">

    {/* LEFT CONTENT */}
    <div className="md:col-span-2">

      <h2 className="text-2xl font-semibold mb-6 text-black">
        About Service
      </h2>

      <p className="mb-4 font-semibold">
        Last step to your flight to the USA is a visa stamping on your passport
      </p>

      <div className="flex items-start gap-3 mb-3">
        <FaUserTie className="text-yellow-500 mt-1" size={18} />
        <p className="text-gray-700">
          While it may sound easy, visa officers reject 1 in 4 candidates.
        </p>
      </div>

      <div className="flex items-start gap-3 mb-3">
        <FaFileAlt className="text-yellow-500 mt-1" size={18} />
        <p className="text-gray-700">
          Failing this visa interview normally means losing months of hard work...
        </p>
      </div>

      <div className="flex items-start gap-3">
        <FaIdBadge className="text-gray-600 mt-1" size={18} />
        <p className="text-gray-700">
          Whether you have family in the US, weak ties to your home country...
        </p>
      </div>

    </div>

    {/* RIGHT SIDEBAR */}
    <div className="bg-white rounded-xl shadow-md p-6 border h-fit">

      <h3 className="text-xl font-semibold text-black mb-4 text-center">
        Start Now
      </h3>

      <div className="space-y-3 text-sm">
        <div className="flex justify-between">
          <span className="font-semibold text-black">Services:</span>
          <span>US Visa Mock Interview</span>
        </div>

        <div className="flex justify-between">
          <span className="font-semibold text-black">Duration:</span>
          <span>1 hour(average)</span>
        </div>

        <div className="flex justify-between items-center">
          <span className="font-semibold text-black">Currency:</span>

          <select className="border rounded px-2 py-1 text-sm">
                <option value="INR">India (₹ INR)</option>
  <option value="USD">United States ($ USD)</option>
  <option value="GBP">United Kingdom (£ GBP)</option>
  <option value="EUR">Germany (€ EUR)</option>
  <option value="EUR">France (€ EUR)</option>
  <option value="CAD">Canada ($ CAD)</option>
  <option value="AUD">Australia ($ AUD)</option>
  <option value="SGD">Singapore ($ SGD)</option>
  <option value="AED">UAE (د.إ AED)</option>
  <option value="JPY">Japan (¥ JPY)</option>
  <option value="CNY">China (¥ CNY)</option>
  <option value="NZD">New Zealand ($ NZD)</option>
  <option value="ZAR">South Africa (R ZAR)</option>
  <option value="CHF">Switzerland (CHF)</option>
  <option value="SEK">Sweden (kr SEK)</option>
  <option value="NOK">Norway (kr NOK)</option>
  <option value="DKK">Denmark (kr DKK)</option>
  
          </select>
          
        </div>
        {/* SESSIONS */}
<div className="flex justify-between items-center">
  <span className="font-semibold text-black">Sessions:</span>

  <select className="border rounded px-2 py-1 text-sm w-40">
    <option value="">Sessions</option>
    <option value="1">1 (3 round) </option>
    <option value="2">2 (6 round) </option>
    <option value="3">3 (9 round) </option>
    <option value="3">4 (12 round) </option>
    <option value="3">5 (15 round) </option>
    <option value="3">6 (18 round) </option>
    <option value="3">7 (21 round) </option>
  </select>
</div>
</div>

      {/* PRICE */}
      <div className="mt-6 border-t pt-4 space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="font-semibold text-black">Amount:</span>
          
        </div>
      </div>

      {/* BUTTONS */}
      <div className="mt-6 flex gap-3">
          <button
  onClick={() => {
    const item = {
      name: "Personal History Statement",
      price: 20607.25,
    };

    localStorage.setItem("cartItem", JSON.stringify(item));
    alert("Added to cart ✅");
  }}
  className="flex-1 border border-yellow-500 py-2 rounded-lg hover:bg-yellow-100"
>
  Add to Cart
</button>

        <button
  onClick={() => {
    window.location.href = "/checkout";
  }}
  className="flex-1 bg-yellow-500 text-white py-2 rounded-lg hover:bg-yellow-600"
>
  Buy Now
</button>
          </div>
          {/* <div className="mt-8 bg-gray-50 rounded-xl p-6 border border-gray-100">
            <DiscussionSection serviceId="us-mock-interview" />
          </div> */}

    </div>

  </div>
</section>

      {/* ================= FEATURE BOX ================= */}
      <section className="px-6 md:px-16 mb-16">
        <div className="max-w-5xl mx-auto bg-gray-800 text-white rounded-xl p-8 text-center border-4 border-yellow-400">
          <h3 className="text-xl font-semibold mb-3">
            Mock Interview Session
          </h3>
          <p>
            Don’t let unpredictable questions from the visa officers crush your U.S. dream. Get support from our experts who have successfully gotten 5000+ cases approved.
          </p>
        </div>
      </section>

      {/* ================= CARDS ================= */}
     <section className="px-6 md:px-16 mb-16">
  <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8">

    {[
      {
        title: "Case-Specific Training",
        desc: "Get unique answers to commonly asked questions based on your case.",
      },
      {
        title: "Video Call Session",
        desc: "One-on-one call with visa experts through Google Meet. Emulate the real visa interview.",
      },
      {
        title: "Multiple Rounds of Testing",
        desc: "Our visa experts conduct multiple rounds of tailored interviews to ensure your success.",
      },
      {
        title: "Post Training Support",
        desc: "Contact us on WhatsApp, and our visa experts will readily assist you even after your mock interview.",
      },
    ].map((item, i) => (
      <div
        key={i}
        className="bg-[#f7f4ef] border-2 border-yellow-300 p-6 rounded-xl"
      >
        <h4
          className={`font-semibold mb-2 ${
            i === 0 ? "text-black" : "text-gray-700"
          }`}
        >
          {item.title}
        </h4>

        <p className="text-sm text-gray-600">
          {item.desc}
        </p>
      </div>
    ))}

  </div>
</section>

      {/* ================= SUCCESS ================= */}
    <section className="px-6 md:px-16 pb-20">
  <div className="max-w-6xl mx-auto relative rounded-xl overflow-hidden">

    {/* Background Image */}
    <div className="bg-[url('/usa.jpg')] bg-cover bg-center h-64"></div>

    {/* Dark Overlay */}
    <div className="absolute inset-0 bg-black/50"></div>

    {/* Content */}
    <div className="absolute inset-0 flex items-center justify-between px-8 text-white">

      {/* Left */}
      <div>
        <h3 className="text-2xl md:text-3xl font-semibold mb-2">
          Success Rate
        </h3>

        <p className="text-sm md:text-base max-w-md">
          Our approach has been successful in helping candidates ace their visa interview.
        </p>
      </div>

      {/* Right */}
      <div className="text-4xl md:text-5xl font-bold text-yellow-400">
        98.7%
      </div>

    </div>
  </div>
</section>

    </div>
  );
}
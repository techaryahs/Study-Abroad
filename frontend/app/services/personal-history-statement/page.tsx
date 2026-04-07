"use client";
import Image from "next/image";
import { FaWhatsapp } from "react-icons/fa";
import { useState } from "react";
import AddToCart from "@/components/shared/AddToCart";
import DiscussionSection from "@/components/shared/DiscussionSection";

export default function PersonalHistoryStatementPage() {

  return (
<<<<<<< HEAD
    <div className="bg-black text-white relative overflow-hidden">
  
  {/* Golden Glow Effect */}
  <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-yellow-500 opacity-20 blur-[120px] rounded-full"></div>

  {/* HERO SECTION */}
  <section className="relative max-w-7xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-10 items-center">

    {/* Left Content */}
    <div className="relative z-10">
      <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
        PERSONAL HISTORY <br /> STATEMENT
      </h1>

      <p className="text-lg text-gray-300 mb-6">
        The <span className="font-semibold text-white">Personal History Statement</span>{" "}
        (aka <span className="font-semibold text-white">Diversity Statement</span>)
        reflects your ability to connect the barriers you have overcome in
        the past to your current interest in the program.
      </p>

      {/* Icons */}
      <div className="flex gap-6 mb-6">
        <div className="flex flex-col items-center">
          <div className="bg-white/10 p-3 rounded-full">📞</div>
          <span className="text-sm mt-2 text-gray-300">Audio call</span>
        </div>

        <div className="flex flex-col items-center">
          <div className="bg-green-600 p-3 rounded-full">💬</div>
          <span className="text-sm mt-2 text-gray-300">Text Support</span>
        </div>
      </div>

          {/* CTA */}
         <div className="relative inline-block">
  
  {/* Main Button */}
  <button
    onClick={() => setShowOptions(!showOptions)}
    className="border border-yellow-500 px-6 py-3 rounded-lg text-white hover:bg-yellow-500 hover:text-black transition"
  >
    Discuss Your Case
  </button>

  <p className="text-sm text-gray-400 mt-2">
    Have questions about this service? Let's chat.
  </p>

  {showOptions && (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">

      {/* Modal Box */}
      <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl w-[90%] max-w-md p-6 relative shadow-2xl text-white">

        {/* Close Button */}
        <button
          onClick={() => setShowOptions(false)}
          className="absolute top-3 right-4 text-gray-300 text-xl hover:text-white"
        >
          ×
        </button>

        {/* Heading */}
        <h2 className="text-lg font-semibold text-center mb-6">
          Choose a Preferred Communication Method
        </h2>

        {/* Options */}
        <div className="space-y-4">

          {/* WhatsApp */}
          <div
            onClick={() => window.open("https://wa.me/918987654321", "_blank")}
            className="border border-white/20 rounded-lg p-4 hover:bg-white/10 cursor-pointer transition"
          >
            <p className="font-medium text-green-400">WhatsApp</p>
            <p className="text-sm text-gray-400">Chat on WhatsApp</p>
          </div>

          {/* Telegram */}
          <div
            onClick={() => window.open("https://t.me/", "_blank")}
            className="border border-white/20 rounded-lg p-4 hover:bg-white/10 cursor-pointer transition"
          >
            <p className="font-medium text-white">Telegram</p>
            <p className="text-sm text-gray-400">Continue on Telegram</p>
          </div>

          {/* Email */}
          <div
            onClick={() =>
              window.open(
                "https://mail.google.com/mail/?view=cm&fs=1&to=admissions@dralam.com",
                "_blank"
              )
            }
            className="border border-white/20 rounded-lg p-4 hover:bg-white/10 cursor-pointer transition"
          >
            <p className="font-medium text-white">Email</p>
            <p className="text-sm text-gray-400">Continue on Email</p>
          </div>

        </div>

      </div>
    </div>
  )}
</div>
          
    </div>

{/* Right Video */}
<div className="flex justify-center">
  <div className="flex justify-center">
  <Image
    src="/PersonalHistory.jpg"   // 👈 
    alt="Personal History"
    width={700}
    height={700}
    className="rounded-xl w-full max-w-md border border-white/10 object-cover"
  />
</div>
</div>
</section>

{/* ABOUT + SIDEBAR */}
<section className="max-w-7xl mx-auto px-6 py-12 grid md:grid-cols-3 gap-10 text-white">

  {/* LEFT CONTENT */}
  <div className="md:col-span-2">
    <h2 className="text-2xl font-semibold mb-4 border-b border-white/20 pb-2">
      About Service
    </h2>

    <p className="text-gray-300 mb-4">
      While a lot of universities are not interested in knowing about your
      past, a few universities like The University of California asks you
      for a personal statement. Our main aim is to help you stand out by
      crafting a story that is unique to you and your profile.
    </p>

    <p className="text-gray-300 mb-4">
      It is important to focus on the{" "}
      <span className="font-semibold text-white">
        social, economic, familial, financial and cultural barriers
      </span>{" "}
      that you faced during your life. We help highlight your ability to
      overcome challenges.
    </p>

    <p className="font-semibold text-white">
      This draft, when done right, has proved to be one of the biggest
      game-changers, both in fetching admits and funding.
    </p>
  </div>

  {/* RIGHT SIDEBAR CARD */}
  <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6 shadow-xl">

    <h3 className="text-xl font-semibold mb-4 text-center">
      Start Now
    </h3>

    <div className="space-y-3 text-sm text-gray-300">
      <div className="flex justify-between">
        <span className="font-semibold text-white">Services:</span>
        <span>Personal History Statement Drafting</span>
      </div>

      <div className="flex justify-between">
        <span className="font-semibold text-white">Duration:</span>
        <span>2 weeks</span>
      </div>

      <div className="flex justify-between items-center">
        <span className="font-semibold text-white">Currency:</span>

        <select className="bg-black border border-white/20 rounded px-2 py-1 text-sm text-white">
          <option>India (₹ INR)</option>
          <option>United States ($ USD)</option>
        </select>
      </div>

      <div className="flex items-start gap-2 mt-2">
        <input type="checkbox" className="mt-1 accent-yellow-500" />

        <label className="text-sm text-gray-300">
          <span className="font-semibold text-white">Lightning Speed:</span>
          <br />
          Delivered within 3–5 days (25% extra)
        </label>
      </div>
    </div>

    {/* Pricing */}
    <div className="mt-6 border-t border-white/20 pt-4 space-y-2 text-sm">

      <div className="flex justify-between">
        <span className="font-semibold text-white">Actual:</span>
        <span className="text-gray-400 line-through">₹25,759</span>
      </div>

      <div className="flex justify-between">
        <span className="font-semibold text-white">Amount:</span>
        <span className="text-lg font-bold text-yellow-400">
          ₹20,607
        </span>
      </div>

      <div className="flex justify-between">
        <span className="font-semibold text-white">You save:</span>
        <span className="text-green-400">₹5,151</span>
      </div>

      <div className="text-green-400 text-right">
        20% off
      </div>
    </div>

    {/* Buttons */}
    <div className="mt-6 flex gap-3">
      <button className="flex-1 border border-yellow-500 py-2 rounded-lg hover:bg-yellow-500 hover:text-black transition">
        Add to Cart
      </button>

      <button className="flex-1 bg-yellow-500 text-black py-2 rounded-lg hover:bg-yellow-600 transition">
        Buy Now
      </button>
    </div>

    {/* Chat Box */}
    <div className="mt-8 bg-white/5 border border-white/10 rounded-xl p-4 flex items-center gap-4">

      <div className="flex-1">
        <h4 className="text-md font-semibold text-white">
          Discuss Your Case
        </h4>

        <p className="text-sm text-gray-400 mt-1">
          Chat with a team member to see how we can help.
        </p>

        <button className="mt-3 text-yellow-400 font-medium hover:underline">
          Message now →
        </button>
      </div>

      <div className="w-20 h-20 flex-shrink-0">
        <Image
          src="/man_holding_phone.png"
          alt="Chat Support"
          width={80}
          height={80}
          className="rounded-lg object-cover"
        />
      </div>

    </div>
  </div>
</section>
=======
    <div className="w-full bg-white text-gray-800">
      {/* HERO SECTION */}
      <section className="bg-[#fcfcfc] py-16 px-6 md:px-16">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-10 items-center">
          {/* LEFT CONTENT */}
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-black mb-6 uppercase">
              Personal History Statement
            </h1>

            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              The <span className="font-semibold text-black">Personal History Statement</span> (also known as a <span className="font-semibold text-black">Diversity Statement</span>) reflects your ability to connect the barriers you have overcome in the past to your current interest in the program.
            </p>

            <DiscussionSection serviceId="personal-history-statement" />
          </div>

          {/* RIGHT VIDEO */}
          <div className="flex justify-center relative">
            <div className="absolute inset-0 bg-yellow-500/5 blur-3xl rounded-full -z-10"></div>
            <video
              className="rounded-2xl w-full max-w-md shadow-2xl border-4 border-white"
              controls
              autoPlay
              loop
              muted
            >
              <source src="/PersonalHistory.mp4" type="video/mp4" />
            </video>
          </div>
        </div>
      </section>

      {/* ABOUT + SIDEBAR */}
      <section className="max-w-7xl mx-auto px-6 md:px-16 py-20">
        <div className="grid md:grid-cols-3 gap-16">
          {/* LEFT CONTENT */}
          <div className="md:col-span-2 space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-black mb-4 inline-block relative">
                About This Service
                <span className="absolute -bottom-1 left-0 w-1/2 h-1 bg-yellow-500 rounded-full"></span>
              </h2>
            </div>

            <div className="space-y-6 text-gray-600 leading-relaxed text-lg">
              <p>
                While a lot of universities are not interested in knowing about your past, a few prestigious institutions like <span className="font-semibold text-black">The University of California</span> specifically require a Personal History Statement. Our main aim is to help you stand out by crafting a story that is unique to you and your profile.
              </p>

              <p>
                It is important to focus on the <span className="font-semibold text-black italic">social, economic, familial, financial and cultural barriers</span> that you faced during your life. We help highlight your ability to overcome challenges and turn them into strengths.
              </p>

              <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6 rounded-r-xl">
                <p className="font-bold text-gray-900 leading-snug">
                  "This draft, when done right, has proved to be one of the biggest game-changers, both in fetching admits and securing significant funding."
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT SIDEBAR */}
          <div className="space-y-8">
            <div className="w-full sticky top-8">
              <AddToCart serviceId="history-draft" />
              
              {/* <div className="mt-8 bg-black rounded-2xl p-8 shadow-xl border border-white/5">
                <DiscussionSection serviceId="personal-history-statement" />
              </div> */}
            </div>
          </div>
        </div>
      </section>
>>>>>>> 5f5222ebc4dfd8d0983a98e87e6b0ae4c3c4e182
    </div>
  );
}
"use client";
import Image from "next/image";
import Link from "next/link";
import { FaWhatsapp } from "react-icons/fa";
import { useState } from "react";
export default function PersonalHistoryStatementPage() {

  const [showOptions, setShowOptions] = useState(false);
  return (
    <div className="bg-gray-50 text-gray-800">
      {/* HERO SECTION */}
      <section className="max-w-7xl mx-auto px-6 py-12 grid md:grid-cols-2 gap-10 items-center">
        {/* Left Content */}
        <div>
          <h1 className="text-4xl md:text-5xl font-bold text-black mb-4">
  PERSONAL HISTORY <br /> STATEMENT
</h1>

          <p className="text-lg text-gray-600 mb-6">
            The <span className="font-semibold">Personal History Statement</span>{" "}
            (aka <span className="font-semibold">Diversity Statement</span>)
            reflects your ability to connect the barriers you have overcome in
            the past to your current interest in the program.
          </p>

          {/* Icons */}
          <div className="flex gap-6 mb-6">
            <div className="flex flex-col items-center">
              <div className="bg-gray-800 text-white p-3 rounded-full">
                📞
              </div>
              <span className="text-sm mt-2">Audio call</span>
            </div>

            <div className="flex flex-col items-center">
      <div className="bg-green-600 text-white p-3 rounded-full flex items-center justify-center">
    <FaWhatsapp size={20} />
  </div>
  <span className="text-sm mt-2">Text Support</span>
</div>
          </div>

          {/* CTA */}
         <div className="relative inline-block">
  
  {/* Main Button */}
  <button
    onClick={() => setShowOptions(!showOptions)}
    className="border border-yellow-500 px-6 py-3 rounded-lg hover:bg-yellow-500 hover:text-white transition"
  >
    Discuss Your Case
  </button>
  <p className="text-sm text-gray-500">
                Have questions about this service? Let's chat.
              </p>

               {showOptions && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">

    {/* Modal Box */}
    <div className="bg-white rounded-xl w-[90%] max-w-md p-6 relative shadow-lg">

      {/* Close Button */}
       <button
              onClick={() => setShowOptions(false)}
              className="absolute top-3 right-4 text-gray-600 text-xl"
            >
              ×
            </button>
        
        {/* Heading */}
            <h2 className="text-lg font-semibold text-center mb-6 text-black">
              Choose a Preferred Communication Method to Continue
            </h2>

      

      {/* Options */}
      <div className="space-y-4">

        {/* WhatsApp */}
        <div
          onClick={() => window.open("https://wa.me/918987654321", "_blank")}
          className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer"
        >
          <p className="font-medium text-green-600">WhatsApp</p>
          <p className="text-sm text-gray-500">Chat on WhatsApp</p>
        </div>

        {/* Telegram */}
        <div
          onClick={() => window.open("https://t.me/", "_blank")}
          className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer"
        >
          <p className="font-medium">Telegram</p>
          <p className="text-sm text-gray-500">Continue on Telegram</p>
        </div>

        {/* Email */}
    <div
  onClick={() =>
    window.open(
      "https://mail.google.com/mail/?view=cm&fs=1&to=harshalisanap0902@gmail.com",
      "_blank"
    )
  }
  className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer"
>
  <p className="font-medium">Email</p>
  <p className="text-sm text-gray-500">
    Continue on Email
  </p>
</div>

      </div>

    </div>
  </div>
)}


</div>
          
        </div>

        {/* Right Image */}
       <div className="flex justify-center">
  <video
    className="rounded-xl w-full max-w-md"
    controls
    autoPlay
    loop
    muted
  >
    <source src="/PersonalHistory.mp4" type="video/mp4" />
    Your browser does not support the video tag.
  </video>
</div>
      </section>

      {/* ABOUT + SIDEBAR */}
      <section className="max-w-7xl mx-auto px-6 py-12 grid md:grid-cols-3 gap-10">
        {/* LEFT CONTENT */}
        <div className="md:col-span-2">
        <h2 className="text-2xl font-semibold text-black mb-4 border-b pb-2">
  About Service
</h2>

          <p className="text-gray-600 mb-4">
            While a lot of universities are not interested in knowing about your
            past, a few universities like The University of California asks you
            for a personal statement. Our main aim is to help you stand out by
            crafting a story that is unique to you and your profile.
          </p>

          <p className="text-gray-600 mb-4">
            It is important to focus on the{" "}
            <span className="font-semibold">
              social, economic, familial, financial and cultural barriers
            </span>{" "}
            that you faced during your life. We help highlight your ability to
            overcome challenges.
          </p>

          <p className="font-semibold text-gray-800">
            This draft, when done right, has proved to be one of the biggest
            game-changers, both in fetching admits and funding.
          </p>
        </div>

        {/* RIGHT SIDEBAR CARD */}
        <div className="bg-white rounded-xl shadow-md p-6 border">
       <h3 className="text-xl font-semibold !text-black mb-4 text-center">
  Start Now
</h3>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="font-semibold text-black">Services:</span>
              <span>Personal History Statement Drafting</span>
            </div>
            <div className="flex justify-between">
    <span className="font-semibold text-black">Duration:</span>
    <span>2 weeks</span>
  </div>
            <div className="flex justify-between items-center">
  <span className="font-semibold text-black">Currency:</span>

  <select
    className="border rounded px-2 py-1 text-sm"
    defaultValue="INR"
  >
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
<div className="flex items-start gap-2 mt-2">
  <input
    type="checkbox"
    id="lightning"
    className="mt-1"
  />

  <label htmlFor="lightning" className="text-sm">
    <span className="font-semibold text-black">Lightning Speed:</span>
    <br />
    Skip the queue - Delivered within 3-5 days for a 25% surcharge
  </label>
</div>
          </div>

        <div className="mt-6 border-t pt-4 space-y-2 text-sm">

  {/* Actual Amount */}
  <div className="flex justify-between">
    <span className="font-semibold text-black">Actual Amount:</span>
    <span className="text-gray-500 line-through">
      INR 25,759.00
    </span>
  </div>

  {/* Final Amount */}
  <div className="flex justify-between">
    <span className="font-semibold text-black">Amount:</span>
    <span className="text-lg font-bold text-red-500">
      INR 20,607.25
    </span>
  </div>

  {/* Savings */}
  <div className="flex justify-between">
    <span className="font-semibold text-black">You save:</span>
    <span className="text-green-600">
      INR 5,151.75
    </span>
  </div>

  {/* Discount */}
  <div className="text-green-600 text-right">
    20% off
  </div>

</div>

          {/* Buttons */}
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
          <div className="mt-8 bg-gray-50 rounded-xl p-4 flex items-center gap-4">
  
  {/* Left Content */}
  <div className="flex-1">
    <h4 className="text-md font-semibold text-black">
      Discuss Your Case
    </h4>

    <p className="text-sm text-gray-600 mt-1">
      Chat with a team member to see how we can help.
    </p>

   <button
  onClick={() => {
    window.open("https://wa.me/+918987654321", "_blank");
  }}
  className="mt-3 text-yellow-600 font-medium hover:underline"
>
  Message now →
</button>
  </div>

  {/* Right Image */}
  <div className="w-20 h-20 flex-shrink-0">
    <Image
      src="/man_holding_phone.png" // 👈 add your image in public folder
      alt="Chat Support"
      width={80}
      height={80}
      className="rounded-lg object-cover"
    />
  </div>

</div>
        </div>
      </section>
    </div>
    
  );
}
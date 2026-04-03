"use client";
import Image from "next/image";
import Link from "next/link";
import { FaWhatsapp } from "react-icons/fa";
import { useState } from "react";

export default function ResumeDraftingPage() {
    const [showOptions, setShowOptions] = useState(false);
  return (
    <div className="w-full bg-white text-gray-800">
      {/* HERO SECTION */}
      <section className="bg-[#f7f4ef] py-16 px-6 md:px-16">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-10 items-center">
          
          {/* LEFT */}
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-black">
              LETTER OF RECOMMENDATION DRAFTING
            </h1>

            <p className="text-lg mb-6">
             Little known is the art of writing exactly what the admissions committee wants to see in an applicant. This can be more impacting than your SOP if done right.
            </p>

            {/* FEATURES */}
            <div className="flex gap-10 mb-6">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-gray-800 text-white flex items-center justify-center">
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
            <div className="flex items-center gap-6">
            <button
  onClick={() => setShowOptions(true)}
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

          {/* RIGHT IMAGE */}
          <div className="flex justify-center">
            <video
    src="/LOR.mp4"
    autoPlay
    muted
    loop
    controls
    className="rounded-xl w-full max-w-md shadow"
  />
          </div>
        </div>
      </section>

      {/* ABOUT + SIDEBAR */}
      <section className="py-16 px-6 md:px-16">
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-10">
          
          {/* LEFT CONTENT */}
          <div className="md:col-span-2">
            <h2 className="text-2xl font-semibold mb-4 border-b-2 border-yellow-500 inline-block text-black">
  About Service
</h2>

            <div className="space-y-5 text-gray-600 leading-relaxed mt-6">
              <p>
               Letters of Recommendation (LORs) are the documents that undeniably hold the most importance in your application. However, it is not that simple. These can either be the least influential documents or the only documents you need to secure that admit. If done right, they are the most important tool in your arsenal. Yes, even more critical than your SOP. Now, the reason that these are undermined is that most LORs I see are crafted to fall in the former category: the least influential documents in your application, which means you have wasted the only chance you had at winning the committee's support.

Think about it. You are on the admissions committee. Would you put your faith in a random applicant or rather believe a professor or someone you know/follow from the same profession. It is that simple. Most LORs are general and are centered around the following statement: "Mr. X was the absolute best student in my class and he always completed his work in advance. He even asked me for more work and assignments while the other students struggled to complete their work. Moreover, he is an excellent all-rounded individual who also organized some of the most memorable events at our university."

What a load of crap! No one cares. That cannot be the reason I would possibly give you an admit. You wouldn't give yourself an admit based on that either. Yet, most LORs I see are generic and based on the same idea.

This service will also include recommendations on who you should take your letters from, given that you are only allowed to choose a limited number of recommenders. All of this will vary based on your profile, degree, and your network
              </p>

             

              <p className="font-semibold text-gray-800">
                Looking to really stand out? We have the secrets to creating STRONG LORs that cater to the international recommender standards. Book your drafts now!
              </p>

             
            </div>

            {/* SAMPLE OUTPUT */}
           
          </div>

          {/* RIGHT SIDEBAR */}
          <div className="space-y-6">
            {/* CARD */}
            <div className="border rounded-xl p-6 shadow-sm">
           <h3 className="text-lg font-semibold mb-4 text-black text-center">
          Start Now
            </h3>
              
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  
                </div>

                <div className="flex justify-between">
                  <span className="font-semibold text-black">Duration:</span>
                  <span>1-1.5 weeks</span>
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

  <div className="mb-4 flex items-center gap-26">

   {/* Label */}
  <label className="text-sm font-medium whitespace-nowrap">
    LORs:
  </label>

  {/* Dropdown */}
  <select className="w-56 border border-black-300 rounded-md px-3 py-2 text-sm text-gray-600 ">
    <option value="">Number of LORs</option>
    <option value="1">1 LOR</option>
    <option value="2">2 LORs</option>
    <option value="3">3 LORs</option>
    <option value="4">4 LORs</option>
    <option value="5">5 LORs</option>
  </select>

</div>          
{/* LIGHTNING SPEED */}
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


{/* AMOUNT */}
<div className="mt-4">
  <p className="font-semibold text-black">Amount:</p>
</div>

<div>
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
</div>

{/* LOGIN BUTTON */}

    </div>
            </div>

            {/* CHAT BOX */}
            <div className="border rounded-xl p-4 flex items-center gap-4">
              <Image
                src="/man_holding_phone.png"
                alt="chat"
                width={60}
                height={60}
                className="rounded-full"
              />

              <div>
                <p className="font-medium">Discuss Your Case</p>
                <p className="text-sm text-gray-500">
                  Chat with a team member to see how we can help.
                </p>
                 <button
  onClick={() => {
    window.open("https://wa.me/+918987654321", "_blank");
  }}
  className="mt-3 text-yellow-600 font-medium hover:underline">
  Message now →
</button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
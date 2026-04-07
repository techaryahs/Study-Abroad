"use client";
import Image from "next/image";
import Link from "next/link";
import { FaWhatsapp } from "react-icons/fa";
import { useState } from "react";

export default function ResumeDraftingPage() {
  const [showOptions, setShowOptions] = useState(false);

  return (
    <div className="w-full bg-black text-white">
      
      {/* HERO SECTION */}
      <section className="bg-black py-16 px-6 md:px-16">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-10 items-center">
          
          {/* LEFT */}
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-white">
              RESUME DRAFTING
            </h1>

            <p className="text-lg mb-6 text-gray-300">
              Learn the secret to a perfect resume that will truly set you apart
              from any other applicant that you compete with.
            </p>

            {/* FEATURES */}
            <div className="flex gap-10 mb-6">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-white/10 text-white flex items-center justify-center">
                  📞
                </div>
                <span className="text-sm mt-2 text-gray-400">Audio call</span>
              </div>

              <div className="flex flex-col items-center">
                <div className="bg-green-600 text-white p-3 rounded-full flex items-center justify-center">
                  <FaWhatsapp size={20} />
                </div>
                <span className="text-sm mt-2 text-gray-400">Text Support</span>
              </div>
            </div>




            {/* CTA */}
            <div className="flex items-center gap-6">
              <button
                onClick={() => setShowOptions(!showOptions)}
                className="border border-yellow-500 px-6 py-3 rounded-lg text-white hover:bg-yellow-500 hover:text-black transition"
              >
                Discuss Your Case
              </button>

              <p className="text-sm text-gray-400">
                Have questions about this service? Let's chat.
              </p>

              {showOptions && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">

                  <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl w-[90%] max-w-md p-6 relative shadow-lg text-white">

                    <button
                      onClick={() => setShowOptions(false)}
                      className="absolute top-3 right-4 text-gray-300 text-xl"
                    >
                      ×
                    </button>

                    <h2 className="text-lg font-semibold text-center mb-6">
                      Choose a Preferred Communication Method
                    </h2>

                    <div className="space-y-4">

                      <div
                        onClick={() => window.open("https://wa.me/918987654321", "_blank")}
                        className="border border-white/20 rounded-lg p-4 hover:bg-white/10 cursor-pointer"
                      >
                        <p className="font-medium text-green-400">WhatsApp</p>
                        <p className="text-sm text-gray-400">Chat on WhatsApp</p>
                      </div>

                      <div
                        onClick={() => window.open("https://t.me/", "_blank")}
                        className="border border-white/20 rounded-lg p-4 hover:bg-white/10 cursor-pointer"
                      >
                        <p className="font-medium text-white">Telegram</p>
                        <p className="text-sm text-gray-400">Continue on Telegram</p>
                      </div>

                      <div
                        onClick={() =>
                          window.open(
                            "https://mail.google.com/mail/?view=cm&fs=1&to=admissions@dralam.com",
                            "_blank"
                          )
                        }
                        className="border border-white/20 rounded-lg p-4 hover:bg-white/10 cursor-pointer"
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

          {/* RIGHT VIDEO */}
          <div className="flex justify-center">
              <Image
               src="/resumee.jpg"   
               alt="LOR Preview"
               width={500}
               height={500}
               className="rounded-xl w-full max-w-md shadow border border-white/10"
             />
          </div>
        </div>
      </section>

      {/* ABOUT + SIDEBAR */}
      <section className="py-16 px-6 md:px-16">
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-10">
          
          {/* LEFT CONTENT */}
          <div className="md:col-span-2">
            <h2 className="text-2xl font-semibold mb-4 border-b border-white/20 pb-2 text-white">
              About Service
            </h2>

            <div className="space-y-5 text-gray-300 leading-relaxed mt-6">
              <p>
                It is extremely critical to have an eye-catching one-page resume
                unless you have an industry experience of over 5 years. When an
                employer looks at my resume, he is usually amazed by the
                conciseness, organization, and pertinence of the content.
              </p>

              <p className="space-y-5 text-gray-300 leading-relaxed mt-6">
                While the Statement of Purpose covers the most career-shaping
                experiences, the resume provides insights into your professional
                experience as a subject-matter expert.
              </p>

              <p className="space-y-5 text-gray-300 leading-relaxed mt-6">
                A well-crafted draft can boost your chances of bagging admits and
                scholarships by over 18%.
              </p>

              <p>
                An average employer looks at a resume for less than 10 seconds.
                With a stellar resume, an employer is bound to give your
                application more attention than your competitors.
              </p>
            </div>

            {/* SAMPLE OUTPUT */}
         <div className="mt-10">
  <h3 className="font-semibold mb-4 text-white">
    Sample Output:
  </h3>

              <div className="border border-white/10 rounded-xl overflow-hidden shadow-lg bg-white/5 backdrop-blur-sm">

                <Image
      src="/sample-resume.avif"
      alt="Sample resume"
      width={800}
      height={600}
      className="w-full hover:scale-105 transition duration-500"
    />
              </div>
            </div>
          </div>

          {/* RIGHT SIDEBAR */}
          <div className="space-y-6">
            {/* CARD */}
             <div className="bg-black/40 backdrop-blur-xl border border-white/20 rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-4 text-white text-center">
              Start Now
            </h3>
              
             <div className="space-y-3 text-sm text-gray-300">
              <div className="flex justify-between">
                <span className="font-semibold text-gray-400">Services:</span>
                <span className="text-white">Resume Help</span>
              </div>

                <div className="flex justify-between">
                  <span className="font-semibold text-gray-400">Duration:</span>
                  <span className="text-white">1-1.5 weeks</span>
                </div>
<div className="flex justify-between items-center">
  <span className="font-semibold text-gray-400">Currency:</span>

  <select
    className="text-gray"
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
              
{/* LIGHTNING SPEED */}
<div className="flex items-start gap-2 mt-2">
  <input
    type="checkbox"
    id="lightning"
    className="mt-1 accent-yellow-500"
  />

  <label htmlFor="lightning" className="text-sm text-gray-300">
    <span className="font-semibold text-white">Lightning Speed:</span>
    <br />
    Skip the queue - Delivered within 3-5 days for a 25% surcharge
  </label>
</div>




 <div className="flex justify-between">
  <span className="font-semibold text-gray-300">Actual Amount:</span>
  <span className="text-gray-500 line-through">
    INR 20,321.00
  </span>
</div>
  {/* AMOUNT */}
  
 <div className="flex justify-between">
  <span className="font-semibold text-gray-300">Amount:</span>
  <span className="text-lg font-bold text-yellow-400">
    INR 16,256.25
  </span>
</div>
{/* Savings */}
<div className="flex justify-between">
  <span className="font-semibold text-gray-300">You save:</span>
  <span className="text-green-400">
    INR 4,064.42
  </span>
</div>

   
  
{/* Discount */}
<div className="text-green-400 text-right">
  20% off
</div>
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
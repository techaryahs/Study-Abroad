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
              RESUME DRAFTING
            </h1>

            <p className="text-lg mb-6">
              Learn the secret to a perfect resume that will truly set you apart
              from any other applicant that you compete with.
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
    onClick={() => setShowOptions(!showOptions)}
    className="border border-yellow-500 px-6 py-3 rounded-lg hover:bg-yellow-500 hover:text-white transition" >
    Discuss Your Case
  </button>
  

              <p className="text-sm text-gray-500">
                Have questions about this service? Let's chat.
              </p>
               {/* Dropdown */}
  {showOptions && (
    <div className="absolute mt-2 w-52 bg-white border rounded-lg shadow-md p-2 z-10">
      
      {/* WhatsApp */}
      <button
        onClick={() =>
          window.open("https://wa.me/918987654321", "_blank")
        }
        className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded"
      >
         Chat on WhatsApp
      </button>

     </div>
  )}
</div>
            
          </div>

          {/* RIGHT IMAGE */}
          <div className="flex justify-center">
            <video
    src="/ResumeDrafting.mp4"
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
                It is extremely critical to have an eye-catching one-page resume
                unless you have an industry experience of over 5 years. When an
                employer looks at my resume, he is usually amazed by the
                conciseness, organization, and pertinence of the content.
              </p>

              <p>
                While the Statement of Purpose covers the most career-shaping
                experiences, the resume provides insights into your professional
                experience as a subject-matter expert.
              </p>

              <p className="font-semibold text-gray-800">
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
              <h3 className="font-semibold mb-4">Sample Output:</h3>

              <div className="border rounded-lg overflow-hidden shadow">
                <Image
                   src="/sample-resume.avif"
                  alt="Sample resume"
                  width={800}
                  height={600}
                  className="w-full"
                />
              </div>
            </div>
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
                  <span className="font-semibold text-black">Services:</span>
                  <span>Resume Help</span>
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

{/* LOGIN BUTTON */}
<div className="flex justify-center mt-4">
  <button className="bg-green-500 text-white px-8 py-3 rounded-full font-medium hover:bg-green-600 transition">
    Log In To Pay
  </button>
</div>
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
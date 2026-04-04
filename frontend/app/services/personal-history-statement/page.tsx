"use client";
import Image from "next/image";
import { FaWhatsapp } from "react-icons/fa";
import { useState } from "react";
import AddToCart from "@/components/shared/AddToCart";

export default function PersonalHistoryStatementPage() {
  const [showOptions, setShowOptions] = useState(false);

  return (
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

            {/* FEATURES */}
            <div className="flex gap-10 mb-8">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-gray-800 text-white flex items-center justify-center text-xl shadow-lg">
                  📞
                </div>
                <span className="text-sm mt-3 font-medium text-gray-700">Audio call</span>
              </div>

              <div className="flex flex-col items-center">
                <div className="bg-green-600 text-white p-3 rounded-full flex items-center justify-center shadow-lg">
                  <FaWhatsapp size={24} />
                </div>
                <span className="text-sm mt-3 font-medium text-gray-700">Text Support</span>
              </div>
            </div>

            {/* CTA */}
            <div className="flex flex-wrap items-center gap-6">
              <button
                onClick={() => setShowOptions(true)}
                className="border-2 border-yellow-500 px-8 py-3 rounded-lg hover:bg-yellow-500 hover:text-white transition duration-300 font-bold text-yellow-600 uppercase tracking-wide"
              >
                Discuss Your Case
              </button>

              <div className="flex flex-col">
                <p className="text-sm text-gray-500 font-medium italic">
                  Have questions about this service?
                </p>
                <p className="text-sm text-gray-400">Let's chat with an expert.</p>
              </div>

              {showOptions && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
                  <div className="bg-white rounded-2xl w-full max-w-md p-8 relative shadow-2xl animate-in fade-in zoom-in duration-300">
                    <button
                      onClick={() => setShowOptions(false)}
                      className="absolute top-4 right-5 text-gray-400 hover:text-black text-2xl transition"
                    >
                      ×
                    </button>
                    <h2 className="text-xl font-bold text-center mb-8 text-black">
                      Choose a Communication Method
                    </h2>
                    <div className="space-y-4">
                      <div
                        onClick={() => window.open("https://wa.me/918987654321", "_blank")}
                        className="flex items-center gap-4 border-2 border-green-50 rounded-xl p-4 hover:border-green-500 hover:bg-green-50 transition cursor-pointer group"
                      >
                        <div className="bg-green-100 p-2 rounded-full group-hover:bg-green-500 group-hover:text-white transition">
                           <FaWhatsapp size={20} />
                        </div>
                        <div>
                          <p className="font-bold text-green-700">WhatsApp</p>
                          <p className="text-xs text-gray-500 font-medium leading-none mt-1">Instant chat with our team</p>
                        </div>
                      </div>
                      
                      <div
                        onClick={() => window.open("https://mail.google.com/mail/?view=cm&fs=1&to=harshalisanap0902@gmail.com", "_blank")}
                        className="flex items-center gap-4 border-2 border-blue-50 rounded-xl p-4 hover:border-blue-500 hover:bg-blue-50 transition cursor-pointer group"
                      >
                        <div className="bg-blue-100 p-2 rounded-full group-hover:bg-blue-500 group-hover:text-white transition">
                           📧
                        </div>
                        <div>
                          <p className="font-bold text-blue-700">Email Support</p>
                          <p className="text-xs text-gray-500 font-medium leading-none mt-1">For detailed inquiries</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
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
              
              <div className="mt-8 bg-black rounded-2xl p-6 flex items-center gap-5 shadow-xl">
                <div className="relative">
                  <Image
                    src="/man_holding_phone.png"
                    alt="Chat Support"
                    width={70}
                    height={70}
                    className="rounded-xl object-cover border-2 border-yellow-500/30"
                  />
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-black rounded-full"></div>
                </div>
                
                <div className="flex-1">
                  <h4 className="text-sm font-bold text-white mb-1 uppercase tracking-tight">
                    Discuss Your Case
                  </h4>
                  <p className="text-[11px] text-gray-400 leading-tight mb-3">
                    Personalized consultation with our strategy experts.
                  </p>
                  <button
                    onClick={() => window.open("https://wa.me/+918987654321", "_blank")}
                    className="flex items-center gap-2 text-yellow-500 text-xs font-black uppercase tracking-widest hover:text-yellow-400 transition group"
                  >
                    Chat Now <span className="group-hover:translate-x-1 transition">→</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
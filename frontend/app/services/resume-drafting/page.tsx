"use client";
import Image from "next/image";
import { FaWhatsapp } from "react-icons/fa";
import { useState } from "react";
import AddToCart from "@/components/shared/AddToCart";

export default function ResumeDraftingPage() {
  const [showOptions, setShowOptions] = useState(false);

  return (
    <div className="w-full bg-white text-gray-800">
      {/* HERO SECTION */}
      <section className="bg-[#fcfcfc] py-16 px-6 md:px-16 border-b">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-10 items-center">
          {/* LEFT CONTENT */}
          <div>
            <h1 className="text-4xl md:text-5xl font-black text-black mb-6 uppercase tracking-tight">
              Resume Drafting
            </h1>

            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              Learn the secret to a perfect resume that will truly set you apart from any other applicant that you compete with. Our expert drafts are optimized for international standards.
            </p>

            {/* FEATURES */}
            <div className="flex gap-10 mb-8">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-gray-900 text-white flex items-center justify-center text-xl shadow-lg ring-4 ring-gray-50">
                  📞
                </div>
                <span className="text-xs mt-3 font-bold text-gray-500 uppercase tracking-widest">Audio call</span>
              </div>

              <div className="flex flex-col items-center">
                <div className="bg-green-600 text-white p-3 rounded-full flex items-center justify-center shadow-lg ring-4 ring-green-50">
                  <FaWhatsapp size={24} />
                </div>
                <span className="text-xs mt-3 font-bold text-gray-500 uppercase tracking-widest">Text Support</span>
              </div>
            </div>

            {/* CTA */}
            <div className="flex flex-wrap items-center gap-6">
              <button
                onClick={() => setShowOptions(true)}
                className="bg-yellow-500 text-black px-8 py-4 rounded-xl hover:bg-black hover:text-white transition-all duration-300 font-black uppercase tracking-widest shadow-xl shadow-yellow-500/20"
              >
                Discuss Your Case
              </button>

              <div className="text-sm font-medium text-gray-400 italic">
                Questions? <span className="text-yellow-600 not-italic font-bold">Chat with us.</span>
              </div>

              {showOptions && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md px-4">
                  <div className="bg-white rounded-3xl w-full max-w-md p-8 relative shadow-2xl animate-in fade-in zoom-in duration-300 border border-gray-100">
                    <button
                      onClick={() => setShowOptions(false)}
                      className="absolute top-5 right-6 text-gray-400 hover:text-black text-2xl transition"
                    >
                      ×
                    </button>
                    <h2 className="text-2xl font-black text-center mb-8 text-black uppercase tracking-tighter">
                      Connect With Us
                    </h2>
                    <div className="space-y-4">
                      <div
                        onClick={() => window.open("https://wa.me/918987654321", "_blank")}
                        className="flex items-center gap-5 border-2 border-green-50 rounded-2xl p-5 hover:border-green-500 hover:bg-green-50 transition cursor-pointer group"
                      >
                        <div className="bg-green-100 p-3 rounded-full group-hover:bg-green-500 group-hover:text-white transition">
                           <FaWhatsapp size={24} />
                        </div>
                        <div>
                          <p className="font-black text-green-700 tracking-tight">WhatsApp</p>
                          <p className="text-xs text-gray-400 font-bold uppercase mt-1">Instant Strategy</p>
                        </div>
                      </div>
                      
                      <div
                        onClick={() => window.open("https://mail.google.com/mail/?view=cm&fs=1&to=harshalisanap0902@gmail.com", "_blank")}
                        className="flex items-center gap-5 border-2 border-gray-50 rounded-2xl p-5 hover:border-black hover:bg-gray-50 transition cursor-pointer group"
                      >
                        <div className="bg-gray-100 p-3 rounded-full group-hover:bg-black group-hover:text-white transition text-xl">
                           📧
                        </div>
                        <div>
                          <p className="font-black text-gray-900 tracking-tight">Email Support</p>
                          <p className="text-xs text-gray-400 font-bold uppercase mt-1">Detailed Queries</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT VIDEO */}
          <div className="flex justify-center">
            <div className="relative group">
              <div className="absolute -inset-4 bg-yellow-500/10 rounded-[3rem] blur-2xl group-hover:bg-yellow-500/20 transition duration-500"></div>
              <video
                className="rounded-[2rem] w-full max-w-md shadow-2xl relative border-8 border-white"
                controls
                autoPlay
                loop
                muted
              >
                <source src="/ResumeDrafting.mp4" type="video/mp4" />
              </video>
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT + SIDEBAR */}
      <section className="max-w-7xl mx-auto px-6 md:px-16 py-20">
        <div className="grid md:grid-cols-3 gap-16">
          {/* LEFT CONTENT */}
          <div className="md:col-span-2 space-y-12">
            <div>
              <h2 className="text-3xl font-black text-black mb-6 relative inline-block">
                Service Overview
                <span className="absolute -bottom-2 left-0 w-full h-1.5 bg-yellow-400 rounded-full"></span>
              </h2>
              
              <div className="space-y-6 text-gray-600 leading-relaxed text-lg font-medium">
                <p>
                  It is extremely critical to have an eye-catching one-page resume unless you have an industry experience of over 5 years. When an employer looks at my resume, he is usually amazed by the conciseness, organization, and pertinence of the content.
                </p>

                <p>
                  While the Statement of Purpose covers the most career-shaping experiences, the resume provides insights into your professional experience as a subject-matter expert.
                </p>

                <div className="bg-black text-white p-8 rounded-3xl shadow-2xl border-l-8 border-yellow-500">
                   <p className="text-xl font-bold italic leading-snug">
                    "A well-crafted draft can boost your chances of bagging admits and scholarships by over 18%."
                  </p>
                </div>

                <p>
                  An average employer looks at a resume for less than 10 seconds. With a stellar resume, an employer is bound to give your application more attention than your competitors.
                </p>
              </div>
            </div>

            {/* SAMPLE OUTPUT */}
            <div className="pt-8">
              <h3 className="text-xl font-black text-black mb-6 uppercase tracking-widest flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-yellow-500 flex items-center justify-center text-sm">✓</span>
                Sample Output
              </h3>

              <div className="border-4 border-gray-50 rounded-[2rem] overflow-hidden shadow-2xl group cursor-zoom-in">
                <Image
                  src="/sample-resume.avif"
                  alt="Sample resume"
                  width={800}
                  height={1000}
                  className="w-full transition duration-500 group-hover:scale-105"
                />
              </div>
            </div>
          </div>

          {/* RIGHT SIDEBAR */}
          <div className="space-y-8">
            <div className="w-full sticky top-8">
              <AddToCart serviceId="resume-drafting" />
              
              <div className="mt-8 bg-black rounded-3xl p-8 flex flex-col gap-6 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                
                <div className="flex items-center gap-6 relative">
                  <div className="relative">
                    <Image
                      src="/man_holding_phone.png"
                      alt="Chat Support"
                      width={80}
                      height={80}
                      className="rounded-2xl object-cover border-2 border-yellow-500/50"
                    />
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-4 border-black rounded-full"></div>
                  </div>
                  
                  <div className="flex-1">
                    <h4 className="text-lg font-black text-white mb-1 tracking-tighter">
                      Discuss Your Case
                    </h4>
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-widest leading-tight">
                      Expert Consultation
                    </p>
                  </div>
                </div>

                <p className="text-sm text-gray-400 leading-relaxed font-medium">
                  Have specific requirements for your industry? Chat with our team to customize your package.
                </p>
                
                <button
                  onClick={() => window.open("https://wa.me/+918987654321", "_blank")}
                  className="w-full bg-white text-black py-4 rounded-xl font-black uppercase tracking-widest text-xs hover:bg-yellow-500 transition duration-300"
                >
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
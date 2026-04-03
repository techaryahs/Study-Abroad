"use client";

import FAQSection from "@/components/shared/FAQSection";
import AddToCart from "@/components/shared/AddToCart";

export default function Page() {

  return (
    <main className="min-h-screen bg-[#050505] text-white">

      {/* HERO */}
      <section className="px-6 md:px-20 py-16 grid lg:grid-cols-2 gap-12 items-center">

        <div>
          <h1 className="text-5xl md:text-6xl font-black mb-6">
            COVER LETTER <br />
            <span className="text-[#c6a96b] italic">DRAFTING</span>
          </h1>

          <p className="text-white/70 mb-8 max-w-xl">
            Command the attention of top recruiters with a cover letter that makes lasting impressions.
            Infuse our professional writing to stand out in today’s competitive job market.
          </p>

          {/* FEATURES */}
          <div className="flex gap-10 mb-8">
            <div className="text-center">
              <div className="text-2xl">📞</div>
              <p className="text-sm text-white/60">Audio call</p>
            </div>
            <div className="text-center">
              <div className="text-2xl">💬</div>
              <p className="text-sm text-white/60">Text Support</p>
            </div>
          </div>

          <button className="bg-[#c6a96b] text-black px-8 py-3 rounded-lg font-bold">
            Discuss Your Case
          </button>
        </div>

        {/* RIGHT */}
        <div className="w-[90%] mx-auto rounded-2xl overflow-hidden border border-[#c6a96b]/20">
          <video
            src="/application1.mp4"
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-[350px] object-cover"
          />
        </div>
      </section>

      {/* CONTENT */}
      <section className="px-6 md:px-20 grid lg:grid-cols-3 gap-12 py-16">

        <div className="lg:col-span-2">
          <h2 className="text-2xl font-bold mb-6">About Service</h2>

  <p className="text-white/70 mb-6 leading-relaxed">
    Spotlighting the reasons that make you the perfect fit for a job role is crucial for a successful job application. 
    This is why a cover letter works like a charm. While your resume lists down your past experiences, job responsibilities, 
    and accomplishments; the cover letter is all about why you are a good fit for the applied position. 
    This letter usually works as a precursor to your resume that can compound your chances of selection positively or negatively. 
    We can help you play your cards right with a powerful cover letter tailored for the job role you are applying for.
  </p>

  {/* FOCAL ELEMENTS */}
  <h3 className="text-lg font-semibold mb-3 text-[#c6a96b]">
    The focal elements of our cover letters include:
  </h3>

          <ul className="list-disc pl-6 text-white/70 space-y-2 mb-6">
            <li>Crafting a compelling introduction</li>
            <li>Developing a personalized description of your interest in the applied job role</li>
            <li>Highlighting your top skills relevant to the position</li>
            <li>Explanation of industry switch, if required</li>
            <li>Aligning your personal goals with the position and organizational goals</li>
            <li>Call to action</li>
          </ul>

          <p className="text-white/70 mb-6 leading-relaxed">
            The write up is checked using Turnitin Instructor-level software and Grammarly Premium,
            so you can be assured that the text would be plagiarism-free and grammatically correct.
          </p>

          {/* PROCESS */}
          <h3 className="text-lg font-semibold mb-3 text-[#c6a96b]">
            The process:
          </h3>

          <ul className="list-disc pl-6 text-white/70 space-y-2">
            <li>We send you a link to a form with the required inputs</li>
            <li>You submit the inputs</li>
            <li>
              We create a base draft for you — a full-fledged draft written from scratch
              for any job role of your choice
            </li>
            <li>
              If required, we customize the draft for other job roles. These customizations
              build on top of your base draft and are more cost-effective
            </li>
          </ul>
        </div>

               <div className="lg:col-span-1 pb-20">
                 <div className="sticky top-28">
                   <AddToCart serviceId="cover-letter" />
                 </div>
               </div>
      </section>

      {/* FAQ */}
      <FAQSection />

    </main>
  );
}
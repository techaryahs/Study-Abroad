"use client";

import FAQSection from "./FAQSection";
import AddToCart from "@/components/shared/AddToCart";
import Link from "next/link";
import DiscussionSection from "@/components/shared/DiscussionSection";

export default function GrePrepPage() {
  return (
    <div>

      {/* ================= GRE SECTION ================= */}
      <div className="bg-[#f5efe3] py-16">
        <div className="max-w-[1200px] mx-auto px-20 flex justify-between items-center gap-16">

          {/* LEFT */}
          <div className="w-[55%]">

            <h1 className="text-[38px] font-extrabold text-black whitespace-nowrap">
              GRE PREP-PLAN BUILDING
            </h1>

            <p className="text-[18px] text-[#1a1a1a] mt-3 leading-7">
              The secret to an excellent GRE score is NOT hard work. I scored{" "}
              <b>329/340</b> and helped thousands do the same. Are you next?
              (Day-by-day schedule)
            </p>

            <DiscussionSection serviceId="gre-prep" />

          </div>

          {/* RIGHT */}
          <div className="w-[40%] flex justify-center">
            <div className="w-full max-w-[420px] rounded-[30px] overflow-hidden bg-[#9fc1bd]">
              <video autoPlay loop muted playsInline className="w-full h-full object-cover rounded-[30px]">
                <source src="/assets/GRE.mp4" type="video/mp4" />
              </video>
            </div>
          </div>

        </div>
      </div>


      {/* ================= ABOUT SECTION ================= */}
      <div className="bg-white py-16 text-black">
        <div className="max-w-[1200px] mx-auto px-20">

          {/* HEADER */}
          <div className="flex flex-col items-center mb-10">
            <h2 className="text-[28px] text-black font-medium">About Service</h2>

            <div className="flex items-center mt-2">
              <div className="w-3 h-3 bg-yellow-400 rotate-45"></div>
              <div className="w-[120px] h-[2px] bg-yellow-400"></div>
            </div>
          </div>

          <div className="flex gap-16 items-start">

            {/* LEFT */}
            <div className="w-[60%] text-black">

              <p><b>My Scores:</b></p>
              <p><b>Verbal:</b> 161/170</p>
              <p><b>Quantitative:</b> 168/170</p>
              <p><b>AWA:</b> 4.5/6</p>

              <p className="mt-4 leading-7">
                Although I have plenty of free content on YouTube, at times it does not cater to the needs of some students.
                If you are struggling to score over 325, I can craft the exact strategy needed for your case.
                Here, you can personally connect with me on a one-on-one basis and I will work with you closely
                in order to hand you the particular strategies that apply to your case.
                We begin by evaluating your weaknesses through a mock test and then creating your schedule
                and recommending the most optimal material in your case.
              </p>

              <p className="mt-4 leading-7">
                Talk to me about the best resources to use, how to use them properly, build your schedule,
                identify new strategies, and build your score during this session.
              </p>

              <p className="mt-4 font-semibold">
                Highly Recommended solution for people who have hit a plateau or have very less time to improve their scores substantially.
              </p>

              <p className="mt-4 font-semibold">The consultation is performed as follows:</p>

              <ul className="mt-2 pl-5 list-disc space-y-2">
                <li>You take a mock test.</li>
                <li>We do a Zoom screen share session where we evaluate your test and how to best help you.</li>
                <li>We build your prep-plan right in front of you and explain it during the session itself.</li>
              </ul>

              <p className="mt-4 font-semibold leading-7">
                In the end, you'll have a day-by-day schedule with tasks to finish each day.
                The schedule will be customized for you so as to spend more time on your weaker areas,
                hence maximizing your performance in the least amount of time.
                You will know exactly which material to study from and the schedule you should follow.
              </p>

            </div>

            {/* RIGHT */}
            <div className="w-[40%] flex flex-col items-end gap-6">

              {/* PRICE CARD */}
              <div className="w-full max-w-[350px]">
                <AddToCart serviceId="gre-prep" />
              </div>

              CHAT CARD
              <div className="bg-white rounded-[20px] p-4 flex gap-4 items-center w-full max-w-[350px] shadow">

                <img src="/assets/man_holding_phone.png" className="w-[100px]" />

                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <img src="/assets/chat-icon3.svg" className="w-[25px]" />
                    <h4 className="font-medium text-black">Discuss Your Case</h4>
                  </div>

                  <p className="text-sm text-gray-600">
                    Chat with a team member to see how we can help.
                  </p>

                  <button className="mt-2 border px-3 py-1 rounded hover:bg-yellow-400 transition">
                   <Link href="/contact">Message now →</Link>
                  </button>
                </div>
              </div>

            </div>

          </div>

        </div>
      </div>


      {/* ================= HELP SECTION ================= */}
      <div className="bg-[#2f3b46] py-16 text-white">
        <div className="max-w-[1200px] mx-auto px-20">

          <div className="text-center mb-10">
            <h2 className="text-[30px]">The Help YOU Need</h2>

            <div className="flex justify-center items-center mt-2">
              <div className="w-[120px] h-[2px] bg-yellow-400"></div>
              <div className="w-3 h-3 bg-yellow-400 rotate-45"></div>
            </div>
          </div>

          <div className="flex items-center justify-between gap-10">

            <p className="text-xl w-1/2 text-center">
              Understand what’s in the service after your purchase.
            </p>

            <div className="w-1/2">
             <iframe width="560" height="315" src="https://www.youtube.com/embed/DUZf0oSEJ0w?si=uZ7Na3IrH1OnyVX4" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>
            </div>

          </div>

        </div>
      </div>


      {/* ================= FAQ ================= */}
      <FAQSection />

    </div>
  );
}
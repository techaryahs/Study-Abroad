"use client";
import FAQSection from "@/components/FAQSection";

export default function UniversityFinalizationPage() {
  return (
    <div>

      {/* ================= HERO SECTION ================= */}
      <div className="bg-[#f5efe3] py-16">
        <div className="max-w-[1200px] mx-auto px-20 flex justify-between items-center gap-16">

          {/* LEFT */}
          <div className="w-[55%]">

            <h1 className="text-[38px] font-extrabold text-black">
              UNIVERSITY FINALIZATION HELP
            </h1>

            <p className="text-[18px] text-[#1a1a1a] mt-4 leading-7">
              Have some of your admits in hand and need help with finalizing on one?
              Now leverage our expertise and get a detailed review of the right pick
              as per your circumstances.
            </p>

            <h4 className="mt-6 mb-2 text-[#333] font-medium">Includes:</h4>

            <div className="flex gap-12 mt-3">

              {/* Audio Call */}
              <div className="text-center">
                <div className="w-[50px] h-[50px] bg-[#2d3748] flex items-center justify-center rounded-full">
                  <img src="/assets/call_icon.svg" className="w-[22px]" />
                </div>
                <p className="text-[13px] text-[#333] mt-1">Audio call</p>
              </div>

              {/* WhatsApp */}
              <div className="text-center">
                <div className="w-[50px] h-[50px] bg-[#2d3748] flex items-center justify-center rounded-full">
                  <img src="/assets/whats_app_icon.png" className="w-[22px]" />
                </div>
                <p className="text-[13px] text-[#333] mt-1">Text Support</p>
              </div>

            </div>

            <div className="mt-8 flex items-center gap-5">
              <button className="bg-yellow-400 text-black px-6 py-3 rounded-lg font-semibold hover:bg-yellow-500 transition">
                Discuss Your Case
              </button>

              <p className="text-[#666] text-sm">
                Have questions about this service? Let's chat.
              </p>
            </div>

          </div>

          {/* RIGHT */}
          <div className="w-[40%] flex justify-center">
            <div className="w-full max-w-[420px] rounded-[30px] overflow-hidden bg-[#9fc1bd]">
              <video autoPlay loop muted playsInline className="w-full h-full object-cover rounded-[30px]">
                <source src="/assets/UniFin.mp4" type="video/mp4" />
              </video>
            </div>
          </div>



        </div>
        {/* ================= ABOUT SECTION ================= */}
<div className="bg-white py-16">

  <div className="max-w-[1200px] mx-auto px-20">

    {/* HEADER */}
    <div className="text-center mb-10">
      <h2 className="text-[32px] font-semibold text-gray-800">
        About Service
      </h2>

      <div className="flex items-center justify-center mt-2 gap-2">
        <div className="w-2 h-2 bg-yellow-500 rotate-45"></div>
        <div className="w-[120px] h-[2px] bg-yellow-500"></div>
      </div>
    </div>

    {/* CONTENT */}
    <div className="flex gap-16 items-start">

      {/* LEFT */}
      <div className="w-[60%] text-gray-800">

        <p className="mb-4">
          <b>Please Note:</b> This service is for finalizing a university when you have multiple admits already.
          If you are in the beginning of your admissions process and need help with shortlisting universities
          for your profile, please look at the{" "}
          <span className="text-blue-600 underline cursor-pointer">
            Profile Evaluation and University Shortlisting Service
          </span>{" "}
          instead.
        </p>

        <p className="mb-4">
          While securing the admits is not an easy process, what comes next can be even more overwhelming for most applicants.
          If you have managed to secure <b>two or more admits</b>, it's time to decide which university you are going to move forward with.
          Remember, you can only pick one at the end of the day.
        </p>

        <p className="mb-4">
          <b>
            Now, there's probably no need to point that its an extremely important decision and your pick will influence your future in almost every possible way.
          </b>{" "}
          On the one hand, you might end up with a job or a research position at the end of your program,
          while on the other hand, you might have few chances of securing one.
          At university A, you might have the edge of the location, but its rank may be much higher than that of university B.
          Should you pick the low-ranked university which offered you a $4,000 scholarship or the better-ranked costlier alternative?
          You may also wonder if the difference in tuition is worth the more expensive program. I could keep going!
          There's no end to the doubts you are facing right now.
        </p>

        <p className="mb-4">
          However, guess what? It's okay. It's perfectly normal to be confused when you are doing this for the first time.
          <b>
            {" "}Depending on your circumstances, the right fit for you may not be the same as the right fit for someone else.
          </b>{" "}
          Just to begin, some of the factors that we weigh-in for you in the report are:
        </p>

        {/* LIST */}
        <ul className="list-disc pl-6 space-y-1 mb-4">
          <li>Location</li>
          <li>Program Duration</li>
          <li>Cost of Program</li>
          <li>Job Opportunities</li>
          <li>Climate, Life at the University</li>
          <li>Research Opportunities</li>
          <li>STEM</li>
          <li>Visa Probability</li>
          <li>Scholarships</li>
        </ul>

        <p className="mb-4">
          These are just a few of the factors we look at. Also, note how most of these will weigh-in differently depending upon your personal state of affairs.
          Again, all of that is factored into the report we build for you.
        </p>

        <p>
          Now, you have a choice to make. For about 0.1% of what you will be paying the university, you can now leverage our years of expertise and make the right decision for your scenario.
          Rest assured, this will open up perspectives for you that you may have failed to see through earlier.
          In the end, when we finish, you will have one university name in your mind; and along with it, we will make sure it's the university that suits your needs and circumstances best.
        </p>

      </div>

      {/* RIGHT */}
      <div className="w-[40%] flex flex-col items-end gap-6">

        {/* PRICE CARD */}
        <div className="bg-white rounded-[20px] shadow-lg p-6 w-full max-w-[350px]">

          <h3 className="text-center text-lg font-semibold mb-5 text-black">
            Start Now
          </h3>

          <div className="space-y-3 text-sm">
          

          <div className="flex justify-between">
  <span className="font-medium text-gray-700">Services:</span>
  <span className="text-gray-800 text-right">University Finalization Help</span>
</div>

         
             <div className="flex justify-between">
  <span className="font-medium text-gray-700">Duration:</span>
  <span className="text-gray-800 text-right">3-5 days</span>
</div>

            <div className="flex justify-between items-center">
              <span className="font-medium text-gray-700">Currency:</span>
              <select className="border border-gray-300 rounded-md px-4 py-2 text-gray-800 bg-white w-[150px] focus:outline-none focus:ring-2 focus:ring-blue-400">
  <option>INR</option>
  <option>USD</option>
  <option>AED</option>
</select>
<svg
    className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    viewBox="0 0 24 24"
  >
    <path d="M19 9l-7 7-7-7" />
  </svg>
            </div>

            <div className="flex justify-between">
              <span className="font-medium text-gray-700">Actual Amount:</span>
              <span className="line-through text-gray-500">
                INR 11,545.00
              </span>
            </div>

            <div className="flex justify-between">
              <span className="font-medium text-gray-700">Amount:</span>
              <span className="text-red-600 font-bold">
                INR 9,236.38
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="font-medium text-gray-700">You save:</span>
              <span className="flex items-center gap-2 text-gray-800">
                INR 2,308.62
                <span className="bg-orange-500 text-white px-2 py-1 rounded text-xs">
                  20% off
                </span>
              </span>
            </div>

          </div>

          <button className="w-full mt-5 bg-green-500 text-white py-3 rounded-full text-[13px] font-medium hover:bg-green-600">
            Log In To Pay
          </button>
        </div>

        {/* CHAT CARD */}
        <div className="bg-white rounded-[20px] shadow-md p-5 flex gap-4 items-center w-full max-w-[350px]">

          <img
            src="/assets/man_holding_phone.png"
            className="w-[90px]"
          />

          <div className="flex-1">

            <div className="flex items-center gap-2 mb-2">
              <img src="/assets/chat-icon3.svg" className="w-[24px]" />
              <h4 className="font-semibold text-gray-800">
                Discuss Your Case
              </h4>
            </div>

            <p className="text-sm text-gray-600 mb-3">
              Chat with a team member to see how we can help.
            </p>

            <button className="border rounded-lg px-4 py-2 text-sm hover:bg-gray-100 text-black semibold">
              Message now →
            </button>

          </div>

        </div>

      </div>

    </div>

  </div>

</div>

{/* ================= HELP SECTION ================= */}
<div className="bg-[#2f3b49] py-20">

  <div className="max-w-[1200px] mx-auto px-20">

    {/* HEADER */}
    <div className="text-center mb-16">

      <h2 className="text-white text-[34px] font-medium">
        The Help YOU Need
      </h2>

      <div className="flex items-center justify-center mt-3 gap-2">
        <div className="w-[120px] h-[2px] bg-yellow-400"></div>
        <div className="w-3 h-3 bg-yellow-400 rotate-45"></div>
      </div>

    </div>

    {/* CONTENT */}
    <div className="flex items-center justify-between gap-10">

      {/* LEFT TEXT */}
      <div className="w-[45%] text-white text-[20px] leading-relaxed">
        Understand what’s in the service after your purchase.
      </div>

      {/* RIGHT VIDEO */}
      <div className="w-[55%]">

        <div className="rounded-xl overflow-hidden shadow-lg">

       <iframe width="560" height="315" src="https://www.youtube.com/embed/DUZf0oSEJ0w?si=Vhi5AwXjvdVOikuR" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

        </div>

      </div>

    </div>

  </div>

</div>
<FAQSection />

        
      </div>

    </div>
  );
}
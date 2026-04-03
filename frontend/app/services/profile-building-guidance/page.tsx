import FAQSimple from "@/components/FAQpbg";
export default function Page() {
  return (
    <div className="bg-[#f5efe3] py-16">

      <div className="max-w-[1200px] mx-auto px-20 flex items-center justify-between gap-10">

        {/* LEFT */}
        <div className="w-[55%]">

          <h1 className="text-[40px] font-extrabold text-black leading-tight">
            PROFILE BUILDING GUIDANCE
          </h1>

          <p className="mt-4 text-[18px] text-gray-800 leading-relaxed">
            Have more than 3 months of time for your applications? Now, join us for one-
            on-one mentorship on profile boosting in customized sessions.
          </p>

          <h4 className="mt-6 text-[16px] font-medium text-gray-700">
            Includes:
          </h4>

          {/* FEATURES */}
          <div className="flex gap-10 mt-4">

            {/* VIDEO CALL */}
            <div className="text-center">
              <div className="w-[50px] h-[50px] bg-[#2d3748] rounded-full flex items-center justify-center">
                <img src="/assets/meet_icon.svg" className="w-[22px]" />
              </div>
              <p className="text-sm text-gray-700 mt-2">Video call</p>
            </div>

            {/* WHATSAPP */}
            <div className="text-center">
              <div className="w-[50px] h-[50px] bg-[#2d3748] rounded-full flex items-center justify-center">
                <img src="/assets/whats_app_icon.png" className="w-[22px]" />
              </div>
              <p className="text-sm text-gray-700 mt-2">Text Support</p>
            </div>

          </div>

          {/* CTA */}
          <div className="flex items-center gap-6 mt-8">

            <button className="border-2 border-yellow-400 px-6 py-3 rounded-md text-black font-medium hover:bg-yellow-400 transition">
              Discuss Your Case
            </button>

            <p className="text-gray-600 text-sm">
              Have questions about this service? Let's chat.
            </p>

          </div>

        </div>

        {/* RIGHT IMAGE */}
        <div className="w-[45%] flex justify-center">

          <img
            src="/assets/serviceAllImage.svg"
            className="w-full max-w-[420px]"
          />

        </div>

        

      </div>

      {/* ================= ABOUT SERVICE ================= */}
<div className="bg-white py-16">

  <div className="max-w-[1200px] mx-auto px-20 flex gap-12">

    {/* LEFT CONTENT */}
    <div className="w-[60%] text-[14px] text-gray-800 leading-relaxed">

      {/* TITLE */}
      <div className="mb-6">
        <h2 className="text-[28px] text-black font-medium text-center">
          About Service
        </h2>

        <div className="flex justify-center items-center mt-2 gap-2">
          <div className="w-[100px] h-[2px] bg-yellow-400"></div>
          <div className="w-[10px] h-[10px] bg-yellow-400 rotate-45"></div>
        </div>
      </div>

      {/* PARAGRAPHS */}
      <p>
        Having helped thousands of applicants every year, we have gained a wealth of experience on what moves the needle when it comes to university admissions. Today, we have access to a diverse range of profiles and the metrics that decide their admission or rejection into universities spread across <b>USA, UK, Canada, Australia, Singapore, and Germany, among others.</b> I lacked this experience when I applied to the universities for the first time. In retrospect, I can see the mistakes I made investing time on aspects that never required the attention I thought they needed.
      </p>

      <p className="mt-4">
        My experience has taught me that universities can be rigid about some factors while being flexible about others. We are often unaware of such subtleties that can change the game. For instance, the addition of one research paper to a particular profile may ensure admission into a far better-ranked university, but the same may not apply to your case. I can help you save time filtering out the factors for your profile that can maximize your chances of admission.
      </p>

      <p className="mt-4">
        Let us help your profile tick the checklist of all the points that your target university requires through our Profile Building Guidance.
      </p>

      {/* DELIVERY */}
      <h4 className="mt-6 font-semibold text-black">
        Here's how the service is delivered:
      </h4>

      <ul className="list-disc pl-5 mt-3 space-y-2">
        <li>To know your profile better, we conduct our first session and understand your current position and your goal.</li>
        <li>We then carve out a pathway from your current position to your goal in the next session.</li>
        <li>Next, we connect for a 30-minute session 15 days later to evaluate your progress and ensure that you are moving in the right direction.</li>
        <li>We will keep tabs on your progress personally and provide updated advice during this session.</li>
        <li>The sessions are provided via face-to-face zoom calls.</li>
        <li>The aim is to move you from point A (where you currently stand) to point B (your goal).</li>
        <li>This can take several months or weeks, depending on your situation.</li>
      </ul>

      <p className="mt-4">
        In essence, this service is paramount if you have more than 3 months on your hands to improve your profile. This is used by both <b>students and working professionals.</b>
      </p>

      <p className="mt-4 font-semibold">
        The service can be continued on a monthly basis from 1 month to 1 year or anywhere in between (completely depending on your willpower to continually improve and take your professional life to the next level).
      </p>

      <p className="mt-4">
        One-on-one mentorship slots are usually limited, so this service may be removed from the catalog from time to time depending on the availability of slots.
      </p>

    </div>

    {/* RIGHT SIDE */}
    <div className="w-[40%] flex flex-col gap-6">

      {/* START NOW CARD */}
      <div className="bg-white rounded-2xl p-6 shadow-md border">

        <h3 className="text-center text-[20px] font-semibold text-black mb-6">
          Start Now
        </h3>

        <div className="space-y-4 text-[14px] text-gray-800">

          <div className="flex justify-between">
            <span className="font-medium text-black">Services:</span>
            <span>Profile Building Guidance</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="font-medium text-black">Duration:</span>
            <span className="flex items-center gap-1">
              2 Sessions on Zoom <span className="text-blue-500 text-xs">ⓘ</span>
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="font-medium text-black">Currency:</span>

            <select className="border border-gray-300 px-3 py-2 rounded-md text-sm text-black bg-white">
              <option>INR</option>
              <option>USD</option>
            </select>
          </div>

          <div className="flex justify-between">
            <span className="font-medium text-black">Actual Amount:</span>
            <span className="line-through text-gray-400">
              INR 32,426.00
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="font-medium text-black">Amount:</span>
            <span className="text-red-600 font-bold text-[18px]">
              INR 25,940.71
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="font-medium text-black">You save:</span>

            <div className="flex items-center gap-2">
              <span className="text-gray-600">INR 6,485.29</span>
              <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded-md">
                20% off
              </span>
            </div>
          </div>

          <button className="w-full mt-6 bg-green-500 text-white py-3 rounded-full font-medium hover:bg-green-600 transition">
            Log In To Pay
          </button>

        </div>
      </div>

      {/* CHAT CARD */}
      <div className="bg-white border rounded-2xl p-5 flex items-center gap-4 shadow-sm">

        <img src="/assets/man_holding_phone.png" className="w-[90px]" />

        <div>
          <h4 className="font-medium text-black">Discuss Your Case</h4>
          <p className="text-sm text-gray-600">
            Chat with a team member to see how we can help.
          </p>

          <button className="mt-2 border px-4 py-2 rounded-md text-sm text-black bg-white hover:bg-yellow-400 transition">
            Message now →
          </button>
        </div>

      </div>
      

    </div>
    

  </div>

  {/* ================= HELP SECTION ================= */}
<div className="bg-[#2f3a46] py-20">

  <div className="max-w-[1200px] mx-auto px-20">

    {/* TITLE */}
    <div className="text-center mb-12">
      <h2 className="text-[32px] text-white font-medium">
        The Help YOU Need
      </h2>

      <div className="flex justify-center items-center mt-3 gap-2">
        <div className="w-[120px] h-[2px] bg-yellow-400"></div>
        <div className="w-[10px] h-[10px] bg-yellow-400 rotate-45"></div>
      </div>
    </div>

    {/* CONTENT */}
    <div className="flex items-center justify-between">

      {/* LEFT TEXT */}
      <div className="w-[45%] text-center">
        <p className="text-white text-[20px] leading-relaxed">
          Understand what’s in the service <br />
          after your purchase.
        </p>
      </div>

      {/* RIGHT VIDEO */}
      <div className="w-[50%] flex justify-end">

    <iframe width="560" height="315" src="https://www.youtube.com/embed/DUZf0oSEJ0w?si=pbpgnrmqLLnHrxUR" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

      </div>

    </div>

  </div>

</div>

</div>

<FAQSimple />

    </div>
  );
}
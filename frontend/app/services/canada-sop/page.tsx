import FAQCanada from "@/components/FAQCanada";
export default function Page() {
  return (
    <div className="bg-[#f5efe3] py-16">

      <div className="max-w-[1200px] mx-auto px-20 flex items-center justify-between gap-10">

        {/* LEFT */}
        <div className="w-[55%]">

          <h1 className="text-[40px] font-extrabold text-black leading-tight">
            CANADA VISA SOP/LETTER OF EXPLANATION
          </h1>

          <p className="mt-4 text-[18px] text-gray-800 leading-relaxed">
            Over 1000 students have been issued study permits with us. With our
            expertise in the most common reasons for rejection, we can help you
            ensure success.
          </p>

          <h4 className="mt-6 text-[16px] font-medium text-gray-700">
            Includes:
          </h4>

          {/* FEATURES */}
          <div className="flex gap-10 mt-4">

            {/* Audio Call */}
            <div className="text-center">
              <div className="w-[50px] h-[50px] bg-[#2d3748] rounded-full flex items-center justify-center">
                <img src="/assets/call_icon.svg" className="w-[22px]" />
              </div>
              <p className="text-sm text-gray-700 mt-2">Audio call</p>
            </div>

            {/* WhatsApp */}
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
{/* ================= ABOUT SECTION ================= */}
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

      <p>
        The Canada Visa Statement of Purpose, often called the Letter of Explanation (LoE) or Letter of Intent (LoI) is your "elevator pitch" for getting the visa stamped. It is the ONLY portion of your application which allows you to explain your flaws, offer assurance of your non-immigrant intent, and help the IRCC know you as a person. It firmly conveys who you are, what your aspirations are, and the purpose of going to Canada.
      </p>

      <p className="mt-4">
        Missing out on critical questions that the reviewer wants an answer to can lead to a rejection. Especially, a failure to explain your non-immigrant intent can cause rejections, regardless of the welcoming nature Canada portrays to have towards potential immigrants. Several students are blinded by the idea that the application would be fairly easy as Canada is famed for being welcoming to immigrants.
      </p>

      <p className="mt-4">
        Here's where we can make a difference to your application. We combine the expertise of experienced immigration consultants and professional writers who serve as the fulcrum of your success. A strong statement of purpose guides readers from the start with a clear scope. The Letter of Explanation can make or break your chances to get the Canadian study permit. Our experienced visa team helps you cover all grounds for rejection and ensures that your chances of approval for the student visa are maximized.
      </p>

      <p className="mt-4">
        As reported by the CIC News, the most trusted source of Canadian Immigration updates - ‘Mistakes Matter’ and they can have grave repercussions even if they are minor. Having our visa team on your side can ensure elimination of all avenues for rejection of the visa.
      </p>

      <p className="mt-4">
        Based on our experience of working with over 800 clients every year, we ensure the presence of justifiable reasons that lead to your approval.
      </p>

      <p className="mt-4">
        So, is the pressure of writing the Visa SOP driving you up the wall? With our help, you can get a well-crafted, personalised essay that answers the visa officer's queries clearly. All you need to do is answer a few questions for the input submission on our portal, and voila! Your complete, polished draft will be ready to send off.
      </p>

      {/* DELIVERY */}
      <h4 className="mt-6 font-semibold text-black">
        Here's how the service is delivered:
      </h4>

      <ul className="list-disc pl-5 mt-3 space-y-2">
        <li>To know your profile better, we take in certain inputs to draft the SOP</li>
        <li>We then evaluate your case and our YMGrad certified writers draft the Letter of Explanation.</li>
        <li>The draft is reviewed by our immigration consultants to ensure quality and reliability before the delivery.</li>
      </ul>

    </div>

    {/* RIGHT SIDE */}
    <div className="w-[40%] flex flex-col gap-6">

      {/* PRICE CARD */}
      <div className="bg-white rounded-2xl p-6 shadow-md border">

  {/* TITLE */}
  <h3 className="text-center text-[20px] font-semibold text-black mb-6">
    Start Now
  </h3>

  <div className="space-y-4 text-[14px] text-gray-800">

    {/* SERVICES */}
    <div className="flex justify-between">
      <span className="font-medium text-black">Services:</span>
      <span className="text-gray-700">
        Visa SOP/Letter of Explanation
      </span>
    </div>

    {/* DURATION */}
    <div className="flex justify-between items-center">
      <span className="font-medium text-black">Duration:</span>
      <span className="flex items-center gap-1 text-gray-700">
        2 weeks
        <span className="text-blue-500 text-xs">ⓘ</span>
      </span>
    </div>

    {/* CURRENCY */}
    <div className="flex justify-between items-center">
      <span className="font-medium text-black">Currency:</span>

      <select className="border border-gray-300 px-3 py-2 rounded-md text-sm text-black bg-white">
        <option>INR</option>
        <option>USD</option>
      </select>
    </div>

    {/* LIGHTNING SPEED */}
    <div>
      <p className="font-medium text-black mb-2">Lightning Speed:</p>

      <label className="flex items-start gap-2 text-gray-700 text-sm">
        <input type="checkbox" className="mt-1" />
        <span>
          Skip the queue - Delivered within 3-5 days for a 25% surcharge
        </span>
      </label>
    </div>

    {/* ACTUAL AMOUNT */}
    <div className="flex justify-between mt-4">
      <span className="font-medium text-black">Actual Amount:</span>
      <span className="line-through text-gray-400">
        INR 25,601.00
      </span>
    </div>

    {/* FINAL AMOUNT */}
    <div className="flex justify-between items-center">
      <span className="font-medium text-black">Amount:</span>
      <span className="text-red-600 font-bold text-[18px]">
        INR 20,480.68
      </span>
    </div>

    {/* SAVE */}
    <div className="flex justify-between items-center">
      <span className="font-medium text-black">You save:</span>

      <div className="flex items-center gap-2">
        <span className="text-gray-600">INR 5,120.32</span>

        <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded-md">
          20% off
        </span>
      </div>
    </div>

    {/* BUTTON */}
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

         <button className="mt-2 border px-4 py-2 rounded-md text-sm text-black bg-white hover:bg-yellow-400 hover:text-black transition ">
            Message now →
            </button>
        </div>

      </div>

    </div>

  </div>

    

</div>
      <FAQCanada />

    </div>
  );
}
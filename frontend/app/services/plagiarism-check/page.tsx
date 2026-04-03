
import ServiceFAQ from "@/components/ServiceFAQ";

export default function Page() {
  return (
    <div className="bg-[#f5efe3] py-16">

      <div className="max-w-[1200px] mx-auto px-20 flex items-center justify-between gap-10">

        {/* LEFT */}
        <div className="w-[55%]">

          <h1 className="text-[40px] font-extrabold text-black leading-tight">
            PLAGIARISM CHECK REPORT
          </h1>

          <p className="mt-4 text-[18px] text-gray-800 leading-relaxed">
            Use our best-in-class instructor-level Turnitin reporting software to generate
            reports for your drafts. Can be used on SOPs, LORs, research papers, and even assignments.
          </p>

          <h4 className="mt-6 text-[16px] font-medium text-gray-700">
            Includes:
          </h4>

          {/* FEATURES */}
          <div className="flex gap-10 mt-4">

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
<div className="bg-white py-12">

  <div className="max-w-[1200px] mx-auto px-20">

    {/* HEADER */}
    <div className="text-center mb-10">
      <h2 className="text-[32px] text-black font-medium">
        About Service
      </h2>

      <div className="flex justify-center items-center mt-3 gap-2">
        <div className="w-[120px] h-[2px] bg-yellow-400"></div>
        <div className="w-[10px] h-[10px] bg-yellow-400 rotate-45"></div>
      </div>
    </div>

    <div className="flex gap-10">

      {/* LEFT CONTENT */}
      <div className="w-[60%] text-[15px] leading-7 text-gray-800">

        <p className="mb-4">
          Undisputedly, plagiarism is the greatest reason cited for rejections of essays,
          research papers, and assignments.
        </p>

        <p className="mb-4">
          In fact, most universities and companies now have plagiarism detection software of the same level
          used in this service to generate the report for you.
        </p>

        <p className="font-semibold mb-2">
          We will identify the following details:
        </p>

        <ul className="list-disc pl-6 mb-4 space-y-1">
          <li>Plagiarism percentage</li>
          <li>Parts of text plagiarized (so that they can be targeted and fixed to eliminate plagiarism)</li>
          <li>Original sources from where the plagiarized text is arising</li>
        </ul>

        <p className="mb-4">
          All reports are created using <span className="font-semibold">Turnitin</span> Instructor-level software,
          so you can be assured that the universities/journals/companies will be using the same software in most cases.
        </p>

        <p className="font-semibold mb-2">
          The process:
        </p>

        <ul className="list-disc pl-6 mb-4 space-y-1">
          <li>You make the purchase.</li>
          <li>You receive a confirmation email and an invoice.</li>
          <li>The confirmation email will ask you to send the draft you would like to check for plagiarism.</li>
          <li>You send the draft.</li>
          <li>We evaluate the plagiarism and send you a full report consisting of the plagiarism percentage, plagiarized parts, and the sources.</li>
          <li>We send you the report.</li>
          <li>Additionally, we also provide an option where our team can help remove the plagiarism and fix the grammar.</li>
        </ul>

      </div>

      {/* RIGHT SIDE */}
      <div className="w-[40%] flex flex-col items-end gap-6">

        {/* PRICE CARD */}
        <div className="bg-[#f9f9f9] rounded-[20px] p-6 w-full max-w-[350px] shadow-sm">

          <h3 className="text-center text-black text-[20px] font-semibold mb-6">
            Start Now
          </h3>

          <div className="space-y-4 text-[14px] text-gray-800">

            <div className="flex justify-between">
              <span className="font-medium">Services:</span>
              <span>Similarity Report</span>
            </div>

            <div className="flex justify-between">
              <span className="font-medium">Duration:</span>
              <span>1-2 days</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="font-medium">Currency:</span>

              <select className="border px-3 py-2 rounded-md text-sm">
                <option>INR</option>
                <option>USD</option>
              </select>
            </div>

            <div className="flex justify-between">
              <span className="font-medium">Actual Amount:</span>
              <span className="line-through text-gray-400">INR 3,475.00</span>
            </div>

            <div className="flex justify-between">
              <span className="font-medium">Amount:</span>
              <span className="text-red-600 font-semibold">INR 2,780.27</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="font-medium">You save:</span>

              <div className="flex items-center gap-2">
                <span>INR 694.73</span>
                <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded">
                  20% off
                </span>
              </div>
            </div>

          </div>

          <button className="w-full mt-6 bg-green-500 text-white py-3 rounded-full text-[16px] font-medium hover:bg-green-600">
            Log In To Pay
          </button>

        </div>

        {/* CHAT CARD */}
        <div className="flex items-center gap-4 bg-[#f9f9f9] p-4 rounded-[20px] w-full max-w-[350px]">

          <img
            src="/assets/man_holding_phone.png"
            className="w-[90px]"
          />

          <div>
            <div className="flex items-center gap-2 mb-1">
              <img src="/assets/chat-icon3.svg" className="w-[22px]" />
              <h4 className="text-black font-medium">Discuss Your Case</h4>
            </div>

            <p className="text-sm text-gray-600 mb-2">
              Chat with a team member to see how we can help.
            </p>

            <button className="border px-4 py-2 rounded-md text-sm hover:bg-yellow-400 transition">
              Message now →
            </button>
          </div>

        </div>

        

      </div>

      

    </div>

    

  </div>

  

</div>

{/* ================= SAMPLE OUTPUT ================= */}
<div className="bg-white py-10">

  <div className="max-w-[1200px] mx-auto px-20">

    <h3 className="text-[18px] font-semibold text-black mb-6">
      Sample Output:
    </h3>

    <div className="flex gap-6">

      {/* LEFT DOCUMENT */}
      <div className="w-[60%] bg-[#fafafa] border rounded-lg p-4 max-h-[420px] overflow-y-auto">

        <p className="text-[13px] text-gray-800 leading-relaxed">
          <span className="bg-pink-200 px-1">
            are under 18 years of age, they need to provide all the evidence of their welfare arrangements in Australia.
          </span>
        </p>

        <p className="text-[13px] text-gray-800 mt-3">
          <span className="bg-pink-200 px-1">
            Health and Character Requirement: Students applying for this visa are required to be of good character...
          </span>
        </p>

        <p className="mt-4 font-semibold text-black text-[13px]">
          INTERESTING FACTS
        </p>

        <ul className="list-disc pl-5 text-[13px] mt-2 space-y-2 text-gray-800">
          <li className="bg-blue-100 px-1">
            The Department of Immigration and Border Protection's Temporary Graduate Visa (Subclass 485)...
          </li>
          <li>
            It also allows students to work part-time while pursuing their education.
          </li>
        </ul>

        <p className="mt-4 text-[13px] text-gray-800">
          <span className="bg-pink-200 px-1">
            In the present COVID-19 situation, the Australian Government is welcoming to grant student visas...
          </span>
        </p>

      </div>

      {/* RIGHT MATCH OVERVIEW */}
      <div className="w-[40%] border rounded-lg overflow-hidden">

        {/* HEADER */}
        <div className="bg-red-600 text-white text-center py-2 font-semibold">
          Match Overview
        </div>

        {/* SCORE */}
        <div className="text-center py-4">
          <p className="text-[40px] text-red-600 font-bold">76%</p>
        </div>

        {/* LIST */}
        <div className="px-4 pb-4 space-y-2 text-[13px]">

          <div className="flex justify-between border-b pb-2">
            <span className="text-red-600">1 www.immigrationworld...</span>
            <span>46%</span>
          </div>

          <div className="flex justify-between border-b pb-2">
            <span className="text-pink-600">2 www.aussizzgroup.com</span>
            <span>18%</span>
          </div>

          <div className="flex justify-between border-b pb-2">
            <span className="text-blue-600">3 students.unimelb.edu.au</span>
            <span>5%</span>
          </div>

          <div className="flex justify-between border-b pb-2">
            <span>4 admitcard.com</span>
            <span>2%</span>
          </div>

          <div className="flex justify-between border-b pb-2">
            <span>5 blueskyconsultants...</span>
            <span>2%</span>
          </div>

          <div className="flex justify-between border-b pb-2">
            <span>6 gostudy.com.au</span>
            <span>2%</span>
          </div>

          <div className="flex justify-between">
            <span className="text-red-500">7 Taking Public Universit...</span>
            <span>1%</span>
          </div>

        </div>

      </div>

    </div>

  </div>

</div>

{/* ================= HELP SECTION ================= */}
<div className="bg-[#2f3b46] py-16">

  <div className="max-w-[1200px] mx-auto px-20">

    {/* TITLE */}
    <div className="text-center mb-12">
      <h2 className="text-white text-[32px] font-medium">
        The Help YOU Need
      </h2>

      {/* underline with diamond */}
      <div className="flex justify-center items-center mt-3 gap-2">
        <div className="w-[120px] h-[2px] bg-yellow-400"></div>
        <div className="w-[10px] h-[10px] bg-yellow-400 rotate-45"></div>
      </div>
    </div>

    {/* CONTENT */}
    <div className="flex items-center justify-between gap-10">

      {/* LEFT TEXT */}
      <div className="w-[50%] text-white text-[20px] leading-relaxed text-center md:text-left">
        Understand what’s in the service after your purchase.
      </div>

      {/* RIGHT VIDEO */}
      <div className="w-[50%] flex justify-center">

        <div className="w-full max-w-[500px] rounded-lg overflow-hidden shadow-lg">

          <iframe width="560" height="315" src="https://www.youtube.com/embed/DUZf0oSEJ0w?si=wJSg7dn_VDEPn8ar" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>

        </div>

      </div>

    </div>

  </div>

  <ServiceFAQ />

</div>

      

    </div>

    
  );
}
"use client";

import { motion } from "framer-motion";

export default function TermsAndConditions() {
  return (
    <main className="min-h-screen bg-[#FDFBF7] py-20 px-6 md:px-20 font-sans text-[#3C2A21]">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700&family=DM+Sans:wght@300;400;500;600;700&display=swap');

        .section-h {
          font-family: 'Cormorant Garamond', serif;
          font-weight: 700;
          font-size: 2.5rem;
          color: #2D1F1D;
          text-align: center;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 2rem;
          position: relative;
        }

        .section-h::after {
          content: '';
          display: block;
          width: 60px;
          height: 3px;
          background: #C5A059;
          margin: 1rem auto;
        }

        .content-block {
          max-w-4xl mx-auto space-y-8 leading-relaxed text-[#6B5E51] font-medium;
        }

        .sub-h {
          font-family: 'Cormorant Garamond', serif;
          font-weight: 700;
          font-size: 2rem;
          color: #3C2A21;
          margin-top: 3rem;
          margin-bottom: 1rem;
        }

        p { margin-bottom: 1.5rem; }
        ul { list-style-type: disc; margin-left: 1.5rem; margin-bottom: 1.5rem; }
        li { margin-bottom: 0.5rem; }
      `}</style>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto"
      >
        <h1 className="section-h">Terms & Conditions</h1>

        <div className="content-block">

          <p>
            Welcome to Aryahs IEC Mumbai (International Eduleader Council). By accessing our website (https://iec.aryahsworld.com), you agree to comply with and be bound by the following terms and conditions.
          </p>

          <h2 className="sub-h">Use of Website</h2>
          <p>
            You agree to use this website only for lawful purposes and in a manner that does not infringe the rights of others or restrict their use of the website.
          </p>

          <h2 className="sub-h">Services</h2>
          <p>
            We provide study abroad consultation, university guidance, and related services. While we aim to provide accurate and helpful guidance, we do not guarantee admission, visa approval, or specific outcomes.
          </p>

          <h2 className="sub-h">User Responsibilities</h2>
          <ul>
            <li>Provide accurate and complete information</li>
            <li>Do not misuse services or submit false data</li>
            <li>Comply with all applicable laws and regulations</li>
          </ul>

          <h2 className="sub-h">Payments & Refund Policy</h2>
          <p>
            Payments for services are subject to our refund policy. Refunds may be granted only if services cannot be delivered due to reasons solely from our side.
          </p>
          <p>
            A change of mind or personal circumstances will not qualify for a refund. Any incorrect payment may be refunded to the IEC wallet only.
          </p>

          <h2 className="sub-h">Intellectual Property</h2>
          <p>
            All content on this website, including text, design, graphics, and tools, is owned by IEC and protected under intellectual property laws. Unauthorized use is strictly prohibited.
          </p>

          <h2 className="sub-h">Third-Party Links</h2>
          <p>
            Our website may contain links to third-party websites. We are not responsible for the content or privacy practices of those websites.
          </p>

          <h2 className="sub-h">Limitation of Liability</h2>
          <p>
            IEC shall not be held liable for any direct or indirect damages arising from the use of our services, including admission decisions, visa outcomes, or third-party actions.
          </p>

          <h2 className="sub-h">AI Tools Disclaimer</h2>
          <p>
            Tools such as RateMyChances and other AI-based services provide estimated insights based on available data. These results are not guaranteed and should not be considered final outcomes.
          </p>

          <h2 className="sub-h">Changes to Terms</h2>
          <p>
            We reserve the right to update these terms at any time. Continued use of the website means you accept any changes made.
          </p>

          <h2 className="sub-h">Governing Law</h2>
          <p>
            These terms are governed by the laws of India. Any disputes shall be subject to the jurisdiction of courts in Mumbai.
          </p>

          <h2 className="sub-h">Contact Us</h2>
          <p>Email: info.aryahs@gmail.com</p>
          <p>Phone: +91 86578 69659</p>
          <p>Location: Navi Mumbai, India</p>

        </div>
      </motion.div>
    </main>
  );
}
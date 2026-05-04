"use client";

import { motion } from "framer-motion";

export default function PrivacyPolicy() {
  return (
    <main className="min-h-screen bg-[#FDFBF7] py-20 px-6 md:px-20 font-sans text-[#3C2A21]">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700&family=DM+Sans:wght@300;400;500;600;700&display=swap');
        .fd { font-family: 'Cormorant Garamond', serif; }
        
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
        <h1 className="section-h">Privacy Policy</h1>

        <div className="content-block">

          <p>
            At Aryahs IEC Mumbai (International Eduleader Council), accessible from https://iec.aryahsworld.com, protecting your privacy is one of our main priorities. This Privacy Policy document outlines the types of information that is collected and how we use it.
          </p>

          <h2 className="sub-h">Information We Collect</h2>
          <p>
            We may collect personal information such as your name, email address, and phone number when you fill out forms on our website.
          </p>

          <h2 className="sub-h">How We Use Your Information</h2>
          <ul>
            <li>Provide study abroad consultation services</li>
            <li>Contact you regarding your inquiry</li>
            <li>Offer guidance related to university admissions</li>
            <li>Improve our website and services</li>
          </ul>

          <h2 className="sub-h">Log Files</h2>
          <p>
            Like many websites, we use log files. These include IP addresses, browser type, ISP, timestamps, and referring pages. This data is not linked to personally identifiable information.
          </p>

          <h2 className="sub-h">Cookies</h2>
          <p>
            We use cookies to improve user experience and analyze website traffic.
          </p>

          <h2 className="sub-h">Google AdSense</h2>
          <p>
            We may use Google AdSense to display advertisements. Google uses cookies, including the DoubleClick cookie, to serve ads based on users’ visits to this and other websites.
          </p>
          <p>
            Users may opt out of personalized advertising by visiting{" "}
            <a href="https://adssettings.google.com" target="_blank" className="text-[#C5A059] underline">
              Google Ads Settings
            </a>.
          </p>

          <h2 className="sub-h">Third-Party Privacy Policies</h2>
          <p>
            Our Privacy Policy does not apply to other advertisers or websites. We advise you to review their policies for more information.
          </p>

          <h2 className="sub-h">Data Protection Rights</h2>
          <p>
            You have the right to access, update, or delete your personal information. Contact us if you wish to exercise these rights.
          </p>

          <h2 className="sub-h">Children’s Information</h2>
          <p>
            We do not knowingly collect personal information from children under the age of 13.
          </p>

          <h2 className="sub-h">Consent</h2>
          <p>
            By using our website, you consent to our Privacy Policy and agree to its terms.
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
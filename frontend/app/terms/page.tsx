"use client";

import { motion } from "framer-motion";

export default function TermsOfService() {
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
        <h1 className="section-h">Terms of Service</h1>

        <div className="content-block">
          <p>
            Welcome to Global Counsellor Centre (also known as GCC)!
          </p>
          <p>
            These terms and conditions outline the rules and regulations for the use of Global Counsellor Centre's Website, located at https://www.globalcounsellor.com.
          </p>
          <p>
            By accessing this website we assume you accept these terms and conditions. Do not continue to use GCC if you do not agree to take all of the terms and conditions stated on this page.
          </p>
          <p>
            The following terminology applies to these Terms and Conditions, Privacy Statement and Disclaimer Notice and all Agreements: "Client", "You" and "Your" refers to you, the person log on this website and compliant to the Company’s terms and conditions. "The Company", "Ourselves", "We", "Our" and "Us", refers to our Company. "Party", "Parties", or "Us", refers to both the Client and ourselves.
          </p>

          <h2 className="sub-h">Cookies</h2>
          <p>
            We employ the use of cookies. By accessing GCC, you agreed to use cookies in agreement with the GCC's Privacy Policy.
          </p>
          <p>
            Most interactive websites use cookies to let us retrieve the user’s details for each visit. Cookies are used by our website to enable the functionality of certain areas to make it easier for people visiting our website. Some of our affiliate/advertising partners may also use cookies.
          </p>

          <h2 className="sub-h">License</h2>
          <p>
            Unless otherwise stated, GCC and/or its licensors own the intellectual property rights for all material on GCC. All intellectual property rights are reserved. You may access this from GCC for your own personal use subjected to restrictions set in these terms and conditions.
          </p>
          <p>You must not:</p>
          <ul>
            <li>Republish material from GCC</li>
            <li>Sell, rent or sub-license material from GCC</li>
            <li>Reproduce, duplicate or copy material from GCC</li>
            <li>Redistribute content from GCC</li>
          </ul>

          <h2 className="sub-h">Disclaimer</h2>
          <p>
            For the complete application help service, if payments are made in two parts and the parts are distributed in a time frame of over 48 hours, a 5% premium shall be charged on the entire service charge.
          </p>
          <p>
            Certain refund requests for services may be considered by GCC on a case-by-case basis and granted in sole discretion of GCC. These are offered where GCC is no longer able to offer you a service due to constraints solely on GCC's end.
          </p>
          <p>
            A change of mind or any change in circumstances not controlled by GCC would not entitle the user to a refund.
          </p>
          <p>
            Any funds added due to an incorrect purchase which was not intentional would be eligible for a refund to the GCC wallet only.
          </p>
          <p>
            For the complete application help, if payment in two parts is made, the second half of the services will only be activated with the second part of the payment. If no payment for the second part is made, the service will be terminated at the end of one year.
          </p>

          <h2 className="sub-h">RateMyChances Disclaimer</h2>
          <p>
            RateMyChances (RMC) uses your Profile for performing evaluations. Editing your profile and updating information will have an effect on the results. We do not store your evaluation results in our database or share them with any third party.
          </p>
          <ul>
            <li>RMC does not check for the minimum requirements of the universities.</li>
            <li>The algorithm is proprietary and gives different weightage to scores and GPA based on your stream. Disclosure of the algorithm is strictly prohibited.</li>
            <li>GCC agents do not hold any liability of explaining the results of the RMC algorithm.</li>
          </ul>
        </div>
      </motion.div>
    </main>
  );
}

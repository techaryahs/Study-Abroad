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
            At International Eduleader Council, accessible from https://www.globalcounsellor.com, one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by IEC and how we use it.
          </p>
          <p>
            If you have additional questions or require more information about our Privacy Policy, do not hesitate to contact us.
          </p>

          <h2 className="sub-h">Log Files</h2>
          <p>
            IEC follows a standard procedure of using log files. These files log visitors when they visit websites. All hosting companies do this and a part of hosting services' analytics. The information collected by log files include internet protocol (IP) addresses, browser type, Internet Service Provider (ISP), date and time stamp, referring/exit pages, and possibly the number of clicks. These are not linked to any information that is personally identifiable.
          </p>

          <h2 className="sub-h">Cookies and Web Beacons</h2>
          <p>
            Like any other website, IEC uses 'cookies'. These cookies are used to store information including visitors' preferences, and the pages on the website that the visitor accessed or visited. The information is used to optimize the users' experience by customizing our web page content based on visitors' browser type and/or other information.
          </p>

          <h2 className="sub-h">Our Advertising Partners</h2>
          <p>
            Some of advertisers on our site may use cookies and web beacons. Our advertising partners are listed below. Each of our advertising partners has their own Privacy Policy for their policies on user data. For easier access, we hyperlinked to their Privacy Policies below.
          </p>

          <h2 className="sub-h">Privacy Policies</h2>
          <p>
            You may consult this list to find the Privacy Policy for each of the advertising partners of IEC.
          </p>
          <p>
            Third-party ad servers or ad networks uses technologies like cookies, JavaScript, or Web Beacons that are used in their respective advertisements and links that appear on IEC, which are sent directly to users' browser. They automatically receive your IP address when this occurs. These technologies are used to measure the effectiveness of their advertising campaigns and/or to personalize the advertising content that you see on websites that you visit.
          </p>
          <p>
            Note that IEC has no access to or control over these cookies that are used by third-party advertisers.
          </p>

          <h2 className="sub-h">Third Party Privacy Policies</h2>
          <p>
            IEC's Privacy Policy does not apply to other advertisers or websites. Thus, we are advising you to consult the respective Privacy Policies of these third-party ad servers for more detailed information. It may include their practices and instructions about how to opt-out of certain options.
          </p>

          <h2 className="sub-h">Consent</h2>
          <p>
            By using our website, you hereby consent to our Privacy Policy and agree to its Terms and Conditions.
          </p>
        </div>
      </motion.div>
    </main>
  );
}

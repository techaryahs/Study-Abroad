// import "./gre.css";

// export default function GrePrepPage() {
//   return (
//     <div className="gre-section">

//       <div className="gre-container">

//         {/* LEFT SIDE */}
//         <div className="gre-left">

//           <h1>GRE PREP-PLAN BUILDING</h1>

//           <p className="desc">
//             The secret to an excellent GRE score is NOT hard work. I scored a{" "}
//             <b>329/340</b> and helped thousands do the same. Are you next?
//             (Day-by-day schedule)
//           </p>

//           <h4 className="includes">Includes:</h4>

//           <div className="features">

//             <div className="feature">
//   <div className="icon">
//     <img src="/assets/meet_icon.png" alt="video" />
//   </div>
//   <p>Video call</p>
// </div>

// <div className="feature">
//   <div className="icon">
//     <img src="/assets/whats_app_icon.png" alt="chat" />
//   </div>
//   <p>Text Support</p>
// </div>

//           </div>

//           <div className="cta">

//             <button className="discuss-btn">
//               Discuss Your Case
//             </button>

//             <p className="help-text">
//               Have questions about this service? Let's chat.
//             </p>

//           </div>

//         </div>

//         {/* RIGHT SIDE VIDEO */}
//         <div className="gre-right">

//           <div className="video-card">
//             <video autoPlay loop muted playsInline>
//               <source src="/assets/GRE.mp4" type="video/mp4" />
//             </video>
//           </div>

//         </div>

//       </div>

//     </div>
//   );
// }

import "./gre.css";

export default function GrePrepPage() {
  return (
    <div className="gre-section">

      <div className="gre-container">

        {/* LEFT SIDE */}
        <div className="gre-left">

          <h1>GRE PREP-PLAN BUILDING</h1>

          <p className="desc">
            The secret to an excellent GRE score is NOT hard work. I scored a{" "}
            <b>329/340</b> and helped thousands do the same. Are you next?
            (Day-by-day schedule)
          </p>

          <h4 className="includes">Includes:</h4>

          <div className="features">

            <div className="feature">
              <div className="icon">
                <img src="/assets/meet_icon.png" alt="video" />
              </div>
              <p>Video call</p>
            </div>

            <div className="feature">
              <div className="icon">
                <img src="/assets/whats_app_icon.png" alt="chat" />
              </div>
              <p>Text Support</p>
            </div>

          </div>

          <div className="cta">

            <button className="discuss-btn">
              Discuss Your Case
            </button>

            <p className="help-text">
              Have questions about this service? Let's chat.
            </p>

          </div>

        </div>

        {/* RIGHT SIDE (VIDEO WITH DOUBLE FRAME) */}
     <div className="gre-right">

  <div className="video-card">

    <video autoPlay loop muted playsInline>
      <source src="/assets/GRE.mp4" type="video/mp4" />
    </video>

  </div>

</div>

      </div>

      <div className="about-section">

  <h2 className="about-title">About Service</h2>

  <div className="about-container">

    {/* LEFT SIDE */}
    <div className="about-left">

      <p><b>My Scores:</b></p>
      <p><b>Verbal:</b> 161/170</p>
      <p><b>Quantitative:</b> 168/170</p>
      <p><b>AWA:</b> 4.5/6</p>

      <p className="para">
        Although I have plenty of free content on YouTube, at times it does not cater to the needs of some students.
        If you are struggling to score over 325, I can craft the exact strategy needed for your case.
      </p>

      <p className="para">
        Talk to me about the best resources to use, how to use them properly, build your schedule,
        identify new strategies, and build your score during this session.
      </p>

      <p className="highlight">
        Highly Recommended solution for people who have hit a plateau or have very less time to improve their scores substantially.
      </p>

    </div>

    {/* RIGHT SIDE CARD */}
    <div className="about-right">

      <div className="price-card">

        <h3>Start Now</h3>

        <div className="row">
          <span>Services:</span>
          <span>GRE Consulting Session via Zoom</span>
        </div>

        <div className="row">
          <span>Duration:</span>
          <span>60 Minutes</span>
        </div>

        <div className="row">
          <span>Currency:</span>
          <select>
            <option>INR</option>
          </select>
        </div>

        <div className="row">
          <span>Actual Amount:</span>
          <span className="strike">INR 11,542.00</span>
        </div>

        <div className="row">
          <span>Amount:</span>
          <span className="price">INR 9,233.77</span>
        </div>

        <div className="row">
          <span>You save:</span>
          <span className="save">
            INR 2,308.23 <span className="badge">20% off</span>
          </span>
        </div>

        <button className="pay-btn">Log In To Pay</button>

      </div>

    </div>

  </div>

</div>

    </div>

    
  );
}
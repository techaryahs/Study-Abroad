import "./harvard.css";

export default function HarvardPage() {
  return (
    <div className="main-bg">

      <div className="container">

        <div className="header-card">

          <div className="header-inner">

            {/* LEFT */}
            <div className="header-left">
                

              <div className="top-section">

                {/* LOGO */}
                <img src="/assets/logo.png" className="uni-logo" alt="logo" />

                {/* TITLE */}
                <div className="title-wrap">
                  <h2>Harvard University</h2>
                  <p className="location">
                    📍 Cambridge, Massachusetts 02138 United States
                  </p>
                </div>

                {/* BADGE */}
                <div className="badge-wrapper">
                  <img src="/assets/badge.png" className="badge-img" alt="badge" />
                  <span className="badge-text">1</span>
                </div>

              </div>

              {/* STATS */}
              <div className="stats-section">

                <div className="stat">
                  <h6>PRIVATE</h6>
                  <p>UNIVERSITY</p>
                </div>

                <div className="stat">
                  <h6>20,593</h6>
                  <p>TOTAL STUDENTS</p>
                </div>

                <div className="stat">
                  <h6>5,355</h6>
                  <p>INTERNATIONAL STUDENTS</p>
                </div>

              </div>

              {/* BUTTONS */}
              <div className="btn-section">

                <button className="gold-btn">
                  ⭐ RateMyChances
                </button>

                <button className="gray-btn">
                  📊 Visa Approval Chances
                </button>

              </div>

            </div>
            

            {/* RIGHT IMAGE */}
            <div className="header-right">
              <img src="/assets/harvard.png" alt="harvard" />
            </div>
            

          </div>

        </div>
                <div className="tabs-container">

  <div className="tabs">
    <button className="tab active">Engineering</button>
    <button className="tab">Business</button>
    <button className="tab">Law</button>
    <button className="tab">Medicine</button>
    <button className="tab">Undergrad</button>
  </div>

</div>
      </div>

    </div>
  );
}
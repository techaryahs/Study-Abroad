export default function Home() {
  return (
    <main className="bg-black text-white">

      {/* ================= HERO SECTION ================= */}
      <section className="relative min-h-screen flex items-center px-8 bg-gradient-to-r from-black via-gray-900 to-black">

        <div className="max-w-xl z-10">
          <h1 className="text-5xl font-bold leading-tight mb-6">
            Principal-Led Path to <br />
            <span className="text-yellow-400">
              Ivy League & Top Global Universities
            </span>
          </h1>

          <p className="text-gray-300 mb-6">
            Personalized higher study guidance for USA, UK, Germany,
            Australia, Ireland, and Dubai.
          </p>

          <div className="flex gap-4">
            <button className="bg-yellow-400 text-black px-6 py-3 rounded-lg font-semibold hover:scale-105 transition">
              Book Free Profile Evaluation
            </button>

            <button className="border border-white px-6 py-3 rounded-lg hover:bg-white hover:text-black transition">
              Talk to an Expert
            </button>
          </div>
        </div>

        {/* RIGHT IMAGE */}
        <div className="absolute right-0 bottom-0 w-1/2 hidden md:block">
          <img
            src="/hero.png"
            alt="hero"
            className="w-full object-contain"
          />
        </div>
      </section>

      {/* ================= SERVICES ================= */}
      <section className="py-16 px-8 text-center">
        <h2 className="text-3xl font-bold mb-10">
          Why Students & Parents Trust Us
        </h2>

        <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-6">
          {[
            "Admission Guidance",
            "University Shortlisting",
            "SOP & LOR Support",
            "Scholarship Assistance",
            "Visa Guidance",
            "Profile Building",
          ].map((item, i) => (
            <div
              key={i}
              className="bg-white text-black p-4 rounded-xl shadow-lg hover:scale-105 transition"
            >
              {item}
            </div>
          ))}
        </div>

        <button className="mt-8 bg-yellow-400 text-black px-6 py-3 rounded-lg">
          Explore All Services
        </button>
      </section>

      {/* ================= COUNTRIES ================= */}
      <section className="py-12 text-center">
        <h2 className="text-2xl font-bold mb-6">
          Study Destinations
        </h2>

        <div className="flex flex-wrap justify-center gap-6">
          {["USA", "UK", "Germany", "Australia", "Ireland", "Dubai", "Canada"].map(
            (c, i) => (
              <div
                key={i}
                className="bg-gray-800 px-6 py-3 rounded-full"
              >
                {c}
              </div>
            )
          )}
        </div>
      </section>

      {/* ================= STATS ================= */}
      <section className="py-16 text-center bg-black">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
          <div>
            <h3 className="text-3xl font-bold text-yellow-400">15+</h3>
            <p>Countries</p>
          </div>

          <div>
            <h3 className="text-3xl font-bold text-yellow-400">360+</h3>
            <p>Universities</p>
          </div>

          <div>
            <h3 className="text-3xl font-bold text-yellow-400">1000+</h3>
            <p>Students</p>
          </div>

          <div>
            <h3 className="text-3xl font-bold text-yellow-400">500+</h3>
            <p>Admissions</p>
          </div>

          <div>
            <h3 className="text-3xl font-bold text-yellow-400">5★</h3>
            <p>Rating</p>
          </div>
        </div>

        <div className="mt-8 flex justify-center gap-4">
          <button className="bg-yellow-400 text-black px-6 py-3 rounded-lg">
            Book Now
          </button>

          <button className="border border-white px-6 py-3 rounded-lg">
            WhatsApp Us
          </button>
        </div>
      </section>

    </main>
  );
}
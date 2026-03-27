export default function Footer() {
  return (
    <footer className="bg-black text-white border-t border-gray-800">

      {/* TOP SECTION */}
      <div className="px-8 py-16 grid md:grid-cols-4 gap-10">

        {/* BRAND */}
        <div>
          <h2 className="text-2xl font-bold text-yellow-400 mb-4">
            Dr. Alam
          </h2>
          <p className="text-gray-400">
            Your trusted partner for studying abroad. We guide students
            to top global universities with personalized support.
          </p>
        </div>

        {/* QUICK LINKS */}
        <div>
          <h3 className="font-semibold mb-4 text-yellow-400">
            Quick Links
          </h3>
          <ul className="space-y-2 text-gray-400">
            <li><a href="/" className="hover:text-yellow-400">Home</a></li>
            <li><a href="/about" className="hover:text-yellow-400">About</a></li>
            <li><a href="/services" className="hover:text-yellow-400">Services</a></li>
            <li><a href="/blogs" className="hover:text-yellow-400">Blogs</a></li>
          </ul>
        </div>

        {/* SERVICES */}
        <div>
          <h3 className="font-semibold mb-4 text-yellow-400">
            Services
          </h3>
          <ul className="space-y-2 text-gray-400">
            <li>Admission Guidance</li>
            <li>Visa Assistance</li>
            <li>Scholarships</li>
            <li>Profile Building</li>
          </ul>
        </div>

        {/* CONTACT */}
        <div>
          <h3 className="font-semibold mb-4 text-yellow-400">
            Contact
          </h3>
          <p className="text-gray-400 mb-2">
            📍 Mumbai, India
          </p>
          <p className="text-gray-400 mb-2">
            📞 +91 89876 54321
          </p>
          <p className="text-gray-400">
            ✉ info@dralam.com
          </p>
        </div>

      </div>

      {/* BOTTOM */}
      <div className="border-t border-gray-800 text-center py-6 text-gray-500 text-sm">
        © {new Date().getFullYear()} Dr. Alam. All rights reserved.
      </div>

    </footer>
  );
}
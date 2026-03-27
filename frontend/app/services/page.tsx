export default function ServicesPage() {
    return (
        <main className="bg-black text-white px-8 py-20 min-h-screen">

            <h1 className="text-5xl font-bold mb-10 text-yellow-400">
                Our Services
            </h1>

            <div className="grid md:grid-cols-3 gap-6">
                {[
                    "Admission Guidance",
                    "University Shortlisting",
                    "SOP & LOR Support",
                    "Scholarship Assistance",
                    "Visa Processing",
                    "Profile Building",
                ].map((service, i) => (
                    <div
                        key={i}
                        className="bg-white text-black p-6 rounded-xl shadow-lg hover:scale-105 transition"
                    >
                        <h3 className="font-semibold text-lg mb-2">
                            {service}
                        </h3>
                        <p className="text-gray-600">
                            Comprehensive support for your study abroad journey.
                        </p>
                    </div>
                ))}
            </div>

        </main>
    );
}
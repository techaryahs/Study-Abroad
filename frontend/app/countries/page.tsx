export default function CountriesPage() {
    return (
        <main className="bg-black text-white px-8 py-20 min-h-screen">

            <h1 className="text-5xl font-bold text-yellow-400 mb-10">
                Study Destinations
            </h1>

            <div className="grid md:grid-cols-4 gap-6">
                {[
                    "USA",
                    "UK",
                    "Germany",
                    "Australia",
                    "Canada",
                    "Ireland",
                    "Dubai",
                    "New Zealand",
                ].map((country, i) => (
                    <div
                        key={i}
                        className="bg-gray-900 p-6 rounded-xl text-center hover:bg-yellow-400 hover:text-black transition"
                    >
                        {country}
                    </div>
                ))}
            </div>

        </main>
    );
}
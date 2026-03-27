export default function ScholarshipsPage() {
    return (
        <main className="bg-black text-white px-8 py-20 min-h-screen">

            <h1 className="text-5xl font-bold text-yellow-400 mb-10">
                Scholarships
            </h1>

            <div className="space-y-6 max-w-3xl">
                {[1, 2, 3].map((_, i) => (
                    <div
                        key={i}
                        className="bg-gray-900 p-6 rounded-xl flex justify-between items-center"
                    >
                        <div>
                            <h3 className="font-semibold">
                                Scholarship Program {i + 1}
                            </h3>
                            <p className="text-gray-400 text-sm">
                                Available for international students
                            </p>
                        </div>

                        <button className="bg-yellow-400 text-black px-4 py-2 rounded-lg">
                            Apply
                        </button>
                    </div>
                ))}
            </div>

        </main>
    );
}
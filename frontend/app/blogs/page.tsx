export default function BlogsPage() {
    return (
        <main className="bg-black text-white px-8 py-20 min-h-screen">

            <h1 className="text-5xl font-bold text-yellow-400 mb-10">
                Blogs & Insights
            </h1>

            <div className="grid md:grid-cols-3 gap-6">
                {[1, 2, 3].map((_, i) => (
                    <div key={i} className="bg-gray-900 rounded-xl overflow-hidden">
                        <div className="h-40 bg-gray-700"></div>

                        <div className="p-4">
                            <h3 className="font-semibold mb-2">
                                Study Abroad Guide {i + 1}
                            </h3>
                            <p className="text-gray-400 text-sm">
                                Tips and insights for international students.
                            </p>
                        </div>
                    </div>
                ))}
            </div>

        </main>
    );
}
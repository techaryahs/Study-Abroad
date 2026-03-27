export default function AboutPage() {
    return (
        <main className="bg-black text-white px-8 py-20 min-h-screen">

            <h1 className="text-5xl font-bold mb-6 text-yellow-400">
                About Us
            </h1>

            <p className="max-w-3xl text-gray-300 leading-relaxed mb-10">
                We provide expert guidance for students aiming to study abroad
                at top universities worldwide. Our mission is to simplify the
                admission journey and help students achieve global success.
            </p>

            <div className="grid md:grid-cols-3 gap-6">
                {[
                    "Expert Counseling",
                    "Global University Network",
                    "End-to-End Support",
                ].map((item, i) => (
                    <div key={i} className="bg-gray-900 p-6 rounded-xl">
                        <h3 className="text-xl font-semibold text-yellow-400 mb-2">
                            {item}
                        </h3>
                        <p className="text-gray-400">
                            High-quality guidance tailored for every student.
                        </p>
                    </div>
                ))}
            </div>

        </main>
    );
}
import 'package:flutter/material.dart';

class KnowMore extends StatelessWidget {
  const KnowMore({super.key});

  @override
  Widget build(BuildContext context) {
    final isMobile = MediaQuery.of(context).size.width < 600;

    final List<Map<String, dynamic>> infoCards = [
      {
        "title": "Strategic Academic Advantage",
        "description":
            "Collaborative research improves your profile for Masters & PhD.",
        "icon": Icons.info,
        "color": Colors.orange
      },
      {
        "title": "Protocol for Collaboration",
        "description":
            "Connect with lead investigator and start research drafting.",
        "icon": Icons.check_circle,
        "color": Colors.green
      },
      {
        "title": "Institutional Security",
        "description":
            "All participants are verified for secure collaboration.",
        "icon": Icons.security,
        "color": Colors.blue
      },
      {
        "title": "Direct Advisory",
        "description":
            "Support team helps you choose the best research group.",
        "icon": Icons.help,
        "color": Colors.orange
      },
    ];

    return SingleChildScrollView(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          /// 🔹 Heading
          const Text(
            "Institutional Research Insights",
            style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
          ),

          const SizedBox(height: 10),

          const Text(
            "Participating in research clusters is important for academic growth.",
            style: TextStyle(fontSize: 14),
          ),

          const SizedBox(height: 20),

          /// 🔹 Cards Grid (Responsive)
          GridView.builder(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            itemCount: infoCards.length,
            gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
              crossAxisCount: isMobile ? 1 : 2,
              crossAxisSpacing: 12,
              mainAxisSpacing: 12,
              childAspectRatio: isMobile ? 1.4 : 1.6,
            ),
            itemBuilder: (context, index) {
              final card = infoCards[index];

              return Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(20),
                  border: Border.all(color: Colors.grey.shade200),
                  boxShadow: [
                    BoxShadow(
                      blurRadius: 5,
                      color: Colors.black12,
                    )
                  ],
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    /// 🔹 Icon
                    Container(
                      padding: const EdgeInsets.all(10),
                      decoration: BoxDecoration(
                        color: card["color"].withOpacity(0.1),
                        borderRadius: BorderRadius.circular(10),
                      ),
                      child: Icon(card["icon"], color: card["color"]),
                    ),

                    const SizedBox(height: 10),

                    /// 🔹 Title
                    Text(
                      card["title"],
                      style: const TextStyle(
                          fontWeight: FontWeight.bold, fontSize: 14),
                    ),

                    const SizedBox(height: 6),

                    /// 🔹 Description
                    Text(
                      card["description"],
                      style: const TextStyle(fontSize: 14),
                    ),
                  ],
                ),
              );
            },
          ),

          const SizedBox(height: 30),

          /// 🔥 Bottom CTA Section
          Container(
            width: double.infinity,
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              color: Colors.black,
              borderRadius: BorderRadius.circular(25),
            ),
            child: Column(
              children: [
                const Text(
                  "Complex Inquiries?",
                  style: TextStyle(
                      color: Colors.white,
                      fontSize: 20,
                      fontWeight: FontWeight.bold),
                ),

                const SizedBox(height: 10),

                const Text(
                  "Our advisors will guide you for research.",
                  textAlign: TextAlign.center,
                  style: TextStyle(color: Colors.white70, fontSize: 14),
                ),

                const SizedBox(height: 20),

                ElevatedButton(
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.orange,
                    padding: const EdgeInsets.symmetric(
                        horizontal: 30, vertical: 12),
                  ),
                  onPressed: () {
                    /// 🔹 Navigate to contact page
                    Navigator.pushNamed(context, "/contact");
                  },
                  child: const Text("Speak With a Specialist"),
                )
              ],
            ),
          )
        ],
      ),
    );
  }
}
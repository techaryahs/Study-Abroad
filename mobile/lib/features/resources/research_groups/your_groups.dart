import 'package:flutter/material.dart';

class YourGroups extends StatelessWidget {
  final VoidCallback? onCreateClick;

  const YourGroups({super.key, this.onCreateClick});

  @override
  Widget build(BuildContext context) {
    final isMobile = MediaQuery.of(context).size.width < 600;

    return Container(
      width: double.infinity,
      padding: EdgeInsets.symmetric(
        vertical: 40,
        horizontal: isMobile ? 16 : 40,
      ),
      margin: const EdgeInsets.all(10),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(30),
        border: Border.all(color: Colors.grey.shade200),
        boxShadow: const [
          BoxShadow(
            blurRadius: 8,
            color: Colors.black12,
          )
        ],
      ),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          /// 🔹 Icon + Circle
          Stack(
            alignment: Alignment.center,
            children: [
              Container(
                width: 100,
                height: 100,
                decoration: BoxDecoration(
                  border: Border.all(
                    color: Colors.orange.withOpacity(0.3),
                    width: 2,
                  ),
                  shape: BoxShape.circle,
                ),
              ),
              Icon(
                Icons.search,
                size: 50,
                color: Colors.orange.withOpacity(0.6),
              ),
              Positioned(
                top: 0,
                right: 0,
                child: Container(
                  width: 28,
                  height: 28,
                  decoration: const BoxDecoration(
                    color: Colors.black,
                    shape: BoxShape.circle,
                  ),
                  child: const Center(
                    child: Text(
                      "?",
                      style: TextStyle(color: Colors.orange),
                    ),
                  ),
                ),
              )
            ],
          ),

          const SizedBox(height: 20),

          /// 🔹 Title
          Text(
            "No Active Collaborations Identified",
            textAlign: TextAlign.center,
            style: TextStyle(
              fontSize: isMobile ? 18 : 24,
              fontWeight: FontWeight.bold,
            ),
          ),

          const SizedBox(height: 10),

          /// 🔹 Subtitle
          const Text(
            "Initiate a new research cluster to begin your journey.",
            textAlign: TextAlign.center,
            style: TextStyle(fontSize: 12, color: Colors.grey),
          ),

          const SizedBox(height: 25),

          /// 🔹 Button
          ElevatedButton.icon(
            style: ElevatedButton.styleFrom(
              backgroundColor: Colors.black,
              padding: EdgeInsets.symmetric(
                horizontal: isMobile ? 20 : 30,
                vertical: 14,
              ),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(12),
              ),
            ),
            onPressed: onCreateClick,
            icon: const Icon(Icons.arrow_forward, size: 18),
            label: const Text(
              "Initiate Cluster",
              style: TextStyle(fontSize: 12),
            ),
          )
        ],
      ),
    );
  }
}
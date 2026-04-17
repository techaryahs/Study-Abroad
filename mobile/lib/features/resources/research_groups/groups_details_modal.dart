import 'package:flutter/material.dart';

class GroupDetailsModal {
  static void show({
    required BuildContext context,
    required Map<String, dynamic> group,
    required VoidCallback onJoinClick,
  }) {
    showDialog(
      context: context,
      barrierDismissible: true,
      builder: (context) {
        final isMobile = MediaQuery.of(context).size.width < 600;

        return Dialog(
          backgroundColor: Colors.white,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(30),
          ),
          child: Container(
            width: isMobile ? double.infinity : 500,
            constraints: const BoxConstraints(maxHeight: 650),
            padding: const EdgeInsets.all(20),
            child: Column(
              children: [
                /// 🔹 Header
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Text(
                      "CLUSTER SPECIFICATIONS",
                      style: TextStyle(
                        fontSize: 10,
                        letterSpacing: 2,
                        fontWeight: FontWeight.bold,
                        color: Colors.grey,
                      ),
                    ),
                    IconButton(
                      icon: const Icon(Icons.close),
                      onPressed: () => Navigator.pop(context),
                    )
                  ],
                ),

                const SizedBox(height: 10),

                /// 🔹 Body Scroll
                Expanded(
                  child: SingleChildScrollView(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [

                        /// 🔹 Main Info
                        Row(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            CircleAvatar(
                              radius: 30,
                              backgroundColor: Colors.black,
                              child: Text(
                                group["initials"] ?? "",
                                style: const TextStyle(
                                  color: Colors.orange,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                            ),
                            const SizedBox(width: 15),

                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(
                                    "Investigator ${group["author"]} / ${group["title"]}",
                                    style: TextStyle(
                                      fontSize: isMobile ? 16 : 20,
                                      fontWeight: FontWeight.bold,
                                    ),
                                  ),
                                  const SizedBox(height: 6),
                                  Text(
                                    '"${group["description"]}"',
                                    style: const TextStyle(
                                      fontSize: 12,
                                      color: Colors.grey,
                                      fontStyle: FontStyle.italic,
                                    ),
                                  ),
                                ],
                              ),
                            )
                          ],
                        ),

                        const SizedBox(height: 20),

                        /// 🔹 Stats
                        Row(
                          children: [
                            Expanded(
                              child: _infoBox(
                                "Saturation",
                                "${group["spots"]} Members",
                              ),
                            ),
                            const SizedBox(width: 10),
                            Expanded(
                              child: _infoBox(
                                "Initiated",
                                group["date"] ?? "",
                              ),
                            ),
                          ],
                        ),

                        const SizedBox(height: 20),

                        /// 🔹 Members Title
                        Row(
                          children: const [
                            Icon(Icons.people, color: Colors.orange),
                            SizedBox(width: 8),
                            Text(
                              "Scientific Personnel",
                              style: TextStyle(
                                fontSize: 11,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                          ],
                        ),

                        const SizedBox(height: 10),

                        /// 🔹 Members List
                        Container(
                          decoration: BoxDecoration(
                            border: Border.all(color: Colors.grey.shade200),
                            borderRadius: BorderRadius.circular(20),
                          ),
                          child: Column(
                            children: [

                              /// 🔹 Principal Investigator
                              ListTile(
                                leading: const CircleAvatar(
                                  backgroundColor: Colors.orange,
                                  child: Text("PI",
                                      style: TextStyle(color: Colors.white)),
                                ),
                                title: Text(
                                  group["author"],
                                  style: const TextStyle(
                                      fontWeight: FontWeight.bold),
                                ),
                                subtitle: const Text("Lead Author"),
                                trailing: const Icon(Icons.message),
                              ),

                              /// 🔹 Available Slots
                              ...List.generate(5, (index) {
                                return Column(
                                  children: [
                                    const Divider(height: 1),
                                    ListTile(
                                      leading: CircleAvatar(
                                        backgroundColor: Colors.white,
                                        child: Icon(Icons.person_outline,
                                            color: Colors.grey.shade400),
                                      ),
                                      title: const Text(
                                        "Available Slot",
                                        style: TextStyle(fontSize: 13),
                                      ),
                                      trailing: IconButton(
                                        icon: const Icon(Icons.add,
                                            color: Colors.orange),
                                        onPressed: () {
                                          Navigator.pop(context);
                                          onJoinClick();
                                        },
                                      ),
                                    ),
                                  ],
                                );
                              })
                            ],
                          ),
                        ),

                        const SizedBox(height: 20),

                        /// 🔹 Apply Button
                        SizedBox(
                          width: double.infinity,
                          child: ElevatedButton(
                            style: ElevatedButton.styleFrom(
                              backgroundColor: Colors.black,
                              padding:
                                  const EdgeInsets.symmetric(vertical: 16),
                              shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(15),
                              ),
                            ),
                            onPressed: () {
                              Navigator.pop(context);
                              onJoinClick();
                            },
                            child: const Text(
                              "Apply for Cluster Membership",
                              style: TextStyle(fontSize: 12),
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ],
            ),
          ),
        );
      },
    );
  }

  /// 🔹 Info Box Widget
  static Widget _infoBox(String title, String value) {
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: Colors.grey.shade100,
        borderRadius: BorderRadius.circular(15),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(title,
              style: const TextStyle(fontSize: 10, color: Colors.grey)),
          const SizedBox(height: 5),
          Text(value,
              style: const TextStyle(
                  fontWeight: FontWeight.bold, fontSize: 14)),
        ],
      ),
    );
  }
}
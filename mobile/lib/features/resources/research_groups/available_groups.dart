import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

class AvailableGroups extends StatefulWidget {
  const AvailableGroups({super.key});

  @override
  State<AvailableGroups> createState() => _AvailableGroupsState();
}

class _AvailableGroupsState extends State<AvailableGroups> {
  int? openShareId;
  int? copiedId;

  final List<Map<String, dynamic>> groups = [
    {
      "id": 1,
      "title": "Medicine and Clinical Research",
      "author": "P C",
      "initials": "PC",
      "description": "Research on clinical systems and analytics.",
      "date": "Apr 29, 2025",
      "spots": "1/6"
    },
    {
      "id": 2,
      "title": "Blockchain & Supply Chain",
      "author": "A K",
      "initials": "AK",
      "description": "Decentralized logistics framework.",
      "date": "Feb 02, 2025",
      "spots": "1/6"
    },
  ];

  @override
  Widget build(BuildContext context) {
    final isMobile = MediaQuery.of(context).size.width < 600;

    return GridView.builder(
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      itemCount: groups.length,
      gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: isMobile ? 1 : 2, // 🔥 responsive
        crossAxisSpacing: 16,
        mainAxisSpacing: 16,
        childAspectRatio: isMobile ? 0.9 : 1.2,
      ),
      itemBuilder: (context, index) {
        final group = groups[index];

        return GestureDetector(
          onTap: () {},
          child: Card(
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(20),
            ),
            elevation: 4,
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  /// 🔹 Header
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        group["date"],
                        style: const TextStyle(fontSize: 14),
                      ),
                      PopupMenuButton<String>(
                        onSelected: (value) {
                          if (value == "copy") {
                            Clipboard.setData(
                                const ClipboardData(text: "link"));
                            setState(() => copiedId = group["id"]);
                          }
                        },
                        itemBuilder: (context) => [
                          const PopupMenuItem(
                              value: "whatsapp", child: Text("WhatsApp")),
                          const PopupMenuItem(
                              value: "telegram", child: Text("Telegram")),
                          const PopupMenuItem(
                              value: "copy", child: Text("Copy Link")),
                        ],
                      )
                    ],
                  ),

                  const SizedBox(height: 10),

                  /// 🔹 Title
                  Text(
                    group["title"],
                    style: const TextStyle(
                        fontWeight: FontWeight.bold, fontSize: 16),
                  ),

                  const SizedBox(height: 10),

                  /// 🔹 Author
                  Row(
                    children: [
                      CircleAvatar(
                        backgroundColor: Colors.black,
                        child: Text(
                          group["initials"],
                          style: const TextStyle(color: Colors.white),
                        ),
                      ),
                      const SizedBox(width: 10),
                      Text(group["author"]),
                    ],
                  ),

                  const SizedBox(height: 10),

                  /// 🔹 Description
                  Text(
                    group["description"],
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                  ),

                  const Spacer(),

                  /// 🔹 Buttons
                  Row(
                    children: [
                      Expanded(
                        child: OutlinedButton(
                          onPressed: () {},
                          child: const Text("Profile"),
                        ),
                      ),
                      const SizedBox(width: 10),
                      Expanded(
                        child: ElevatedButton(
                          onPressed: () {},
                          child: const Text("Join"),
                        ),
                      ),
                    ],
                  )
                ],
              ),
            ),
          ),
        );
      },
    );
  }
}
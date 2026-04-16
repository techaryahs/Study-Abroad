import 'package:flutter/material.dart';
import 'dart:convert';
import 'package:flutter/services.dart' show rootBundle;

class ScholarshipPage extends StatefulWidget {
  const ScholarshipPage({super.key});

  @override
  State<ScholarshipPage> createState() => _ScholarshipPageState();
}

class _ScholarshipPageState extends State<ScholarshipPage> {
  List scholarships = [];
  List filtered = [];
  String search = "";
  String selectedCategory = "All Categories";
  List categories = ["All Categories"];

  @override
  void initState() {
    super.initState();
    loadData();
  }

  Future<void> loadData() async {
    final String response =
        await rootBundle.loadString('assets/scholarship.json');
    final data = json.decode(response);

    setState(() {
      scholarships = data['scholarships'];
      filtered = scholarships;

      final cats =
          scholarships.map((e) => e['category']).toSet().toList();
      categories = ["All Categories", ...cats];
    });
  }

  void filterData() {
    setState(() {
      filtered = scholarships.where((s) {
        final matchesSearch = s['name']
                .toLowerCase()
                .contains(search.toLowerCase()) ||
            s['sponsor']
                .toLowerCase()
                .contains(search.toLowerCase());

        final matchesCategory = selectedCategory == "All Categories" ||
            s['category'] == selectedCategory;

        return matchesSearch && matchesCategory;
      }).toList();
    });
  }

  @override
  Widget build(BuildContext context) {
    final isMobile = MediaQuery.of(context).size.width < 600;

    return Scaffold(
      backgroundColor: const Color(0xFFFDFBF7),
      body: SafeArea(
        child: Column(
          children: [
            /// 🔹 HERO + SEARCH
            Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                children: [
                  const SizedBox(height: 10),
                  Text(
                    "Elite Scholarships",
                    textAlign: TextAlign.center,
                    style: TextStyle(
                      fontSize: isMobile ? 26 : 40,
                      fontWeight: FontWeight.bold,
                      color: const Color(0xFF2D2926),
                    ),
                  ),
                  const SizedBox(height: 20),

                  /// 🔍 Search Box
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 16),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(30),
                      border: Border.all(color: Colors.grey.shade300),
                    ),
                    child: TextField(
                      onChanged: (val) {
                        search = val;
                        filterData();
                      },
                      decoration: const InputDecoration(
                        icon: Icon(Icons.search),
                        hintText: "Search scholarships...",
                        border: InputBorder.none,
                      ),
                    ),
                  ),

                  const SizedBox(height: 10),

                  /// 🔽 Category Dropdown
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 16),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(30),
                      border: Border.all(color: Colors.grey.shade300),
                    ),
                    child: DropdownButton(
                      isExpanded: true,
                      value: selectedCategory,
                      underline: const SizedBox(),
                      items: categories.map((cat) {
                        return DropdownMenuItem(
                          value: cat,
                          child: Text(cat),
                        );
                      }).toList(),
                      onChanged: (val) {
                        selectedCategory = val.toString();
                        filterData();
                      },
                    ),
                  ),
                ],
              ),
            ),

            /// 🔹 LIST
            Expanded(
              child: filtered.isEmpty
                  ? const Center(
                      child: Text("No scholarships found"),
                    )
                  : ListView.builder(
                      padding: const EdgeInsets.all(16),
                      itemCount: filtered.length,
                      itemBuilder: (context, index) {
                        final s = filtered[index];

                        return Container(
                          margin: const EdgeInsets.only(bottom: 16),
                          padding: const EdgeInsets.all(16),
                          decoration: BoxDecoration(
                            color: Colors.white,
                            borderRadius: BorderRadius.circular(16),
                            border: Border.all(
                                color: Colors.grey.shade300),
                          ),
                          child: Column(
                            crossAxisAlignment:
                                CrossAxisAlignment.start,
                            children: [
                              /// Category
                              Container(
                                padding: const EdgeInsets.symmetric(
                                    horizontal: 10, vertical: 4),
                                decoration: BoxDecoration(
                                  color: const Color(0xFFF8F5F0),
                                  borderRadius:
                                      BorderRadius.circular(8),
                                ),
                                child: Text(
                                  s['category'],
                                  style: const TextStyle(
                                      fontSize: 10,
                                      fontWeight: FontWeight.bold,
                                      color: Color(0xFFC5A059)),
                                ),
                              ),

                              const SizedBox(height: 10),

                              /// Title
                              Text(
                                s['name'],
                                style: const TextStyle(
                                  fontSize: 18,
                                  fontWeight: FontWeight.bold,
                                  color: Color(0xFF2D2926),
                                ),
                              ),

                              const SizedBox(height: 6),

                              /// Sponsor
                              Text(
                                "Provider: ${s['sponsor']}",
                                style: const TextStyle(
                                    fontSize: 12,
                                    color: Colors.grey),
                              ),

                              const SizedBox(height: 12),

                              /// Bottom Row
                              Row(
                                mainAxisAlignment:
                                    MainAxisAlignment.spaceBetween,
                                children: [
                                  Column(
                                    crossAxisAlignment:
                                        CrossAxisAlignment.start,
                                    children: [
                                      const Text(
                                        "Deadline",
                                        style: TextStyle(
                                            fontSize: 10,
                                            color: Colors.grey),
                                      ),
                                      Text(
                                        s['deadline'],
                                        style: const TextStyle(
                                            fontWeight:
                                                FontWeight.bold),
                                      ),
                                    ],
                                  ),
                                  Column(
                                    crossAxisAlignment:
                                        CrossAxisAlignment.end,
                                    children: [
                                      const Text(
                                        "Amount",
                                        style: TextStyle(
                                            fontSize: 10,
                                            color: Colors.grey),
                                      ),
                                      Text(
                                        s['amount'],
                                        style: const TextStyle(
                                            fontWeight:
                                                FontWeight.bold),
                                      ),
                                    ],
                                  ),
                                ],
                              ),
                            ],
                          ),
                        );
                      },
                    ),
            ),

            /// 🔹 CTA
            Container(
              margin: const EdgeInsets.all(16),
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                color: const Color(0xFF2D2926),
                borderRadius: BorderRadius.circular(20),
              ),
              child: Column(
                children: const [
                  Text(
                    "Expert Financial Guidance",
                    style: TextStyle(
                        color: Colors.white,
                        fontSize: 18,
                        fontWeight: FontWeight.bold),
                  ),
                  SizedBox(height: 10),
                  Text(
                    "Connect with our experts to maximize your chances.",
                    textAlign: TextAlign.center,
                    style: TextStyle(color: Colors.white70),
                  ),
                ],
              ),
            )
          ],
        ),
      ),
    );
  }
}
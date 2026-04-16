import 'package:flutter/material.dart';

class ReviewsPage extends StatefulWidget {
  const ReviewsPage({super.key});

  @override
  State<ReviewsPage> createState() => _ReviewsPageState();
}

class _ReviewsPageState extends State<ReviewsPage> {
  List<Map<String, dynamic>> reviews = [
    {
      "name": "Arjun Sharma",
      "service": "Visa Help",
      "rating": 5,
      "body": "Amazing service, helped me a lot!",
      "date": "10 Apr 2026"
    },
    {
      "name": "Priya Patel",
      "service": "SOP Writing",
      "rating": 4,
      "body": "Very professional and helpful.",
      "date": "12 Apr 2026"
    },
  ];

  String selectedFilter = "All";

  final List<String> services = [
    "All",
    "Visa Help",
    "SOP Writing",
    "GRE Preparation",
  ];

  /// ⭐ Star Widget
  Widget buildStars(int rating, {double size = 16}) {
    return Row(
      children: List.generate(5, (index) {
        return Icon(
          Icons.star,
          size: size,
        );
      }),
    );
  }

  /// 🧾 Review Card
  Widget reviewCard(Map<String, dynamic> review) {
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: Colors.white,
        border: Border.all(color: Colors.grey.shade300),
        borderRadius: BorderRadius.circular(14),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          /// Name + Rating
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                review["name"],
                style: const TextStyle(fontWeight: FontWeight.bold),
              ),
              buildStars(review["rating"]),
            ],
          ),

          const SizedBox(height: 6),

          /// Service
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
            decoration: BoxDecoration(
              color: Colors.grey.shade200,
              borderRadius: BorderRadius.circular(20),
            ),
            child: Text(
              review["service"],
              style: const TextStyle(fontSize: 10),
            ),
          ),

          const SizedBox(height: 8),

          /// Body
          Text(
            review["body"],
            style: const TextStyle(color: Colors.black54),
          ),

          const SizedBox(height: 6),

          /// Date
          Text(
            review["date"],
            style: const TextStyle(fontSize: 10, color: Colors.grey),
          ),
        ],
      ),
    );
  }

  /// ✍️ Add Review Bottom Sheet
  void openForm() {
    int rating = 0;
    TextEditingController name = TextEditingController();
    TextEditingController reviewText = TextEditingController();
    String service = "";

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      builder: (_) {
        return Padding(
          padding: EdgeInsets.only(
              bottom: MediaQuery.of(context).viewInsets.bottom),
          child: StatefulBuilder(
            builder: (context, setState) {
              return Container(
                padding: const EdgeInsets.all(16),
                child: SingleChildScrollView(
                  child: Column(
                    children: [
                      const Text("Write Review",
                          style: TextStyle(
                              fontSize: 18, fontWeight: FontWeight.bold)),

                      const SizedBox(height: 10),

                      /// Name
                      TextField(
                        controller: name,
                        decoration: const InputDecoration(
                          labelText: "Name",
                          border: OutlineInputBorder(),
                        ),
                      ),

                      const SizedBox(height: 10),

                      /// Service Dropdown
                      DropdownButtonFormField(
                        items: services
                            .where((e) => e != "All")
                            .map((e) => DropdownMenuItem(
                                  value: e,
                                  child: Text(e),
                                ))
                            .toList(),
                        onChanged: (val) => service = val.toString(),
                        decoration: const InputDecoration(
                          labelText: "Service",
                          border: OutlineInputBorder(),
                        ),
                      ),

                      const SizedBox(height: 10),

                      /// Rating
                      Row(
                        children: List.generate(5, (i) {
                          return IconButton(
                            icon: Icon(
                              Icons.star,
                              color: rating > i
                                  ? Colors.amber
                                  : Colors.grey,
                            ),
                            onPressed: () {
                              setState(() {
                                rating = i + 1;
                              });
                            },
                          );
                        }),
                      ),

                      /// Review Text
                      TextField(
                        controller: reviewText,
                        maxLines: 3,
                        decoration: const InputDecoration(
                          labelText: "Review",
                          border: OutlineInputBorder(),
                        ),
                      ),

                      const SizedBox(height: 15),

                      ElevatedButton(
                        onPressed: () {
                          if (name.text.isEmpty ||
                              reviewText.text.isEmpty ||
                              rating == 0 ||
                              service.isEmpty) {
                            return;
                          }

                          setState(() {});

                          this.setState(() {
                            reviews.insert(0, {
                              "name": name.text,
                              "service": service,
                              "rating": rating,
                              "body": reviewText.text,
                              "date": "Today"
                            });
                          });

                          Navigator.pop(context);
                        },
                        child: const Text("Submit"),
                      )
                    ],
                  ),
                ),
              );
            },
          ),
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    List filtered = selectedFilter == "All"
        ? reviews
        : reviews.where((r) => r["service"] == selectedFilter).toList();

    return Scaffold(
      backgroundColor: const Color(0xFFFDFBF7),

      /// APPBAR
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        title: const Text("Reviews", style: TextStyle(color: Colors.black)),
        centerTitle: true,
      ),

      /// BODY
      body: Column(
        children: [

          /// 🔥 HERO
          Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              children: [
                const Text(
                  "Real Reviews",
                  style: TextStyle(
                      fontSize: 26, fontWeight: FontWeight.bold),
                ),
                const SizedBox(height: 6),
                Text(
                  "${reviews.length} Reviews",
                  style: const TextStyle(color: Colors.grey),
                ),
              ],
            ),
          ),

          /// 🎯 FILTER
          SizedBox(
            height: 40,
            child: ListView.builder(
              scrollDirection: Axis.horizontal,
              itemCount: services.length,
              itemBuilder: (context, i) {
                return GestureDetector(
                  onTap: () {
                    setState(() {
                      selectedFilter = services[i];
                    });
                  },
                  child: Container(
                    margin: const EdgeInsets.symmetric(horizontal: 6),
                    padding: const EdgeInsets.symmetric(horizontal: 12),
                    decoration: BoxDecoration(
                      color: selectedFilter == services[i]
                          ? Colors.black
                          : Colors.white,
                      borderRadius: BorderRadius.circular(20),
                      border: Border.all(color: Colors.grey),
                    ),
                    child: Center(
                      child: Text(
                        services[i],
                        style: TextStyle(
                          color: selectedFilter == services[i]
                              ? Colors.white
                              : Colors.black,
                          fontSize: 12,
                        ),
                      ),
                    ),
                  ),
                );
              },
            ),
          ),

          const SizedBox(height: 10),

          /// 📋 LIST
          Expanded(
            child: ListView.builder(
              padding: const EdgeInsets.all(16),
              itemCount: filtered.length,
              itemBuilder: (context, i) {
                return Padding(
                  padding: const EdgeInsets.only(bottom: 12),
                  child: reviewCard(filtered[i]),
                );
              },
            ),
          ),
        ],
      ),

      /// ➕ FLOAT BUTTON
      floatingActionButton: FloatingActionButton(
        onPressed: openForm,
        child: const Icon(Icons.add),
      ),
    );
  }
}
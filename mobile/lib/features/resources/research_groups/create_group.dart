import 'package:flutter/material.dart';

class CreateGroupModal extends StatefulWidget {
  const CreateGroupModal({super.key});

  @override
  State<CreateGroupModal> createState() => _CreateGroupModalState();
}

class _CreateGroupModalState extends State<CreateGroupModal> {
  int step = 1;

  String field = "";
  String description = "";
  int coAuthors = 1;

  final TextEditingController fieldController = TextEditingController();
  final TextEditingController descController = TextEditingController();

  final List<String> fields = [
    "Chemistry",
    "Environmental Science",
    "Food Science",
    "Marine Science",
    "Film/Broadcast"
  ];

  List<String> filteredFields = [];

  @override
  void initState() {
    super.initState();
    filteredFields = fields;
  }

  void filterSearch(String value) {
    setState(() {
      field = value;
      filteredFields = fields
          .where((f) => f.toLowerCase().contains(value.toLowerCase()))
          .toList();
    });
  }

  double get pricePerPerson => 34741.33 / (coAuthors + 1);

  @override
  Widget build(BuildContext context) {
    final isMobile = MediaQuery.of(context).size.width < 600;

    return Dialog(
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(25)),
      child: Container(
        padding: const EdgeInsets.all(20),
        constraints: BoxConstraints(
          maxHeight: MediaQuery.of(context).size.height * 0.9,
          maxWidth: isMobile ? double.infinity : 500,
        ),
        child: SingleChildScrollView(
          child: Column(
            children: [
              /// 🔹 Title
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const Text("Create Group",
                      style:
                          TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
                  IconButton(
                    icon: const Icon(Icons.close),
                    onPressed: () => Navigator.pop(context),
                  )
                ],
              ),

              const SizedBox(height: 10),

              /// 🔹 Step Indicator
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  CircleAvatar(
                    backgroundColor:
                        step >= 1 ? Colors.orange : Colors.grey.shade300,
                    child: const Text("1"),
                  ),
                  const SizedBox(width: 10),
                  CircleAvatar(
                    backgroundColor:
                        step >= 2 ? Colors.orange : Colors.grey.shade300,
                    child: const Text("2"),
                  ),
                ],
              ),

              const SizedBox(height: 20),

              /// 🔥 STEP 1
              if (step == 1) ...[
                /// 🔹 Field Search
                TextField(
                  controller: fieldController,
                  onChanged: filterSearch,
                  decoration: const InputDecoration(
                    labelText: "Research Field",
                    border: OutlineInputBorder(),
                  ),
                ),

                const SizedBox(height: 10),

                /// 🔹 Search Results
                if (field.isNotEmpty)
                  Container(
                    height: 120,
                    child: ListView(
                      children: filteredFields
                          .map((f) => ListTile(
                                title: Text(f),
                                onTap: () {
                                  setState(() {
                                    field = f;
                                    fieldController.text = f;
                                    filteredFields = [];
                                  });
                                },
                              ))
                          .toList(),
                    ),
                  ),

                const SizedBox(height: 10),

                /// 🔹 Description
                TextField(
                  controller: descController,
                  maxLines: 3,
                  decoration: const InputDecoration(
                    labelText: "Description",
                    border: OutlineInputBorder(),
                  ),
                ),

                const SizedBox(height: 10),

                /// 🔹 Co-authors
                DropdownButtonFormField<int>(
                  value: coAuthors,
                  items: [1, 2, 3, 4, 5]
                      .map((e) =>
                          DropdownMenuItem(value: e, child: Text("$e Members")))
                      .toList(),
                  onChanged: (val) {
                    setState(() => coAuthors = val!);
                  },
                  decoration: const InputDecoration(
                    labelText: "Co-authors",
                    border: OutlineInputBorder(),
                  ),
                ),

                const SizedBox(height: 20),

                /// 🔹 Price Box
                Container(
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: Colors.black,
                    borderRadius: BorderRadius.circular(15),
                  ),
                  child: Column(
                    children: [
                      Text(
                        "INR ${pricePerPerson.toStringAsFixed(2)} / Person",
                        style:
                            const TextStyle(color: Colors.white, fontSize: 16),
                      ),
                      const SizedBox(height: 10),
                      ElevatedButton(
                        onPressed: () {
                          if (field.isEmpty || descController.text.isEmpty) {
                            ScaffoldMessenger.of(context).showSnackBar(
                              const SnackBar(
                                  content: Text("Fill all fields")),
                            );
                            return;
                          }
                          setState(() => step = 2);
                        },
                        child: const Text("Next"),
                      )
                    ],
                  ),
                ),
              ],

              /// 🔥 STEP 2
              if (step == 2) ...[
                /// 🔹 Summary
                Container(
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: Colors.grey.shade200,
                    borderRadius: BorderRadius.circular(15),
                  ),
                  child: Column(
                    children: const [
                      Text("Total: INR 34,741.33"),
                      Text("Discount: 20%"),
                    ],
                  ),
                ),

                const SizedBox(height: 20),

                /// 🔹 Payment Buttons
                Row(
                  children: [
                    Expanded(
                      child: OutlinedButton(
                        onPressed: () {},
                        child: const Text("Razorpay"),
                      ),
                    ),
                    const SizedBox(width: 10),
                    Expanded(
                      child: OutlinedButton(
                        onPressed: () {},
                        child: const Text("Amazon Pay"),
                      ),
                    ),
                  ],
                ),

                const SizedBox(height: 20),

                /// 🔹 Actions
                Row(
                  children: [
                    Expanded(
                      child: ElevatedButton(
                        onPressed: () => setState(() => step = 1),
                        child: const Text("Back"),
                      ),
                    ),
                    const SizedBox(width: 10),
                    Expanded(
                      child: ElevatedButton(
                        onPressed: () {
                          ScaffoldMessenger.of(context).showSnackBar(
                            const SnackBar(
                                content: Text("Group Created")),
                          );
                          Navigator.pop(context);
                        },
                        child: const Text("Submit"),
                      ),
                    ),
                  ],
                )
              ]
            ],
          ),
        ),
      ),
    );
  }
}
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

class NavigationOverlay extends StatefulWidget {
  const NavigationOverlay({super.key});

  @override
  State<NavigationOverlay> createState() => _NavigationOverlayState();
}

class _NavigationOverlayState extends State<NavigationOverlay> {
  bool universitiesOpen = false;
  bool resourcesOpen = false;
  bool aiServicesOpen = false;

  @override
  Widget build(BuildContext context) {
    return Material(
      color: const Color(0xFF241716),
      child: SafeArea(
        child: Stack(
          children: [
            Positioned(
              top: -100,
              right: -100,
              child: Container(
                width: 250,
                height: 250,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  color: const Color(0xFFC79A63).withOpacity(.08),
                ),
              ),
            ),
            SingleChildScrollView(
              padding: const EdgeInsets.all(24),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      const Expanded(
                        child: Text(
                          "INTERNATIONAL EDULEADER COUNCIL",
                          style: TextStyle(
                            color: Colors.white,
                            fontSize: 18,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ),
                      IconButton(
                        onPressed: () => Navigator.pop(context),
                        icon: const Icon(
                          Icons.close,
                          color: Colors.white,
                        ),
                      )
                    ],
                  ),
                  const SizedBox(height: 30),
                  TextField(
                    style: const TextStyle(color: Colors.white),
                    decoration: InputDecoration(
                      hintText: "Search Country...",
                      hintStyle: const TextStyle(color: Colors.white54),
                      prefixIcon: const Icon(
                        Icons.search,
                        color: Colors.white54,
                      ),
                      filled: true,
                      fillColor: Colors.white.withOpacity(.05),
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(20),
                      ),
                    ),
                  ),
                  const SizedBox(height: 30),
                  _menuTile(
                    context,
                    "Home",
                    Icons.home_rounded,
                    "/",
                  ),
                  ExpansionTile(
                    collapsedIconColor: Colors.white,
                    iconColor: const Color(0xFFC79A63),
                    title: const Text(
                      "Universities",
                      style: TextStyle(
                        color: Colors.white,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                    children: [
                      _subItem(context, "USA"),
                      _subItem(context, "Canada"),
                      _subItem(context, "UK"),
                      _subItem(context, "Germany"),
                      _subItem(context, "Australia"),
                    ],
                  ),
                  ExpansionTile(
                    collapsedIconColor: Colors.white,
                    iconColor: const Color(0xFFC79A63),
                    title: const Text(
                      "Resources",
                      style: TextStyle(
                        color: Colors.white,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                    children: [
                      _subItem(context, "Scholarships"),
                      _subItem(context, "Research Groups"),
                      _subItem(context, "Education Loans"),
                    ],
                  ),
                  ExpansionTile(
                    collapsedIconColor: Colors.white,
                    iconColor: const Color(0xFFC79A63),
                    title: const Text(
                      "AI Services",
                      style: TextStyle(
                        color: Colors.white,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                    children: [
                      _subItem(context, "Mock Interview AI"),
                      _subItem(context, "SOP Generator"),
                      _subItem(context, "AI Humanizer"),
                    ],
                  ),
                  _menuTile(
                    context,
                    "Services",
                    Icons.school,
                    "/services",
                  ),
                  _menuTile(
                    context,
                    "Contact",
                    Icons.phone,
                    "/contact",
                  ),
                  const SizedBox(height: 40),
                  SizedBox(
                    width: double.infinity,
                    child: ElevatedButton(
                      onPressed: () {
                        context.push('/register');
                      },
                      style: ElevatedButton.styleFrom(
                        backgroundColor: const Color(0xFFC79A63),
                        foregroundColor: Colors.black,
                        padding: const EdgeInsets.symmetric(
                          vertical: 18,
                        ),
                      ),
                      child: const Text(
                        "REGISTER NOW",
                        style: TextStyle(
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                  ),
                  const SizedBox(height: 50),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _menuTile(
    BuildContext context,
    String title,
    IconData icon,
    String route,
  ) {
    return ListTile(
      leading: Icon(icon, color: const Color(0xFFC79A63)),
      title: Text(
        title,
        style: const TextStyle(
          color: Colors.white,
          fontWeight: FontWeight.w600,
        ),
      ),
      onTap: () {
        Navigator.pop(context);
        context.push(route);
      },
    );
  }

  Widget _subItem(BuildContext context, String title) {
    return ListTile(
      dense: true,
      leading: const Icon(
        Icons.arrow_right,
        color: Color(0xFFC79A63),
      ),
      title: Text(
        title,
        style: const TextStyle(color: Colors.white70),
      ),
      onTap: () {},
    );
  }
}

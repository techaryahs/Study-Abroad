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
                          "EduLeaderGlobal",
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
                  _menuTile(
                    context,
                    "Home",
                    Icons.home_rounded,
                    "/",
                  ),
                  // ExpansionTile(
                  //   collapsedIconColor: Colors.white,
                  //   iconColor: const Color(0xFFC79A63),
                  //   title: const Text(
                  //     "Universities",
                  //     style: TextStyle(
                  //       color: Colors.white,
                  //       fontWeight: FontWeight.w600,
                  //     ),
                  //   ),
                  //   children: [
                  //     _subItem(context, "USA"),
                  //     _subItem(context, "Canada"),
                  //     _subItem(context, "UK"),
                  //     _subItem(context, "Germany"),
                  //     _subItem(context, "Australia"),
                  //   ],
                  // ),
                  // ExpansionTile(
                  //   collapsedIconColor: Colors.white,
                  //   iconColor: const Color(0xFFC79A63),
                  //   title: const Text(
                  //     "Resources",
                  //     style: TextStyle(
                  //       color: Colors.white,
                  //       fontWeight: FontWeight.w600,
                  //     ),
                  //   ),
                  //   children: [
                  //     _subItem(context, "Scholarships"),
                  //     _subItem(context, "Research Groups"),
                  //     _subItem(context, "Education Loans"),
                  //   ],
                  // ),
                  // ExpansionTile(
                  //   collapsedIconColor: Colors.white,
                  //   iconColor: const Color(0xFFC79A63),
                  //   title: const Text(
                  //     "AI Services",
                  //     style: TextStyle(
                  //       color: Colors.white,
                  //       fontWeight: FontWeight.w600,
                  //     ),
                  //   ),
                  //   children: [
                  //     _subItem(context, "Mock Interview AI"),
                  //     _subItem(context, "SOP Generator"),
                  //     _subItem(context, "AI Humanizer"),
                  //   ],
                  // ),
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
                  _menuTile(
                    context,
                    "About",
                    Icons.info_outline_rounded,
                    "/about",
                  ),
                  _menuTile(
                    context,
                    "Terms & Condition",
                    Icons.description_outlined,
                    "/terms-condition",
                  ),
                  _menuTile(
                    context,
                    "Privacy & Policy",
                    Icons.privacy_tip_outlined,
                    "/privacy-policy",
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
    return Padding(
      padding: const EdgeInsets.only(bottom: 10),
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          borderRadius: BorderRadius.circular(16),
          onTap: () {
            Navigator.pop(context);
            context.push(route);
          },
          child: Container(
            padding: const EdgeInsets.symmetric(
              horizontal: 18,
              vertical: 16,
            ),
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(16),
              color: Colors.white.withOpacity(.03),
              border: Border.all(
                color: Colors.white.withOpacity(.05),
              ),
            ),
            child: Row(
              children: [
                Container(
                  width: 42,
                  height: 42,
                  decoration: BoxDecoration(
                    color: const Color(0xFFC79A63).withOpacity(.15),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Icon(
                    icon,
                    color: const Color(0xFFC79A63),
                    size: 22,
                  ),
                ),

                const SizedBox(width: 16),

                Expanded(
                  child: Text(
                    title,
                    style: const TextStyle(
                      color: Colors.white,
                      fontWeight: FontWeight.w600,
                      fontSize: 15,
                    ),
                  ),
                ),

                const Icon(
                  Icons.arrow_forward_ios_rounded,
                  color: Colors.white38,
                  size: 15,
                ),
              ],
            ),
          ),
        ),
      ),
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

import 'package:flutter/material.dart';

class MembershipSkeletonLoader extends StatefulWidget {
  const MembershipSkeletonLoader({super.key});

  @override
  State<MembershipSkeletonLoader> createState() => _MembershipSkeletonLoaderState();
}

class _MembershipSkeletonLoaderState extends State<MembershipSkeletonLoader>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _animation;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1200),
    )..repeat(reverse: true);
    _animation = Tween<double>(begin: 0.4, end: 0.8).animate(
      CurvedAnimation(parent: _controller, curve: Curves.easeInOut),
    );
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  Widget _buildShimmerBox({required double width, required double height, double radius = 12}) {
    return AnimatedBuilder(
      animation: _animation,
      builder: (context, child) {
        return Container(
          width: width,
          height: height,
          decoration: BoxDecoration(
            color: Colors.grey.shade300.withOpacity(_animation.value),
            borderRadius: BorderRadius.circular(radius),
          ),
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 20, vertical: 10),
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(24),
        border: Border.all(color: Colors.grey.shade200),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              _buildShimmerBox(width: 80, height: 24, radius: 20),
              _buildShimmerBox(width: 90, height: 24, radius: 20),
            ],
          ),
          const SizedBox(height: 20),
          _buildShimmerBox(width: 200, height: 28),
          const SizedBox(height: 10),
          _buildShimmerBox(width: 140, height: 16),
          const SizedBox(height: 24),
          _buildShimmerBox(width: double.infinity, height: 100),
        ],
      ),
    );
  }
}

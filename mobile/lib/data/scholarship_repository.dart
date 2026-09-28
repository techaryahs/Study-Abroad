import 'dart:convert';
import 'package:flutter/services.dart' show rootBundle;
import '../core/app_logger.dart';

class ScholarshipItem {
  final String id;
  final String slug;
  final String name;
  final String sponsor;
  final String amount;
  final String category;
  final String deadline;
  final String description;
  final String perks;
  final String applyLink;
  final String hostCountry;

  ScholarshipItem({
    required this.id,
    required this.slug,
    required this.name,
    required this.sponsor,
    required this.amount,
    required this.category,
    required this.deadline,
    required this.description,
    required this.perks,
    required this.applyLink,
    required this.hostCountry,
  });

  factory ScholarshipItem.fromJson(Map<String, dynamic> json) {
    return ScholarshipItem(
      id: json['id'] ?? '',
      slug: json['slug'] ?? '',
      name: json['name'] ?? '',
      sponsor: json['sponsor'] ?? '',
      amount: json['amount'] ?? '',
      category: json['category'] ?? '',
      deadline: json['deadline'] ?? '',
      description: json['description'] ?? '',
      perks: json['perks'] ?? '',
      applyLink: json['apply_link'] ?? '',
      hostCountry: json['host_country'] ?? 'Global',
    );
  }
}

class ScholarshipRepository {
  static List<ScholarshipItem> _scholarships = [];

  static Future<List<ScholarshipItem>> getScholarships() async {
    if (_scholarships.isNotEmpty) return _scholarships;

    try {
      final String response = await rootBundle.loadString('assets/data/scolarship.json');
      final data = await json.decode(response);
      final List<dynamic> list = data['scholarships'];
      _scholarships = list.map((json) => ScholarshipItem.fromJson(json)).toList();
      return _scholarships;
    } catch (e) {
      AppLogger.error('Error loading scholarships', e);
      return [];
    }
  }

  static Future<ScholarshipItem?> getScholarshipBySlug(String slug) async {
    final list = await getScholarships();
    try {
      return list.firstWhere((s) => s.slug == slug);
    } catch (e) {
      return null;
    }
  }
}

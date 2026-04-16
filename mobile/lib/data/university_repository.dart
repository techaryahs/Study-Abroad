import 'dart:convert';
import 'package:flutter/services.dart';

class UniversityItem {
  final String slug;
  final String name;
  final String location;
  final String rank;
  final String programs;
  final String fee;
  final String type;
  final String about;
  final List<String> highlights;

  UniversityItem({
    required this.slug,
    required this.name,
    required this.location,
    required this.rank,
    required this.programs,
    required this.fee,
    required this.type,
    required this.about,
    required this.highlights,
  });

  factory UniversityItem.fromJson(Map<String, dynamic> json) {
    return UniversityItem(
      slug: json['slug'] as String,
      name: json['name'] as String,
      location: json['location'] as String,
      rank: json['rank'] as String,
      programs: json['programs'] as String,
      fee: json['fee'] as String,
      type: json['type'] as String,
      about: json['about'] as String,
      highlights: List<String>.from(json['highlights'] as List<dynamic>? ?? []),
    );
  }
}

class UniversityCountry {
  final String slug;
  final String name;
  final String code;
  final String hero;
  final bool popular;
  final List<UniversityItem> universities;

  UniversityCountry({
    required this.slug,
    required this.name,
    required this.code,
    required this.hero,
    required this.popular,
    required this.universities,
  });

  factory UniversityCountry.fromJson(Map<String, dynamic> json) {
    return UniversityCountry(
      slug: json['slug'] as String,
      name: json['name'] as String,
      code: json['code'] as String,
      hero: json['hero'] as String,
      popular: json['popular'] as bool? ?? false,
      universities: (json['universities'] as List<dynamic>?)
              ?.map((item) => UniversityItem.fromJson(item as Map<String, dynamic>))
              .toList() ??
          [],
    );
  }
}

class UniversityRepository {
  static final List<UniversityCountry> _countries = [];
  static final Map<String, UniversityItem> _universities = {};
  static bool _loaded = false;

  static Future<void> _ensureLoaded() async {
    if (_loaded) return;
    final raw = await rootBundle.loadString('assets/data/universities.json');
    final parsed = json.decode(raw) as Map<String, dynamic>;
    final List<dynamic> countryList = parsed['countries'] as List<dynamic>;

    _countries.clear();
    _universities.clear();

    for (final entry in countryList) {
      final country = UniversityCountry.fromJson(entry as Map<String, dynamic>);
      _countries.add(country);
      for (final uni in country.universities) {
        _universities[uni.slug.toLowerCase()] = uni;
      }
    }

    _loaded = true;
  }

  static Future<List<UniversityCountry>> getAllCountries() async {
    await _ensureLoaded();
    return List.unmodifiable(_countries);
  }

  static Future<UniversityCountry?> getCountryBySlug(String slug) async {
    await _ensureLoaded();
    final lowerSlug = slug.toLowerCase();
    for (final country in _countries) {
      if (country.slug.toLowerCase() == lowerSlug || country.name.toLowerCase() == lowerSlug) {
        return country;
      }
    }
    return null;
  }

  static Future<UniversityItem?> getUniversityBySlug(String slug) async {
    await _ensureLoaded();
    return _universities[slug.toLowerCase()];
  }
}

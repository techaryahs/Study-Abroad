import 'dart:convert';
import 'package:flutter/services.dart';
import '../core/app_logger.dart';

class UniversityItem {
  final String slug;
  final String name;
  final String? logo;
  final Map<String, dynamic>? location;
  final List<dynamic>? branches;
  final Map<String, dynamic>? commonSections;

  UniversityItem({
    required this.slug,
    required this.name,
    this.logo,
    this.location,
    this.branches,
    this.commonSections,
  });

  // Simplified getters to match old UI requirements
  String get cityName => location?['city'] ?? '';
  String get stateName => location?['state'] ?? '';
  String get countryName => location?['country'] ?? '';
  String get fullLocation => [cityName, stateName, countryName].where((s) => s.isNotEmpty).join(', ');

  String get rank {
    // Frontend uses ymgrad_rank or index. We'll use a placeholder or check if exists
    return 'Top Tier'; 
  }

  String get fee {
    if (branches != null && branches!.isNotEmpty) {
      final stats = branches![0]['stats'];
      if (stats != null && stats['tuition_fee'] != null) {
        return '\$${stats['tuition_fee']}';
      }
    }
    return 'Contact for Fees';
  }

  String get programs {
    if (branches != null && branches!.isNotEmpty) {
      return branches!.map((b) => b['name'] as String).join(', ');
    }
    return 'Multiple Programs';
  }

  String get type => 'Research University';

  String get about {
    if (branches != null && branches!.isNotEmpty) {
      return branches![0]['description'] ?? 'A prestigious institution offering world-class education.';
    }
    return 'A prestigious institution offering world-class education.';
  }

  List<String> get highlights => [];

  factory UniversityItem.fromJson(Map<String, dynamic> json) {
    return UniversityItem(
      slug: json['slug'] ?? '',
      name: json['name'] ?? json['university'] ?? '',
      logo: json['logo'],
      location: json['location'] is Map ? Map<String, dynamic>.from(json['location']) : null,
      branches: json['branches'] as List<dynamic>?,
      commonSections: json['common_sections'] is Map ? Map<String, dynamic>.from(json['common_sections']) : null,
    );
  }
}

class UniversityCountry {
  final String slug;
  final String name;
  final String code;
  final String hero;
  final bool popular;
  List<UniversityItem> universities;

  UniversityCountry({
    required this.slug,
    required this.name,
    required this.code,
    required this.hero,
    required this.popular,
    this.universities = const [],
  });

  factory UniversityCountry.fromJson(Map<String, dynamic> json) {
    return UniversityCountry(
      slug: json['slug'] as String,
      name: json['name'] as String,
      code: json['code'] as String,
      hero: json['hero'] as String,
      popular: json['popular'] as bool? ?? false,
    );
  }
}

class UniversityRepository {
  static final List<UniversityCountry> _countries = [];
  static bool _metadataloaded = false;

  static Future<void> _ensureMetadataLoaded() async {
    if (_metadataloaded) return;
    final raw = await rootBundle.loadString('assets/data/universities.json');
    final parsed = json.decode(raw) as Map<String, dynamic>;
    final List<dynamic> countryList = parsed['countries'] as List<dynamic>;

    _countries.clear();
    for (final entry in countryList) {
      _countries.add(UniversityCountry.fromJson(entry as Map<String, dynamic>));
    }
    _metadataloaded = true;
  }

  static Future<List<UniversityCountry>> getAllCountries() async {
    await _ensureMetadataLoaded();
    return List.unmodifiable(_countries);
  }

  static Future<UniversityCountry?> getCountryBySlug(String slug) async {
    await _ensureMetadataLoaded();
    final lowerSlug = slug.toLowerCase();
    
    // Find metadata first
    UniversityCountry? countryMeta;
    for (final c in _countries) {
      if (c.slug.toLowerCase() == lowerSlug || c.name.toLowerCase() == lowerSlug) {
        countryMeta = c;
        break;
      }
    }

    if (countryMeta == null) return null;

    // Load full data from separate JSON
    try {
      String fileName = _getFileNameForSlug(countryMeta.slug);
      final raw = await rootBundle.loadString('assets/data/countries/$fileName');
      final List<dynamic> uniList = json.decode(raw) as List<dynamic>;
      countryMeta.universities = uniList.map((j) => UniversityItem.fromJson(j)).toList();
    } catch (e) {
      AppLogger.error('Error loading country data for ${countryMeta.slug}', e);
      // Fallback or empty list
    }

    return countryMeta;
  }

  static String _getFileNameForSlug(String slug) {
    final s = slug.toLowerCase();
    if (s == 'usa') return 'USA.json';
    if (s == 'united-kingdom' || s == 'uk') return 'UK.json';
    if (s == 'germany') return 'Germany.json';
    if (s == 'canada') return 'Canada.json';
    if (s == 'australia' || s == 'aus') return 'AUS.json';
    if (s == 'singapore') return 'singapore.json';
    if (s == 'ireland') return 'Ireland.json';
    if (s == 'france') return 'France.json';
    if (s == 'switzerland') return 'Switzerland.json';
    if (s == 'dubai' || s == 'uae' || s == 'united arab emirates') return 'Dubai.json';
    if (s == 'netherlands') return 'Netherlands.json';
    if (s == 'new-zealand' || s == 'nz') return 'NewZealand Universities.json';
    
    // Default fallback: Try capitalized first letter if not found
    return '${slug[0].toUpperCase()}${slug.substring(1)}.json';
  }

  static Future<UniversityItem?> getUniversityBySlug(String slug) async {
    await _ensureMetadataLoaded();
    final lowerSlug = slug.toLowerCase();
    
    // First, try to find it in already loaded countries
    for (final country in _countries) {
      if (country.universities.isNotEmpty) {
        for (final uni in country.universities) {
          if (uni.slug.toLowerCase() == lowerSlug) return uni;
        }
      }
    }

    // If not found, we might need to search all JSON files. 
    // For performance, we'll try common countries first.
    final countriesToSearch = _countries.map((c) => c.slug).toList();
    for (final cSlug in countriesToSearch) {
      final country = await getCountryBySlug(cSlug);
      if (country != null) {
        for (final uni in country.universities) {
          if (uni.slug.toLowerCase() == lowerSlug) return uni;
        }
      }
    }
    
    return null;
  }

  static Future<Map<String, Map<String, List<UniversityItem>>>> getCategorizedPrograms() async {
    await _ensureMetadataLoaded();
    
    // Program Name -> List of Universities
    final Map<String, List<UniversityItem>> byProgram = {};
    
    for (final countryMeta in _countries) {
      final country = await getCountryBySlug(countryMeta.slug);
      if (country != null) {
        for (final uni in country.universities) {
          if (uni.branches != null) {
            for (final branch in uni.branches!) {
              final programName = branch['name'] as String? ?? "General";
              if (!byProgram.containsKey(programName)) {
                byProgram[programName] = [];
              }
              // Only add uni once per program
              if (!byProgram[programName]!.any((u) => u.slug == uni.slug)) {
                byProgram[programName]!.add(uni);
              }
            }
          }
        }
      }
    }

    final sortedPrograms = byProgram.keys.toList()..sort((a, b) => byProgram[b]!.length.compareTo(byProgram[a]!.length));

    final Map<String, Map<String, List<UniversityItem>>> categorized = {
      "Engineering & Tech": {},
      "Business & Management": {},
      "Humanities & Law": {},
      "Sciences & Health": {},
      "Other Programs": {},
    };

    for (final prog in sortedPrograms) {
      final lower = prog.toLowerCase();
      String cat = "Other Programs";
      
      if (lower.contains('engineer') || lower.contains('computer') || lower.contains('data science') || lower.contains('robotics')) {
        cat = "Engineering & Tech";
      } else if (lower.contains('business') || lower.contains('mba') || lower.contains('management') || lower.contains('finance') || lower.contains('economy')) {
        cat = "Business & Management";
      } else if (lower.contains('law') || lower.contains('art') || lower.contains('design') || lower.contains('politics')) {
        cat = "Humanities & Law";
      } else if (lower.contains('science') || lower.contains('medicine') || lower.contains('bio') || lower.contains('psychology')) {
        cat = "Sciences & Health";
      }
      
      categorized[cat]![prog] = byProgram[prog]!;
    }

    return categorized;
  }
}

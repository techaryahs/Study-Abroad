import 'dart:convert';
import 'package:flutter/services.dart';
import '../core/api_client.dart';
import '../core/app_logger.dart';

class UniversityItem {
  final String slug;
  final String name;
  final String? logo;
  final Map<String, dynamic>? location;
  final List<dynamic>? branches;
  final Map<String, dynamic>? commonSections;
  final bool hasAccess;
  final String access;

  UniversityItem({
    required this.slug,
    required this.name,
    this.logo,
    this.location,
    this.branches,
    this.commonSections,
    this.hasAccess = true,
    this.access = 'full',
  });

  bool get isLocked => !hasAccess || access == 'locked';

  // Simplified getters to match UI requirements
  String get cityName => location?['city'] ?? '';
  String get stateName => location?['state'] ?? '';
  String get countryName => location?['country'] ?? '';
  String get fullLocation => [cityName, stateName, countryName].where((s) => s.isNotEmpty).join(', ');

  String get rank {
    return 'Top Tier';
  }

  String get fee {
    if (isLocked) return '🔒 Membership Required';
    if (branches != null && branches!.isNotEmpty) {
      final stats = branches![0]['stats'];
      if (stats != null && stats['tuition_fee'] != null) {
        return '\$${stats['tuition_fee']}';
      }
    }
    return 'Contact for Fees';
  }

  String get programs {
    if (isLocked) return '🔒 Locked Program Specs';
    if (branches != null && branches!.isNotEmpty) {
      return branches!.map((b) => b['name'] as String).join(', ');
    }
    return 'Multiple Programs';
  }

  String get type => 'Research University';

  String get about {
    if (isLocked) {
      return 'Unlock full university information, program specifications, tuition fees, and admission chance calculations with Membership.';
    }
    if (branches != null && branches!.isNotEmpty) {
      return branches![0]['description'] ?? 'A prestigious institution offering world-class education.';
    }
    return 'A prestigious institution offering world-class education.';
  }

  List<String> get highlights {
    if (isLocked) {
      return ['🔒 Premium University', 'Unlock detailed requirements & stats with Membership'];
    }
    return [];
  }

  factory UniversityItem.fromJson(Map<String, dynamic> json) {
    final rawHasAccess = json['hasAccess'];
    final rawAccess = json['access'];

    bool hasAccessVal = true;
    if (rawHasAccess is bool) {
      hasAccessVal = rawHasAccess;
    } else if (rawAccess == 'locked') {
      hasAccessVal = false;
    }

    String accessVal = 'full';
    if (rawAccess != null) {
      accessVal = rawAccess.toString();
    } else if (!hasAccessVal) {
      accessVal = 'locked';
    }

    return UniversityItem(
      slug: json['slug'] ?? '',
      name: json['name'] ?? json['university'] ?? '',
      logo: json['logo'],
      location: json['location'] is Map ? Map<String, dynamic>.from(json['location']) : null,
      branches: json['branches'] as List<dynamic>?,
      commonSections: json['common_sections'] is Map ? Map<String, dynamic>.from(json['common_sections']) : null,
      hasAccess: hasAccessVal,
      access: accessVal,
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

    UniversityCountry? countryMeta;
    for (final c in _countries) {
      if (c.slug.toLowerCase() == lowerSlug || c.name.toLowerCase() == lowerSlug) {
        countryMeta = c;
        break;
      }
    }

    if (countryMeta == null) return null;

    // 1. Try server API first for server-enforced access decision
    try {
      final response = await ApiClient.instance.get('/api/universities?country=${countryMeta.slug}');
      if (response.statusCode == 200 && response.data != null) {
        final Map<String, dynamic> body = Map<String, dynamic>.from(response.data as Map);
        final List<dynamic> dataList = body['data'] as List<dynamic>? ?? [];
        if (dataList.isNotEmpty) {
          countryMeta.universities = dataList.map((j) => UniversityItem.fromJson(Map<String, dynamic>.from(j as Map))).toList();
          return countryMeta;
        }
      }
    } catch (e) {
      AppLogger.warning('API fetch for country ${countryMeta.slug} failed, falling back to local dataset: $e');
    }

    // 2. Local fallback if offline or API unavailable
    try {
      String fileName = _getFileNameForSlug(countryMeta.slug);
      final raw = await rootBundle.loadString('assets/data/countries/$fileName');
      final List<dynamic> uniList = json.decode(raw) as List<dynamic>;

      // Default local allocation: first 3 accessible if no active server response
      countryMeta.universities = uniList.asMap().entries.map((entry) {
        final idx = entry.key;
        final j = Map<String, dynamic>.from(entry.value as Map);
        j['hasAccess'] = idx < 3;
        j['access'] = idx < 3 ? 'full' : 'locked';
        return UniversityItem.fromJson(j);
      }).toList();
    } catch (e) {
      AppLogger.error('Error loading country data for ${countryMeta.slug}', e);
    }

    return countryMeta;
  }

  static Future<UniversityItem?> getUniversityBySlug(String slug) async {
    final lowerSlug = slug.toLowerCase();

    // 1. Try server API first for server-enforced access check
    try {
      final response = await ApiClient.instance.get('/api/universities/$lowerSlug');
      if (response.statusCode == 200 && response.data != null) {
        final Map<String, dynamic> body = Map<String, dynamic>.from(response.data as Map);
        final Map<String, dynamic>? data = body['data'] != null ? Map<String, dynamic>.from(body['data'] as Map) : null;
        if (data != null) {
          return UniversityItem.fromJson(data);
        }
      }
    } catch (e) {
      AppLogger.warning('API fetch for university $slug failed, falling back to local dataset: $e');
    }

    // 2. Local fallback if offline
    await _ensureMetadataLoaded();

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

  static Future<List<UniversityItem>> searchUniversities({String? query, String? country, String? state}) async {
    try {
      final queryParams = <String>[];
      if (query != null && query.isNotEmpty) queryParams.add('search=${Uri.encodeComponent(query)}');
      if (country != null && country.isNotEmpty) queryParams.add('country=${Uri.encodeComponent(country)}');
      if (state != null && state.isNotEmpty) queryParams.add('state=${Uri.encodeComponent(state)}');

      final url = '/api/universities?${queryParams.join('&')}';
      final response = await ApiClient.instance.get(url);
      if (response.statusCode == 200 && response.data != null) {
        final Map<String, dynamic> body = Map<String, dynamic>.from(response.data as Map);
        final List<dynamic> dataList = body['data'] as List<dynamic>? ?? [];
        return dataList.map((j) => UniversityItem.fromJson(Map<String, dynamic>.from(j as Map))).toList();
      }
    } catch (e) {
      AppLogger.warning('Search API call failed: $e');
    }

    // Fallback to local country search if API call fails
    if (country != null && country.isNotEmpty) {
      final c = await getCountryBySlug(country);
      if (c != null) {
        return c.universities.where((u) {
          final matchesQuery = query == null || query.isEmpty || u.name.toLowerCase().contains(query.toLowerCase());
          final matchesState = state == null || state.isEmpty || u.stateName.toLowerCase() == state.toLowerCase();
          return matchesQuery && matchesState;
        }).toList();
      }
    }

    return [];
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

    return '${slug[0].toUpperCase()}${slug.substring(1)}.json';
  }

  static Future<Map<String, Map<String, List<UniversityItem>>>> getCategorizedPrograms() async {
    await _ensureMetadataLoaded();

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

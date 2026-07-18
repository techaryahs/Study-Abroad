import 'dart:convert';

class Entitlement {
  final bool enabled;
  final int? limit;
  Entitlement({this.enabled = true, this.limit});
  factory Entitlement.fromJson(Map<String, dynamic> json) {
    return Entitlement(enabled: json['enabled'] ?? true, limit: json['limit']);
  }
}

void main() {
  String jsonStr = '{"ai": {"feature1": {"enabled": true, "limit": 5}}}';
  Map<String, dynamic> json = jsonDecode(jsonStr);
  
  Map<String, dynamic>? catJson = json['ai'];
  
  try {
    var result = catJson!.map((key, value) => MapEntry(key, Entitlement.fromJson(value)));
    print("Success: $result");
  } catch (e) {
    print("Error: $e");
  }
}

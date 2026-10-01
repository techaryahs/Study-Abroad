import re

with open('lib/features/dashboard/edit_profile_screen.dart', 'r') as f:
    content = f.read()

content = content.replace(
'''    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(content: Text('Error: $e'), backgroundColor: Colors.red));
      }
    }''',
'''    } catch (e) {
      if (mounted) {
        String msg = 'Failed to update profile. Please try again.';
        if (e is DioException && e.response?.data != null) {
          msg = e.response?.data['message'] ?? e.response?.data['error'] ?? msg;
        } else if (e is DioException && e.type != DioExceptionType.badResponse) {
          msg = 'Unable to connect. Please check your internet connection.';
        }
        ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(content: Text(msg), backgroundColor: Colors.red));
      }
    }'''
)

with open('lib/features/dashboard/edit_profile_screen.dart', 'w') as f:
    f.write(content)

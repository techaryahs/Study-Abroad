import re

with open('lib/widgets/book_counselling_sheet.dart', 'r') as f:
    content = f.read()

# Replace empty catch
content = content.replace(
'''    } catch (e) {
      setState(() {
        _error = isFreeBooking
            ? 'Booking failed. Please try again.'
            : 'Payment was successful but booking failed. Please contact support.';
        _bookingLoading = false;
      });
    }''',
'''    } catch (e) {
      debugPrint('Booking request failed: $e');
      if (e is DioException) {
        debugPrint('Booking response status: ${e.response?.statusCode}');
        debugPrint('Booking response data: ${e.response?.data}');
      }
      setState(() {
        _error = isFreeBooking
            ? 'Booking failed. Please try again.'
            : 'Payment was successful but booking failed. Please contact support.';
        _bookingLoading = false;
      });
    }'''
)
with open('lib/widgets/book_counselling_sheet.dart', 'w') as f:
    f.write(content)

import re

with open('lib/widgets/book_counselling_sheet.dart', 'r') as f:
    content = f.read()

# Replace _finalizeBooking error handling
content = content.replace(
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
    }''',
'''    } catch (e) {
      String errorMessage = isFreeBooking
          ? 'Booking failed. Please try again.'
          : 'Payment was successful but booking failed. Please contact support.';
      
      if (e is DioException && e.response?.data != null) {
        if (e.response?.data['message'] != null) {
           errorMessage = e.response?.data['message'];
        } else if (e.response?.data['error'] != null) {
           errorMessage = e.response?.data['error'];
        }
      } else if (e is DioException && e.type != DioExceptionType.badResponse) {
         errorMessage = 'Unable to connect. Please check your internet connection.';
      }
      
      setState(() {
        _error = errorMessage;
        _bookingLoading = false;
      });
    }'''
)

# Replace _finalizeMembershipBooking error handling
content = content.replace(
'''    } catch (e) {
      setState(() {
        _error = 'Failed to book session using credits. Please try again.';
        _bookingLoading = false;
      });
    }''',
'''    } catch (e) {
      String errorMessage = 'Failed to book session using credits. Please try again.';
      
      if (e is DioException && e.response?.data != null) {
        if (e.response?.data['message'] != null) {
           errorMessage = e.response?.data['message'];
        } else if (e.response?.data['error'] != null) {
           errorMessage = e.response?.data['error'];
        }
      } else if (e is DioException && e.type != DioExceptionType.badResponse) {
         errorMessage = 'Unable to connect. Please check your internet connection.';
      }
      
      setState(() {
        _error = errorMessage;
        _bookingLoading = false;
      });
    }'''
)

with open('lib/widgets/book_counselling_sheet.dart', 'w') as f:
    f.write(content)

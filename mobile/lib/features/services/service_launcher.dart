import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import 'service_model.dart';
import '../../widgets/book_counselling_sheet.dart';
import '../membership/membership_manager.dart';
import '../membership/membership_screen.dart';

class ServiceLauncher {
  static void launch(BuildContext context, ServiceModel service) {
    final manager = Provider.of<MembershipManager>(context, listen: false);
    if (!manager.canAccess(service.slug)) {
      Navigator.of(context).push(
        MaterialPageRoute(
          builder: (_) => MembershipScreen(lockedFeatureId: service.slug),
        ),
      );
      return;
    }

    switch (service.slug) {
      case 'consultation':
        showBookCounsellingSheet(context);
        break;
      case 'eb1':
        context.push('/resources/eb1a');
        break;
      case 'university_shortlist':
        context.push('/universities/unipredict');
        break;
      case 'sop_writing':
        context.push('/ai-services/sop-generator');
        break;
      case 'mock_interview':
        context.push('/ai-services/mock-interview');
        break;
      case 'ai_humanizer':
        context.push('/ai-services/plagiarism-remover');
        break;
      case 'scholarship_search':
        context.push('/resources/scholarships');
        break;
      case 'profile_evaluation':
        context.push('/universities/rate-my-chances');
        break;
      case 'visa_guidance':
        context.push('/services/visa_guidance');
        break;
      case 'university_finalization':
        context.push('/services/university_finalization');
        break;
      case 'resume_drafting':
        context.push('/services/resume_drafting');
        break;
      case 'research_paper':
        context.push('/services/research_paper');
        break;
      case 'application_help':
        context.push('/services/application_help');
        break;
      case 'o1':
        context.push('/services/o1');
        break;
      case 'lor_drafting':
        context.push('/services/lor_drafting');
        break;
      case 'personal_history':
        context.push('/services/personal_history');
        break;
      case 'application_review':
        context.push('/services/application_review');
        break;
      case 'gre_prep':
        context.push('/services/gre_prep');
        break;
      case 'toefl_prep':
        context.push('/services/toefl_prep');
        break;
      case 'cover_letter':
        context.push('/services/cover_letter');
        break;
      case 'linkedin_optimization':
        context.push('/services/linkedin_optimization');
        break;
      case 'express_entry':
        context.push('/services/express_entry');
        break;
      default:
        _showUnderDevelopmentDialog(context);
    }
  }

  static void _showUnderDevelopmentDialog(BuildContext context) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Coming Soon'),
        content: const Text(
          'This feature is included in your membership but is currently under development and will be available in a future update.',
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(context).pop(),
            child: const Text('OK'),
          ),
        ],
      ),
    );
  }
}

import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import 'service_model.dart';
import '../../core/app_features.dart';
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
      case MembershipFeatures.consultation:
        showBookCounsellingSheet(context);
        break;
      case MembershipFeatures.eb1:
        context.push('/resources/eb1a');
        break;
      case MembershipFeatures.universityShortlist:
        context.push('/universities/unipredict');
        break;
      case MembershipFeatures.aiSop:
        context.push('/ai-services/sop-generator');
        break;
      case MembershipFeatures.mockInterview:
        context.push('/ai-services/mock-interview');
        break;
      case MembershipFeatures.aiHumanizer:
        context.push('/ai-services/plagiarism-remover');
        break;
      case MembershipFeatures.scholarshipSearch:
        context.push('/resources/scholarships');
        break;
      case MembershipFeatures.profileEvaluation:
        context.push('/universities/rate-my-chances');
        break;
      case MembershipFeatures.visaGuidance:
        context.push('/services/visa_guidance');
        break;
      case MembershipFeatures.universityFinalization:
        context.push('/services/university_finalization');
        break;
      case MembershipFeatures.resumeDrafting:
        context.push('/services/resume_drafting');
        break;
      case MembershipFeatures.researchPaper:
        context.push('/services/research_paper');
        break;
      case MembershipFeatures.applicationHelp:
        context.push('/services/application_help');
        break;
      case MembershipFeatures.o1:
        context.push('/services/o1');
        break;
      case MembershipFeatures.lorDrafting:
        context.push('/services/lor_drafting');
        break;
      case MembershipFeatures.personalHistory:
        context.push('/services/personal_history');
        break;
      case MembershipFeatures.applicationReview:
        context.push('/services/application_review');
        break;
      case MembershipFeatures.grePrep:
        context.push('/services/gre_prep');
        break;
      case MembershipFeatures.toeflPrep:
        context.push('/services/toefl_prep');
        break;
      case MembershipFeatures.coverLetter:
        context.push('/services/cover_letter');
        break;
      case MembershipFeatures.linkedinOptimization:
        context.push('/services/linkedin_optimization');
        break;
      case MembershipFeatures.expressEntry:
        context.push('/services/express_entry');
        break;
      default:
        // By default, route any unknown or human service (like sop_writing) to its Service Detail flow
        context.push('/services/${service.slug}');
        break;
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

import re

file_path = 'lib/features/membership/membership_screen.dart'
with open(file_path, 'r') as f:
    content = f.read()

# Add isDowngrade and isUpgrade to _buildPremiumCard parameters
new_params = """  Widget _buildPremiumCard({
    required MembershipPlan plan,
    required bool isRecommended,
    required bool isCurrentPlan,
    required bool isDowngrade,
    required bool isUpgrade,
  }) {"""
content = re.sub(r'  Widget _buildPremiumCard\(\{.*?  \}\) \{', new_params, content, flags=re.DOTALL)

# Pass them in the builder
builder_call = """                                final isDowngrade = currentPlan != null && plan.sortOrder < currentPlan.sortOrder;
                                final isUpgrade = currentPlan != null && plan.sortOrder > currentPlan.sortOrder;

                                return Padding(
                                  padding: const EdgeInsets.only(bottom: 24),
                                  child: _buildPremiumCard(
                                    plan: plan,
                                    isRecommended: isRecommended,
                                    isCurrentPlan: isCurrentPlan,
                                    isDowngrade: isDowngrade,
                                    isUpgrade: isUpgrade,
                                  )"""
content = re.sub(r'                                return Padding\(\n                                  padding: const EdgeInsets.only\(bottom: 24\),\n                                  child: _buildPremiumCard\(\n                                    plan: plan,\n                                    isRecommended: isRecommended,\n                                    isCurrentPlan: isCurrentPlan,\n                                  \)', builder_call, content)

# Modify the button rendering logic
button_logic = """                        final isProcessing =
                            paymentState == PaymentState.loading ||
                                paymentState == PaymentState.pending;
                        
                        final bool isDisabled = isCurrentPlan || isDowngrade || isProcessing;
                        String buttonText;
                        if (isCurrentPlan) {
                          buttonText = 'CURRENT PLAN';
                        } else if (isDowngrade) {
                          buttonText = 'UNAVAILABLE'; // or just GET ACCESS but disabled, but usually it's greyed out
                        } else if (isUpgrade) {
                          buttonText = 'UPGRADE';
                        } else {
                          buttonText = isAutoRenew ? 'SUBSCRIBE NOW' : 'GET ACCESS';
                        }

                        return ElevatedButton(
                          style: ElevatedButton.styleFrom(
                            backgroundColor: isDisabled
                                ? Colors.grey.shade200
                                : (isRecommended ? kTextPrimary : Colors.white),
                            foregroundColor: isDisabled
                                ? kTextSecondary
                                : (isRecommended
                                    ? Colors.white
                                    : kTextPrimary),
                            elevation:
                                isRecommended && !isDisabled ? 8 : 0,
                            shadowColor: kTextPrimary.withOpacity(0.4),
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(16),
                              side: isDisabled || isRecommended
                                  ? BorderSide.none
                                  : BorderSide(color: Colors.grey.shade300),
                            ),
                          ),
                          onPressed: isDisabled
                              ? null
                              : () => _onSubscribe(plan),
                          child: isProcessing && !isCurrentPlan && !isDowngrade
                              ? const SizedBox(
                                  height: 24,
                                  width: 24,
                                  child: CircularProgressIndicator(
                                    strokeWidth: 2,
                                  ),
                                )
                              : Text(
                                  buttonText,
                                  style: const TextStyle(
                                    fontSize: 14,
                                    fontWeight: FontWeight.w800,
                                    letterSpacing: 1.5,
                                  ),
                                ),
                        );"""
content = re.sub(r'                        final isProcessing =.*?                        \);', button_logic, content, flags=re.DOTALL)

with open(file_path, 'w') as f:
    f.write(content)
print("Updated membership_screen.dart")

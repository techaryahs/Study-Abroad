const { withEntitlementUsage } = require("../utils/membershipUtils");

exports.chat = async (req, res) => {
  const { messages } = req.body;

  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({
      reply: "Message history is required.",
    });
  }

  const lastUserMessage = messages
    .filter((m) => m.sender === "user")
    .pop();

  const userText = lastUserMessage?.text?.trim();

  if (!userText) {
    return res.json({
      reply: "Please ask a valid question.",
    });
  }

  const result = await withEntitlementUsage(
    req.user.id || req.user._id,
    "study_abroad_assistant",
    async () => {
      await new Promise((resolve) => setTimeout(resolve, 15000));

      const reply = `I received your question:

"${userText}"

I am processing your request and will soon provide intelligent, detailed answers about careers, colleges, and education.`;

      return { reply };
    },
    { metadata: { source: "chat" } }
  );

  res.json(result);
};

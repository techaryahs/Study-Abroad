require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const { bootstrapCatalog } = require('./config/catalogBootstrap');
const { initMembershipSweeper } = require('./jobs/membershipSweeper.job');

const app = express();
const http = require('http');
const server = http.createServer(app);
const setupWebRTCSignaling = require('./webrtc-signaling');
const featureActivityRoutes = require("./routes/featureActivity.routes");
const couponRoutes = require('./routes/couponRoutes');

// ✅ FIXED: Proper CORS Configuration
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:3001',
    process.env.FRONTEND_URL,
  ].filter(Boolean),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Middleware
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
const path = require("path");
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/", (req, res) => {
  res.send("Server is running");
});

// Routes
app.use('/api/auth', require('./routes/auth.routes'));

// 🎟️ Coupon Codes
app.use('/api/coupons', couponRoutes);

// 👤 User
app.use("/api/user", require("./routes/user.routes"));

// 🧑‍💼 Admin (receipts, premium, consultants, api-key)
app.use("/api/admin", require("./routes/admin.routes"));

// 🎓 Careers / AI tools
app.use("/api/careers", require("./routes/career.routes"));

// 🤖 Chatbot
app.use("/api", require("./routes/chat.routes"));

// 📅 Booking & Consultants
app.use("/api/bookings", require("./routes/booking.routes"));

// 📅 Weekly Schedule (Admin-managed recurring availability)
app.use("/api/weekly-schedule", require("./routes/weeklySchedule.routes"));

// 🧑‍💼 Consultant Profile Management
app.use("/api/consultant", require("./routes/consultantProfile.routes"));

app.use("/api/progress", require("./routes/progressRoutes"));

app.use('/api/enquiry', require('./routes/enquiryRoutes'));
app.use('/api/payment', require('./routes/payment.routes')); // Deprecated v1
app.use('/api/payments/v2', require('./routes/payment.v2.routes'));
app.use('/api/webhooks', require('./routes/webhook.routes'));
app.use('/api/memberships', require('./routes/membership.routes'));

// 🩺 Health
app.use('/api/health', require('./routes/health.routes'));

// 🧑‍🎤 Profile
app.use("/api/user", require("./routes/profile.routes"));

// 👪 Parent
app.use("/api/parent", require("./routes/parent.routes"));

// 💓 Activity Manager
app.use("/api/activity", require("./routes/activityRoutes"));

app.use("/api/feature-activity", featureActivityRoutes);
app.use("/api/research-groups", require("./routes/researchGroup.routes"));
app.use("/api/reviews", require("./routes/review.routes"));

// Setup WebRTC Signaling
setupWebRTCSignaling(server);

// Important: Export for Vercel Serverless Functions
module.exports = app;

/**
 * Sequential startup: DB → Catalog Bootstrap → Listen.
 * Server refuses to start if catalog validation fails.
 */
async function boot() {
  // 1. Connect to MongoDB (indexes ensured inside connectDB)
  await connectDB();

  // 2. Auto-seed empty catalog + validate required plans
  await bootstrapCatalog();

  // 3. Record validation timestamp for health endpoint
  const { setLastValidatedAt } = require('./routes/health.routes');
  setLastValidatedAt(new Date());

  // 3.5. Init daily membership sweeper
  initMembershipSweeper();

  // 4. Start accepting requests
  const PORT = process.env.PORT || 5001;
  server.listen(PORT, '0.0.0.0', () =>
    console.log(`✅ Server running on port ${PORT}`)
  );
}

// Only boot if run directly (useful for local development)
if (require.main === module) {
  boot().catch((err) => {
    console.error("❌ Server failed to start:", err.message);
    process.exit(1);
  });
}
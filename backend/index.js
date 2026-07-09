require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

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

// Database Connection
connectDB();

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
app.use('/api/payment', require('./routes/payment.routes'));
app.use('/api/memberships', require('./routes/membership.routes'));

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

// Only listen if run directly (useful for local development)
if (require.main === module) {
  const PORT = process.env.PORT || 5001;
  // Explicitly bind to '0.0.0.0' to ensure Express is reachable on all local network interfaces (for mobile device testing)
  server.listen(PORT, '0.0.0.0', () => console.log(`✅ Server running on port ${PORT}`));
}
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Cloud & Local cross-origin access allowed
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use(express.json());

// MongoDB Atlas Connection (from .env)
const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI;

if (!MONGO_URI) {
  console.error("❌ ERROR: MONGO_URI is missing in server/.env file!");
} else {
  mongoose
    .connect(MONGO_URI)
    .then(() => console.log("✅ MongoDB Atlas Connected Successfully!"))
    .catch((err) => console.error("❌ MongoDB Connection Error:", err));
}

// Student Routes Register
const studentRoutes = require("./routes/studentRoutes");
app.use("/api/students", studentRoutes);

// Notices Routes Register
const noticeRoutes = require("./routes/noticeRoutes");
app.use("/api/notices", noticeRoutes);

// Health Check Route
app.get("/", (req, res) => {
  res.send("Naveen Academy API is Live on Cloud!");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
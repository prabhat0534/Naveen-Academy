const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use(express.json());

const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI;

if (!MONGO_URI) {
  console.error("❌ ERROR: MONGO_URI is missing in server/.env file!");
} else {
  mongoose
    .connect(MONGO_URI)
    .then(() => console.log("✅ MongoDB Atlas Connected Successfully!"))
    .catch((err) => console.error("❌ MongoDB Connection Error:", err));
}

// Routes Register
const authRoutes = require("./routes/authRoutes");
const studentRoutes = require("./routes/studentRoutes");
const noticeRoutes = require("./routes/noticeRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/notices", noticeRoutes);

app.get("/", (req, res) => {
  res.send("Naveen Academy API is Live on Cloud!");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
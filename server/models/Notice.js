const mongoose = require("mongoose");

const NoticeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    targetClass: {
      type: String,
      default: "All Classes",
    },
    category: {
      type: String,
      enum: ["Holiday", "Exam / Test", "Batch Timing", "Fee Alert", "General"],
      default: "General",
    },
    message: {
      type: String,
      required: true,
    },
    priority: {
      type: String,
      enum: ["Normal", "Important", "Urgent"],
      default: "Normal",
    },
    date: {
      type: String,
      default: () => new Date().toISOString().split("T")[0],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Notice", NoticeSchema);
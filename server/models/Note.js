const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    subject: { type: String, required: true },
    studentClass: { type: String, required: true }, // Class 3 to Class 10
    fileUrl: { type: String, required: true },
    fileType: { type: String, default: "PDF" },
    fileSize: { type: String, default: "1.5 MB" },
    downloadsCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Note", noteSchema);
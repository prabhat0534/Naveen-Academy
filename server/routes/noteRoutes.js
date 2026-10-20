const express = require("express");
const router = express.Router();
const Note = require("../models/Note");

// Get all notes (optional class filter)
router.get("/", async (req, res) => {
  try {
    const { studentClass } = req.query;
    let query = {};
    if (studentClass && studentClass !== "All") {
      query.studentClass = studentClass;
    }
    const notes = await Note.find(query).sort({ createdAt: -1 });
    res.json({ success: true, data: notes });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Create/Upload note
router.post("/", async (req, res) => {
  try {
    const { title, subject, studentClass, fileUrl, fileSize, fileType } = req.body;
    const newNote = new Note({
      title,
      subject,
      studentClass,
      fileUrl,
      fileSize: fileSize || "1.2 MB",
      fileType: fileType || "PDF",
    });
    await newNote.save();
    res.status(201).json({ success: true, data: newNote });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Delete note
router.delete("/:id", async (req, res) => {
  try {
    await Note.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Study material deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
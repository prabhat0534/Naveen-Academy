const express = require("express");
const router = express.Router();
const {
  getAllStudents,
  createStudent,
  collectStudentFee,
  updateStudent,
  deleteStudent,
} = require("../controllers/studentController");

router.get("/", getAllStudents);
router.post("/enroll", createStudent);
router.put("/:id/fee", collectStudentFee);

// Edit aur Delete endpoints
router.put("/:id", updateStudent);
router.delete("/:id", deleteStudent);

module.exports = router;
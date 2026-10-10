const express = require("express");
const router = express.Router();
const {
  getAllStudents,
  createStudent,
  collectStudentFee,
} = require("../controllers/studentController");

router.get("/", getAllStudents);
router.post("/enroll", createStudent);
router.put("/:id/fee", collectStudentFee);

module.exports = router;
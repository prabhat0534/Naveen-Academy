const express = require("express");
const router = express.Router();

const {
  getClasses,
  addClass,
} = require("../controllers/classController");

// Get All Classes
router.get("/", getClasses);

// Add New Class
router.post("/", addClass);

module.exports = router;
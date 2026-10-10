const Class = require("../models/Class");

// Get All Classes
const getClasses = async (req, res) => {
  try {
    const classes = await Class.find();

    res.status(200).json({
      success: true,
      classes,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// Add New Class
const addClass = async (req, res) => {
  try {
    const { name, teacher, students } = req.body;

    if (!name || !teacher) {
      return res.status(400).json({
        success: false,
        message: "Name and Teacher are required",
      });
    }

    const newClass = await Class.create({
      name,
      teacher,
      students,
    });

    res.status(201).json({
      success: true,
      message: "Class Added Successfully",
      class: newClass,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

module.exports = {
  getClasses,
  addClass,
};
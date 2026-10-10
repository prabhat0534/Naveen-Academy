const Student = require("../models/Student");
const Class = require("../models/Class");

const getDashboard = async (req, res) => {
  try {
    const totalStudents = await Student.countDocuments();
    const totalClasses = await Class.countDocuments();

    res.status(200).json({
      success: true,
      totalStudents,
      totalClasses,
      totalTeachers: 0,
      totalFees: 0,
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
  getDashboard,
};
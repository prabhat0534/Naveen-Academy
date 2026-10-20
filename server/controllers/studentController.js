const Student = require("../models/Student");

// 1. Get All Students
exports.getAllStudents = async (req, res) => {
  try {
    const students = await Student.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: students });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 2. Create / Enroll Student
exports.createStudent = async (req, res) => {
  try {
    const {
      name,
      studentClass,
      rollNo,
      fatherName,
      mobile,
      batchTiming,
      admissionDate,
      monthlyFee,
      address,
    } = req.body;

    if (!name || !studentClass || !mobile) {
      return res.status(400).json({
        success: false,
        message: "Name, Class, and Mobile are required.",
      });
    }

    const count = await Student.countDocuments();
    const autoId = `STU-${String(count + 1).padStart(3, "0")}`;
    const autoRoll =
      rollNo ||
      `${studentClass.replace("Class ", "")}-${Math.floor(
        10 + Math.random() * 89
      )}`;

    const feeAmount = Number(monthlyFee) || 1500;

    const student = new Student({
      studentId: autoId,
      name,
      studentClass,
      rollNo: autoRoll,
      fatherName: fatherName || "N/A",
      mobile,
      email: `${name.toLowerCase().replace(/\s+/g, "")}@naveenacademy.com`,
      address: address || "Greater Noida",
      admissionDate: admissionDate || new Date().toISOString().split("T")[0],
      monthlyFee: feeAmount,
      feeStatus: "Pending",
      attendance: 100,
      batchTiming: batchTiming || "04:30 PM - 06:00 PM",
      feeHistory: [
        {
          month: "October 2026",
          amount: feeAmount,
          mode: "-",
          transactionRef: "-",
          date: "-",
          status: "Pending",
        },
      ],
    });

    const saved = await student.save();
    res.status(201).json({ success: true, data: saved });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// 3. Collect Fee & Update Record
exports.collectStudentFee = async (req, res) => {
  try {
    const { id } = req.params;
    const { month, amount, mode, transactionRef } = req.body;

    const student = await Student.findOne({
      $or: [{ studentId: id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }],
    });
    if (!student) {
      return res.status(404).json({ success: false, message: "Student not found" });
    }

    const currentDate = new Date().toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

    const existingIndex = student.feeHistory.findIndex((f) => f.month === month);
    if (existingIndex > -1) {
      student.feeHistory[existingIndex].amount = Number(amount);
      student.feeHistory[existingIndex].mode = mode;
      student.feeHistory[existingIndex].transactionRef = transactionRef || "Verified";
      student.feeHistory[existingIndex].date = currentDate;
      student.feeHistory[existingIndex].status = "Paid";
    } else {
      student.feeHistory.unshift({
        month,
        amount: Number(amount),
        mode,
        transactionRef: transactionRef || "Verified",
        date: currentDate,
        status: "Paid",
      });
    }

    student.feeStatus = "Paid";
    await student.save();

    res.status(200).json({ success: true, data: student });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 4. Update Student Details
exports.updateStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };

    // studentId overwrite hone se protect karein
    delete updateData.studentId;

    const query = {
      $or: [{ studentId: id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }],
    };

    const updated = await Student.findOneAndUpdate(
      query,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ success: false, message: "Student not found" });
    }

    res.status(200).json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 5. Delete Student Record
exports.deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const query = {
      $or: [{ studentId: id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }],
    };

    const deleted = await Student.findOneAndDelete(query);

    if (!deleted) {
      return res.status(404).json({ success: false, message: "Student not found" });
    }

    res.status(200).json({ success: true, message: "Student record deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
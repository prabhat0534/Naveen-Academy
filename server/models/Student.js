const mongoose = require("mongoose");

const feeRecordSchema = new mongoose.Schema({
  month: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  mode: {
    type: String,
    default: "-",
  },
  transactionRef: {
    type: String,
    default: "-",
  },
  date: {
    type: String,
    default: "-",
  },
  status: {
    type: String,
    enum: ["Paid", "Pending"],
    default: "Pending",
  },
});

const studentSchema = new mongoose.Schema(
  {
    studentId: {
      type: String,
      unique: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    studentClass: {
      type: String,
      required: true,
    },

    rollNo: {
      type: String,
      default: "",
    },

    fatherName: {
      type: String,
      default: "N/A",
    },

    motherName: {
      type: String,
      default: "",
    },

    mobile: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      default: "",
    },

    address: {
      type: String,
      default: "Greater Noida",
    },

    batchTiming: {
      type: String,
      default: "04:30 PM - 06:00 PM",
    },

    monthlyFee: {
      type: Number,
      default: 1500,
    },

    admissionDate: {
      type: String,
      default: () => new Date().toISOString().split("T")[0],
    },

    feeStatus: {
      type: String,
      enum: ["Paid", "Pending"],
      default: "Pending",
    },

    attendance: {
      type: Number,
      default: 100,
    },

    photo: {
      type: String,
      default: "",
    },

    feeHistory: [feeRecordSchema],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Student", studentSchema);
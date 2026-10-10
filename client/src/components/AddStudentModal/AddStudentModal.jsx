import { useState, useEffect } from "react";
import API from "../../services/api";
import "./AddStudentModal.css";

function AddStudentModal({ closeModal, editStudent }) {
  const [formData, setFormData] = useState({
    name: "",
    studentClass: "",
    fatherName: "",
    motherName: "",
    mobile: "",
    email: "",
    address: "",
    dob: "",
    admissionDate: "",
    feeStatus: "Pending",
  });

  // Edit ke time existing student data form me fill karna
  useEffect(() => {
    if (editStudent) {
      setFormData({
        name: editStudent.name || "",
        studentClass: editStudent.studentClass || "",
        fatherName: editStudent.fatherName || "",
        motherName: editStudent.motherName || "",
        mobile: editStudent.mobile || "",
        email: editStudent.email || "",
        address: editStudent.address || "",
        dob: editStudent.dob || "",
        admissionDate: editStudent.admissionDate || "",
        feeStatus: editStudent.feeStatus || "Pending",
      });
    }
  }, [editStudent]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let res;

      // Edit mode
      if (editStudent) {
        res = await API.put(
          `/students/${editStudent._id}`,
          formData
        );
      } 
      // Add mode
      else {
        res = await API.post("/students", formData);
      }

      alert(res.data.message);

      closeModal();
      window.location.reload();

    } catch (error) {
      console.log(error);

      if (error.response) {
        alert(error.response.data.message);
      } else {
        alert("Server Error");
      }
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">

        <h2>
          {editStudent ? "✏️ Edit Student" : "👨‍🎓 Add Student"}
        </h2>

        <form onSubmit={handleSubmit}>

          <input
            type="text"
            name="name"
            placeholder="Student Name"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="studentClass"
            placeholder="Class"
            value={formData.studentClass}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="fatherName"
            placeholder="Father Name"
            value={formData.fatherName}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="motherName"
            placeholder="Mother Name"
            value={formData.motherName}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="mobile"
            placeholder="Mobile Number"
            value={formData.mobile}
            onChange={handleChange}
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
          />

          <textarea
            name="address"
            placeholder="Address"
            value={formData.address}
            onChange={handleChange}
            required
          />

          <label>Date of Birth</label>

          <input
            type="date"
            name="dob"
            value={formData.dob}
            onChange={handleChange}
          />

          <label>Admission Date</label>

          <input
            type="date"
            name="admissionDate"
            value={formData.admissionDate}
            onChange={handleChange}
          />

          <select
            name="feeStatus"
            value={formData.feeStatus}
            onChange={handleChange}
          >
            <option value="Pending">Pending</option>
            <option value="Paid">Paid</option>
          </select>

          <div className="modal-buttons">

            <button type="submit">
              {editStudent ? "Update Student" : "Save Student"}
            </button>

            <button
              type="button"
              onClick={closeModal}
            >
              Cancel
            </button>

          </div>

        </form>

      </div>
    </div>
  );
}

export default AddStudentModal;
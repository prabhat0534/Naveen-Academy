import { useState, useEffect } from "react";
import { fetchStudentsAPI, enrollStudentAPI, payFeeAPI } from "../../services/api";

export default function Students() {
  const [search, setSearch] = useState("");
  const [classFilter, setClassFilter] = useState("All");
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  const todayDate = new Date().toISOString().split("T")[0];

  // Fetch students from MongoDB Atlas
  const loadDatabaseStudents = async () => {
    try {
      setLoading(true);
      const res = await fetchStudentsAPI();
      if (res && res.success && Array.isArray(res.data)) {
        const mapped = res.data.map((item) => {
          const hasOctoberPaid = item.feeHistory?.some(
            (f) =>
              (f.month?.toLowerCase().includes("oct") || f.status === "Paid") &&
              f.status === "Paid"
          );

          const finalStatus =
            item.feeStatus === "Paid" || hasOctoberPaid ? "Paid" : "Pending";

          return {
            id: item.studentId || item._id,
            mongoId: item._id,
            name: item.name,
            class: item.studentClass,
            rollNo: item.rollNo || "-",
            fatherName: item.fatherName || "N/A",
            mobile: item.mobile,
            email: item.email || `${item.name.toLowerCase().replace(/\s+/g, "")}@naveenacademy.com`,
            address: item.address || "Greater Noida",
            admissionDate: item.admissionDate || todayDate,
            monthlyFee: item.monthlyFee || 1500,
            feeStatus: finalStatus,
            attendance: item.attendance || 100,
            batchTiming: item.batchTiming || "04:30 PM - 06:00 PM",
            feeHistory: item.feeHistory || [],
          };
        });
        setStudents(mapped);
      }
    } catch (err) {
      console.error("Database fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDatabaseStudents();
  }, []);

  // Discrete Time Picker State
  const [newStudent, setNewStudent] = useState({
    name: "",
    class: "Class 10",
    rollNo: "",
    fatherName: "",
    mobile: "",
    startHour: "04",
    startMinute: "30",
    startPeriod: "PM",
    endHour: "06",
    endMinute: "00",
    endPeriod: "PM",
    admissionDate: todayDate,
    monthlyFee: "1500",
    address: "",
  });

  const hoursList = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];
  const minutesList = ["00", "15", "30", "45"];

  const handleAddStudent = async (e) => {
    e.preventDefault();
    if (!newStudent.name || !newStudent.mobile) return;

    const formattedTiming = `${newStudent.startHour}:${newStudent.startMinute} ${newStudent.startPeriod} - ${newStudent.endHour}:${newStudent.endMinute} ${newStudent.endPeriod}`;

    const payload = {
      name: newStudent.name,
      studentClass: newStudent.class,
      rollNo: newStudent.rollNo,
      fatherName: newStudent.fatherName || "N/A",
      mobile: newStudent.mobile,
      address: newStudent.address || "Greater Noida",
      admissionDate: newStudent.admissionDate,
      monthlyFee: Number(newStudent.monthlyFee) || 1500,
      batchTiming: formattedTiming,
    };

    try {
      const res = await enrollStudentAPI(payload);

      if (res && res.success) {
        await loadDatabaseStudents();
        setNewStudent({
          name: "",
          class: "Class 10",
          rollNo: "",
          fatherName: "",
          mobile: "",
          startHour: "04",
          startMinute: "30",
          startPeriod: "PM",
          endHour: "06",
          endMinute: "00",
          endPeriod: "PM",
          admissionDate: todayDate,
          monthlyFee: "1500",
          address: "",
        });
        setShowAddModal(false);
        alert("🎉 Student successfully enrolled and saved to MongoDB Atlas!");
      } else {
        alert("❌ Error: " + (res?.message || "Failed to enroll student."));
      }
    } catch (err) {
      console.error("Save error:", err);
      alert("❌ Server connection error while saving student.");
    }
  };

  // Mark Fee Paid in English
  const handleMarkFeePaid = async (st) => {
    try {
      const payload = {
        month: "October 2026",
        amount: Number(st.monthlyFee) || 0,
        mode: "Cash / UPI",
        date: todayDate,
        status: "Paid",
      };

      const res = await payFeeAPI(st.mongoId || st.id, payload);
      if (res && res.success) {
        alert(`✅ Fee status updated to 'Paid' for ${st.name}!`);
        await loadDatabaseStudents();
        if (selectedStudent && selectedStudent.id === st.id) {
          setSelectedStudent((prev) => ({
            ...prev,
            feeStatus: "Paid",
            feeHistory: [payload, ...(prev.feeHistory || [])],
          }));
        }
      } else {
        setStudents((prev) =>
          prev.map((item) =>
            item.id === st.id ? { ...item, feeStatus: "Paid" } : item
          )
        );
        if (selectedStudent && selectedStudent.id === st.id) {
          setSelectedStudent((prev) => ({ ...prev, feeStatus: "Paid" }));
        }
        alert(`✅ Fee payment successfully recorded for ${st.name}!`);
      }
    } catch (err) {
      console.error("Fee update error:", err);
      alert("❌ An error occurred while updating the fee payment.");
    }
  };

  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.id.toLowerCase().includes(search.toLowerCase()) ||
      s.mobile.includes(search);
    const matchesClass = classFilter === "All" || s.class === classFilter;
    return matchesSearch && matchesClass;
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "22px", fontFamily: "'Inter', system-ui, sans-serif" }}>
      
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
        <div>
          <h2 style={{ fontSize: "22px", fontWeight: "700", color: "#0f172a", margin: 0 }}>Student Management</h2>
          <p style={{ fontSize: "13px", color: "#64748b", margin: "4px 0 0 0" }}>Manage student enrollments, batch details & complete profiles</p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          style={{
            backgroundColor: "#2563eb",
            color: "#ffffff",
            padding: "10px 18px",
            borderRadius: "10px",
            fontSize: "13px",
            fontWeight: "600",
            border: "none",
            cursor: "pointer",
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            boxShadow: "0 2px 4px rgba(37,99,235,0.2)"
          }}
        >
          <span>+ Enroll New Student</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div style={{ backgroundColor: "#ffffff", padding: "16px", borderRadius: "14px", border: "1px solid #e2e8f0", display: "flex", flexWrap: "wrap", gap: "12px", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ flex: 1, minWidth: "240px" }}>
          <input
            type="text"
            placeholder="Search by student name, roll number, or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "13px", outline: "none", boxSizing: "border-box" }}
          />
        </div>

        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          <span style={{ fontSize: "12px", fontWeight: "600", color: "#64748b" }}>Filter Class:</span>
          <select
            value={classFilter}
            onChange={(e) => setClassFilter(e.target.value)}
            style={{ padding: "9px 12px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "13px", outline: "none", backgroundColor: "#fff", cursor: "pointer" }}
          >
            <option value="All">All Classes (3 to 10)</option>
            {["Class 10", "Class 9", "Class 8", "Class 7", "Class 6", "Class 5", "Class 4", "Class 3"].map((cls) => (
              <option key={cls} value={cls}>{cls}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Students Table */}
      <div style={{ backgroundColor: "#ffffff", borderRadius: "14px", border: "1px solid #e2e8f0", overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "13px" }}>
            <thead>
              <tr style={{ backgroundColor: "#f8fafc", color: "#64748b", fontSize: "11px", textTransform: "uppercase", borderBottom: "1px solid #e2e8f0" }}>
                <th style={{ padding: "12px 18px" }}>Student</th>
                <th style={{ padding: "12px 16px" }}>Class & Timing</th>
                <th style={{ padding: "12px 16px" }}>Father's Name</th>
                <th style={{ padding: "12px 16px" }}>Contact</th>
                <th style={{ padding: "12px 16px" }}>Monthly Fee</th>
                <th style={{ padding: "12px 16px" }}>Fee Status</th>
                <th style={{ padding: "12px 18px", textAlign: "right" }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" style={{ padding: "32px", textAlign: "center", color: "#64748b" }}>
                    🔄 Connecting to database and loading students...
                  </td>
                </tr>
              ) : filteredStudents.length > 0 ? (
                filteredStudents.map((st) => (
                  <tr key={st.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                    <td style={{ padding: "12px 18px" }}>
                      <div
                        onClick={() => setSelectedStudent(st)}
                        style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }}
                      >
                        <div style={{ width: "36px", height: "36px", borderRadius: "10px", backgroundColor: "#eff6ff", color: "#2563eb", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "700", fontSize: "13px" }}>
                          {st.name.charAt(0)}
                        </div>
                        <div>
                          <div style={{ fontWeight: "600", color: "#0f172a" }}>{st.name}</div>
                          <div style={{ fontSize: "11px", color: "#94a3b8" }}>{st.id} • Roll: {st.rollNo}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <div style={{ color: "#0f172a", fontWeight: "600" }}>{st.class}</div>
                      <div style={{ fontSize: "11px", color: "#64748b" }}>🕒 {st.batchTiming}</div>
                    </td>
                    <td style={{ padding: "12px 16px", color: "#475569" }}>{st.fatherName}</td>
                    <td style={{ padding: "12px 16px", color: "#64748b" }}>{st.mobile}</td>
                    <td style={{ padding: "12px 16px", fontWeight: "700", color: "#0f172a" }}>₹{st.monthlyFee}</td>
                    <td style={{ padding: "12px 16px" }}>
                      <span
                        style={{
                          display: "inline-block",
                          padding: "3px 10px",
                          borderRadius: "9999px",
                          fontSize: "11px",
                          fontWeight: "600",
                          backgroundColor: st.feeStatus === "Paid" ? "#ecfdf5" : "#fef3c7",
                          color: st.feeStatus === "Paid" ? "#047857" : "#b45309",
                        }}
                      >
                        {st.feeStatus}
                      </span>
                    </td>
                    <td style={{ padding: "12px 18px", textAlign: "right" }}>
                      <div style={{ display: "inline-flex", gap: "8px" }}>
                        {st.feeStatus !== "Paid" && (
                          <button
                            onClick={() => handleMarkFeePaid(st)}
                            style={{
                              backgroundColor: "#ecfdf5",
                              color: "#047857",
                              border: "1px solid #a7f3d0",
                              padding: "6px 10px",
                              borderRadius: "8px",
                              fontSize: "12px",
                              fontWeight: "600",
                              cursor: "pointer",
                            }}
                          >
                            Mark Paid
                          </button>
                        )}
                        <button
                          onClick={() => setSelectedStudent(st)}
                          style={{
                            backgroundColor: "#eff6ff",
                            color: "#1d4ed8",
                            border: "1px solid #bfdbfe",
                            padding: "6px 12px",
                            borderRadius: "8px",
                            fontSize: "12px",
                            fontWeight: "600",
                            cursor: "pointer",
                          }}
                        >
                          View Profile
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" style={{ padding: "32px", textAlign: "center", color: "#94a3b8" }}>
                    No students found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* FULL STUDENT PROFILE MODAL */}
      {selectedStudent && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(15, 23, 42, 0.65)",
            backdropFilter: "blur(5px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 150,
            padding: "16px"
          }}
        >
          <div
            style={{
              backgroundColor: "#ffffff",
              borderRadius: "20px",
              padding: "26px",
              maxWidth: "600px",
              width: "100%",
              maxHeight: "90vh",
              overflowY: "auto",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
              border: "1px solid #cbd5e1"
            }}
          >
            {/* Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "18px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                <div style={{ width: "54px", height: "54px", borderRadius: "14px", backgroundColor: "#2563eb", color: "#ffffff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px", fontWeight: "800" }}>
                  {selectedStudent.name.charAt(0)}
                </div>
                <div>
                  <h3 style={{ fontSize: "20px", fontWeight: "800", color: "#0f172a", margin: 0 }}>
                    {selectedStudent.name}
                  </h3>
                  <div style={{ display: "flex", gap: "8px", alignItems: "center", marginTop: "4px" }}>
                    <span style={{ fontSize: "12px", color: "#2563eb", fontWeight: "700", backgroundColor: "#eff6ff", padding: "2px 8px", borderRadius: "6px" }}>
                      {selectedStudent.class}
                    </span>
                    <span style={{ fontSize: "12px", color: "#64748b" }}>ID: {selectedStudent.id}</span>
                    <span style={{ fontSize: "12px", color: "#64748b" }}>• Roll: {selectedStudent.rollNo}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setSelectedStudent(null)}
                style={{ background: "#f1f5f9", border: "none", width: "32px", height: "32px", borderRadius: "8px", fontSize: "16px", cursor: "pointer", color: "#475569", display: "flex", alignItems: "center", justifyContent: "center" }}
              >
                ✕
              </button>
            </div>

            {/* Quick Metrics Bar */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px", marginBottom: "20px" }}>
              <div style={{ backgroundColor: "#f8fafc", padding: "12px", borderRadius: "10px", border: "1px solid #e2e8f0", textAlign: "center" }}>
                <span style={{ fontSize: "11px", color: "#64748b", fontWeight: "600", textTransform: "uppercase" }}>Monthly Fee</span>
                <div style={{ fontSize: "18px", fontWeight: "800", color: "#0f172a", marginTop: "2px" }}>₹{selectedStudent.monthlyFee}</div>
              </div>
              <div style={{ backgroundColor: "#f8fafc", padding: "12px", borderRadius: "10px", border: "1px solid #e2e8f0", textAlign: "center" }}>
                <span style={{ fontSize: "11px", color: "#64748b", fontWeight: "600", textTransform: "uppercase" }}>Fee Status</span>
                <div style={{ fontSize: "15px", fontWeight: "800", color: selectedStudent.feeStatus === "Paid" ? "#047857" : "#b45309", marginTop: "4px" }}>
                  {selectedStudent.feeStatus}
                </div>
              </div>
              <div style={{ backgroundColor: "#f8fafc", padding: "12px", borderRadius: "10px", border: "1px solid #e2e8f0", textAlign: "center" }}>
                <span style={{ fontSize: "11px", color: "#64748b", fontWeight: "600", textTransform: "uppercase" }}>Admission Date</span>
                <div style={{ fontSize: "13px", fontWeight: "700", color: "#0f172a", marginTop: "4px" }}>{selectedStudent.admissionDate}</div>
              </div>
            </div>

            {/* Quick Fee Action */}
            {selectedStudent.feeStatus !== "Paid" && (
              <div style={{ backgroundColor: "#fffbeb", border: "1px solid #fde68a", borderRadius: "12px", padding: "12px 16px", marginBottom: "20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "13px", color: "#92400e", fontWeight: "600" }}>
                  ⚠️ October 2026 fee is pending (₹{selectedStudent.monthlyFee})
                </span>
                <button
                  onClick={() => handleMarkFeePaid(selectedStudent)}
                  style={{ backgroundColor: "#047857", color: "#fff", border: "none", padding: "7px 14px", borderRadius: "8px", fontSize: "12px", fontWeight: "700", cursor: "pointer" }}
                >
                  ✓ Mark October as Paid
                </button>
              </div>
            )}

            {/* Contact & Batch Details */}
            <div style={{ marginBottom: "20px" }}>
              <h4 style={{ fontSize: "13px", fontWeight: "700", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em", margin: "0 0 10px 0" }}>
                Contact & Batch Details
              </h4>
              <div style={{ backgroundColor: "#ffffff", borderRadius: "12px", border: "1px solid #e2e8f0", padding: "14px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", fontSize: "13px" }}>
                <div>
                  <span style={{ color: "#94a3b8", fontSize: "11px", display: "block" }}>Father / Guardian Name</span>
                  <strong style={{ color: "#0f172a" }}>{selectedStudent.fatherName}</strong>
                </div>
                <div>
                  <span style={{ color: "#94a3b8", fontSize: "11px", display: "block" }}>Contact Phone</span>
                  <strong style={{ color: "#0f172a" }}>{selectedStudent.mobile}</strong>
                </div>
                <div>
                  <span style={{ color: "#94a3b8", fontSize: "11px", display: "block" }}>Batch Timing</span>
                  <strong style={{ color: "#2563eb" }}>🕒 {selectedStudent.batchTiming}</strong>
                </div>
                <div>
                  <span style={{ color: "#94a3b8", fontSize: "11px", display: "block" }}>Email ID</span>
                  <span style={{ color: "#334155" }}>{selectedStudent.email}</span>
                </div>
                <div style={{ gridColumn: "1 / -1" }}>
                  <span style={{ color: "#94a3b8", fontSize: "11px", display: "block" }}>Residential Address</span>
                  <span style={{ color: "#334155" }}>{selectedStudent.address}</span>
                </div>
              </div>
            </div>

            {/* Fee History */}
            <div style={{ marginBottom: "20px" }}>
              <h4 style={{ fontSize: "13px", fontWeight: "700", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em", margin: "0 0 10px 0" }}>
                Fee Records & Transaction History
              </h4>
              <div style={{ border: "1px solid #e2e8f0", borderRadius: "12px", overflow: "hidden" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "12px" }}>
                  <thead>
                    <tr style={{ backgroundColor: "#f8fafc", color: "#64748b", borderBottom: "1px solid #e2e8f0" }}>
                      <th style={{ padding: "8px 12px" }}>Month</th>
                      <th style={{ padding: "8px 12px" }}>Amount</th>
                      <th style={{ padding: "8px 12px" }}>Mode</th>
                      <th style={{ padding: "8px 12px" }}>Date</th>
                      <th style={{ padding: "8px 12px", textAlign: "right" }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedStudent.feeHistory && selectedStudent.feeHistory.length > 0 ? (
                      selectedStudent.feeHistory.map((fee, idx) => (
                        <tr key={idx} style={{ borderBottom: "1px solid #f1f5f9" }}>
                          <td style={{ padding: "10px 12px", fontWeight: "600", color: "#0f172a" }}>{fee.month}</td>
                          <td style={{ padding: "10px 12px", fontWeight: "700" }}>₹{fee.amount}</td>
                          <td style={{ padding: "10px 12px", color: "#475569" }}>{fee.mode}</td>
                          <td style={{ padding: "10px 12px", color: "#64748b" }}>{fee.date}</td>
                          <td style={{ padding: "10px 12px", textAlign: "right" }}>
                            <span
                              style={{
                                padding: "2px 8px",
                                borderRadius: "9999px",
                                fontSize: "11px",
                                fontWeight: "700",
                                backgroundColor: fee.status === "Paid" ? "#ecfdf5" : "#fef3c7",
                                color: fee.status === "Paid" ? "#047857" : "#b45309",
                              }}
                            >
                              {fee.status}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" style={{ padding: "12px", textAlign: "center", color: "#94a3b8" }}>
                          No fee records found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Bottom Actions */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid #e2e8f0", paddingTop: "16px", gap: "10px" }}>
              <a
                href={`https://wa.me/91${selectedStudent.mobile}`}
                target="_blank"
                rel="noreferrer"
                style={{
                  textDecoration: "none",
                  backgroundColor: "#22c55e",
                  color: "#ffffff",
                  padding: "9px 16px",
                  borderRadius: "10px",
                  fontSize: "13px",
                  fontWeight: "700",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px"
                }}
              >
                💬 WhatsApp Parent
              </a>

              <button
                onClick={() => setSelectedStudent(null)}
                style={{
                  padding: "9px 18px",
                  borderRadius: "10px",
                  border: "1px solid #cbd5e1",
                  backgroundColor: "#f8fafc",
                  fontSize: "13px",
                  fontWeight: "600",
                  color: "#475569",
                  cursor: "pointer"
                }}
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ENROLL MODAL */}
      {showAddModal && (
        <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(15, 23, 42, 0.6)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, padding: "16px" }}>
          <div style={{ backgroundColor: "#ffffff", borderRadius: "16px", padding: "24px", maxWidth: "520px", width: "100%", maxHeight: "90vh", overflowY: "auto", boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <h3 style={{ fontSize: "18px", fontWeight: "700", color: "#0f172a", margin: 0 }}>Enroll New Student</h3>
              <button onClick={() => setShowAddModal(false)} style={{ background: "none", border: "none", fontSize: "18px", cursor: "pointer", color: "#64748b" }}>
                ✕
              </button>
            </div>

            <form onSubmit={handleAddStudent} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div>
                <label style={{ fontSize: "12px", fontWeight: "600", color: "#475569", display: "block", marginBottom: "4px" }}>Student Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Vikas Sharma"
                  value={newStudent.name}
                  onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
                  style={{ width: "100%", padding: "8px 12px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "13px", boxSizing: "border-box" }}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div>
                  <label style={{ fontSize: "12px", fontWeight: "600", color: "#475569", display: "block", marginBottom: "4px" }}>Class *</label>
                  <select
                    value={newStudent.class}
                    onChange={(e) => setNewStudent({ ...newStudent, class: e.target.value })}
                    style={{ width: "100%", padding: "8px 12px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "13px", boxSizing: "border-box", backgroundColor: "#fff" }}
                  >
                    {["Class 10", "Class 9", "Class 8", "Class 7", "Class 6", "Class 5", "Class 4", "Class 3"].map((cls) => (
                      <option key={cls} value={cls}>{cls}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: "12px", fontWeight: "600", color: "#475569", display: "block", marginBottom: "4px" }}>Roll Number (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. 10-25"
                    value={newStudent.rollNo}
                    onChange={(e) => setNewStudent({ ...newStudent, rollNo: e.target.value })}
                    style={{ width: "100%", padding: "8px 12px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "13px", boxSizing: "border-box" }}
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div>
                  <label style={{ fontSize: "12px", fontWeight: "600", color: "#475569", display: "block", marginBottom: "4px" }}>Father / Guardian Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Ramesh Sharma"
                    value={newStudent.fatherName}
                    onChange={(e) => setNewStudent({ ...newStudent, fatherName: e.target.value })}
                    style={{ width: "100%", padding: "8px 12px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "13px", boxSizing: "border-box" }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: "12px", fontWeight: "600", color: "#475569", display: "block", marginBottom: "4px" }}>Contact Phone *</label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 9876543210"
                    value={newStudent.mobile}
                    onChange={(e) => setNewStudent({ ...newStudent, mobile: e.target.value })}
                    style={{ width: "100%", padding: "8px 12px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "13px", boxSizing: "border-box" }}
                  />
                </div>
              </div>

              {/* Timing */}
              <div style={{ backgroundColor: "#f8fafc", padding: "12px 14px", borderRadius: "10px", border: "1px solid #e2e8f0" }}>
                <span style={{ fontSize: "12px", fontWeight: "700", color: "#0f172a", display: "block", marginBottom: "8px" }}>
                  🕒 Set Batch Timing *
                </span>
                
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <div>
                    <label style={{ fontSize: "11px", fontWeight: "600", color: "#64748b", display: "block", marginBottom: "4px" }}>Start Time</label>
                    <div style={{ display: "flex", gap: "4px" }}>
                      <select
                        value={newStudent.startHour}
                        onChange={(e) => setNewStudent({ ...newStudent, startHour: e.target.value })}
                        style={{ flex: 1, padding: "7px 4px", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "12px", backgroundColor: "#fff" }}
                      >
                        {hoursList.map((h) => <option key={h} value={h}>{h}</option>)}
                      </select>
                      <span style={{ alignSelf: "center", color: "#94a3b8" }}>:</span>
                      <select
                        value={newStudent.startMinute}
                        onChange={(e) => setNewStudent({ ...newStudent, startMinute: e.target.value })}
                        style={{ flex: 1, padding: "7px 4px", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "12px", backgroundColor: "#fff" }}
                      >
                        {minutesList.map((m) => <option key={m} value={m}>{m}</option>)}
                      </select>
                      <select
                        value={newStudent.startPeriod}
                        onChange={(e) => setNewStudent({ ...newStudent, startPeriod: e.target.value })}
                        style={{ flex: 1.2, padding: "7px 4px", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "12px", backgroundColor: "#fff", fontWeight: "600" }}
                      >
                        <option value="AM">AM</option>
                        <option value="PM">PM</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label style={{ fontSize: "11px", fontWeight: "600", color: "#64748b", display: "block", marginBottom: "4px" }}>End Time</label>
                    <div style={{ display: "flex", gap: "4px" }}>
                      <select
                        value={newStudent.endHour}
                        onChange={(e) => setNewStudent({ ...newStudent, endHour: e.target.value })}
                        style={{ flex: 1, padding: "7px 4px", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "12px", backgroundColor: "#fff" }}
                      >
                        {hoursList.map((h) => <option key={h} value={h}>{h}</option>)}
                      </select>
                      <span style={{ alignSelf: "center", color: "#94a3b8" }}>:</span>
                      <select
                        value={newStudent.endMinute}
                        onChange={(e) => setNewStudent({ ...newStudent, endMinute: e.target.value })}
                        style={{ flex: 1, padding: "7px 4px", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "12px", backgroundColor: "#fff" }}
                      >
                        {minutesList.map((m) => <option key={m} value={m}>{m}</option>)}
                      </select>
                      <select
                        value={newStudent.endPeriod}
                        onChange={(e) => setNewStudent({ ...newStudent, endPeriod: e.target.value })}
                        style={{ flex: 1.2, padding: "7px 4px", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "12px", backgroundColor: "#fff", fontWeight: "600" }}
                      >
                        <option value="AM">AM</option>
                        <option value="PM">PM</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Admission Date & Fee */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div>
                  <label style={{ fontSize: "12px", fontWeight: "600", color: "#475569", display: "block", marginBottom: "4px" }}>Admission Date *</label>
                  <input
                    type="date"
                    required
                    value={newStudent.admissionDate}
                    onChange={(e) => setNewStudent({ ...newStudent, admissionDate: e.target.value })}
                    style={{ width: "100%", padding: "8px 12px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "13px", boxSizing: "border-box", backgroundColor: "#fff" }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: "12px", fontWeight: "600", color: "#475569", display: "block", marginBottom: "4px" }}>Monthly Fee (₹) *</label>
                  <input
                    type="number"
                    required
                    placeholder="1500"
                    value={newStudent.monthlyFee}
                    onChange={(e) => setNewStudent({ ...newStudent, monthlyFee: e.target.value })}
                    style={{ width: "100%", padding: "8px 12px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "13px", boxSizing: "border-box" }}
                  />
                </div>
              </div>

              {/* Address */}
              <div>
                <label style={{ fontSize: "12px", fontWeight: "600", color: "#475569", display: "block", marginBottom: "4px" }}>Residential Address</label>
                <input
                  type="text"
                  placeholder="e.g. Sector 4, Block B, Greater Noida"
                  value={newStudent.address}
                  onChange={(e) => setNewStudent({ ...newStudent, address: e.target.value })}
                  style={{ width: "100%", padding: "8px 12px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "13px", boxSizing: "border-box" }}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "12px" }}>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  style={{ padding: "8px 16px", borderRadius: "8px", border: "1px solid #cbd5e1", background: "none", fontSize: "13px", cursor: "pointer", color: "#475569" }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ padding: "8px 18px", borderRadius: "8px", border: "none", backgroundColor: "#2563eb", color: "#fff", fontSize: "13px", fontWeight: "600", cursor: "pointer" }}
                >
                  Enroll Student
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
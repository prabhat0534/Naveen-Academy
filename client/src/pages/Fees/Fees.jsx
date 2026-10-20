import React, { useState, useEffect } from "react";
import { fetchStudentsAPI, payFeeAPI } from "../../services/api";
import { getFeeReminderMessage, generateWhatsAppLink } from "../../utils/whatsappTemplates";

export default function Fees({ autoOpenFeeModal, clearAutoOpen }) {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [classFilter, setClassFilter] = useState("All");

  // Collect Fee Modal State
  const [collectModalOpen, setCollectModalOpen] = useState(false);
  const [activeStudent, setActiveStudent] = useState(null);
  const [feeForm, setFeeForm] = useState({
    month: "October 2026",
    amount: "",
    mode: "UPI (Google Pay)",
    date: new Date().toISOString().split("T")[0],
  });

  // Receipt Modal State
  const [receiptData, setReceiptData] = useState(null);

  // Student Month-wise Ledger Modal State
  const [selectedLedgerStudent, setSelectedLedgerStudent] = useState(null);

  // Standard Academic Classes (Class 3 to 10)
  const academicClasses = [
    "Class 3",
    "Class 4",
    "Class 5",
    "Class 6",
    "Class 7",
    "Class 8",
    "Class 9",
    "Class 10",
  ];

  // Standard Academic Session Months (April to March)
  const sessionMonths = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await fetchStudentsAPI();
      if (res && res.success && Array.isArray(res.data)) {
        const mapped = res.data.map((item) => {
          const hasCurrentMonthPaid = item.feeHistory?.some(
            (f) =>
              (f.month?.toLowerCase().includes("oct") || f.status === "Paid") &&
              f.status === "Paid"
          );

          const status =
            item.feeStatus === "Paid" || hasCurrentMonthPaid ? "Paid" : "Pending";

          return {
            id: item.studentId || item._id,
            mongoId: item._id,
            name: item.name,
            class: item.studentClass,
            rollNo: item.rollNo || "-",
            fatherName: item.fatherName || "N/A",
            mobile: item.mobile,
            monthlyFee: item.monthlyFee || 1500,
            feeStatus: status,
            feeHistory: item.feeHistory || [],
          };
        });
        setStudents(mapped);

        if (selectedLedgerStudent) {
          const refreshed = mapped.find(
            (s) => s.id === selectedLedgerStudent.id || s.mongoId === selectedLedgerStudent.mongoId
          );
          if (refreshed) setSelectedLedgerStudent(refreshed);
        }
      }
    } catch (err) {
      console.error("Failed to load fees data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (autoOpenFeeModal && students.length > 0) {
      const firstPending = students.find((s) => s.feeStatus !== "Paid") || students[0];
      if (firstPending) {
        openCollectModal(firstPending);
      }
      if (clearAutoOpen) clearAutoOpen();
    }
  }, [autoOpenFeeModal, students]);

  const openCollectModal = (student, defaultMonth = "October 2026") => {
    setActiveStudent(student);
    setFeeForm({
      month: defaultMonth,
      amount: student.monthlyFee || 1500,
      mode: "UPI (Google Pay)",
      date: new Date().toISOString().split("T")[0],
    });
    setCollectModalOpen(true);
  };

  const handleCollectSubmit = async (e) => {
    e.preventDefault();
    if (!activeStudent) return;

    const payload = {
      month: feeForm.month,
      amount: Number(feeForm.amount),
      mode: feeForm.mode,
      date: feeForm.date,
      status: "Paid",
    };

    try {
      const res = await payFeeAPI(activeStudent.mongoId || activeStudent.id, payload);

      if (res && res.success) {
        alert(`✅ Payment of ₹${payload.amount} successfully recorded for ${activeStudent.name}!`);
        setCollectModalOpen(false);
        await loadData();

        setReceiptData({
          receiptNo: `REC-${Math.floor(100000 + Math.random() * 900000)}`,
          studentName: activeStudent.name,
          studentClass: activeStudent.class,
          studentId: activeStudent.id,
          amount: payload.amount,
          month: payload.month,
          mode: payload.mode,
          date: payload.date,
          fatherName: activeStudent.fatherName,
        });
      } else {
        alert("❌ Error: " + (res?.message || "Payment update failed."));
      }
    } catch (err) {
      console.error("Payment error:", err);
      alert("❌ Server connection error while processing fee.");
    }
  };

  const getMonthRecord = (student, monthName) => {
    if (!student || !student.feeHistory) return null;
    return student.feeHistory.find((f) => {
      const recorded = f.month ? f.month.toLowerCase().trim() : "";
      const target = monthName.toLowerCase().trim();
      return (recorded.includes(target) || target.includes(recorded)) && f.status === "Paid";
    });
  };

  // Helper function to normalize class matching (handles "10" and "Class 10")
  const isClassMatching = (studentClass, selectedClass) => {
    if (selectedClass === "All") return true;
    const s1 = String(studentClass || "").toLowerCase().replace("class", "").trim();
    const s2 = String(selectedClass || "").toLowerCase().replace("class", "").trim();
    return s1 === s2;
  };

  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.id.toLowerCase().includes(search.toLowerCase()) ||
      s.mobile?.includes(search);
    const matchesStatus =
      statusFilter === "All" || s.feeStatus === statusFilter;
    const matchesClass = isClassMatching(s.class, classFilter);

    return matchesSearch && matchesStatus && matchesClass;
  });

  const totalCollected = filteredStudents
    .filter((s) => s.feeStatus === "Paid")
    .reduce((sum, s) => sum + (Number(s.monthlyFee) || 0), 0);

  const totalPending = filteredStudents
    .filter((s) => s.feeStatus !== "Paid")
    .reduce((sum, s) => sum + (Number(s.monthlyFee) || 0), 0);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "22px", fontFamily: "'Inter', system-ui, sans-serif" }}>
      
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
        <div>
          <h2 style={{ fontSize: "22px", fontWeight: "700", color: "#0f172a", margin: 0 }}>Fees Management</h2>
          <p style={{ fontSize: "13px", color: "#64748b", margin: "4px 0 0 0" }}>
            Track monthly collections, filter by class & status, view 12-month student fee ledgers
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px" }}>
        <div style={{ backgroundColor: "#ffffff", padding: "18px", borderRadius: "14px", border: "1px solid #e2e8f0" }}>
          <span style={{ fontSize: "11px", fontWeight: "700", color: "#64748b", textTransform: "uppercase" }}>
            Collected ({classFilter === "All" ? "All Classes" : classFilter})
          </span>
          <div style={{ fontSize: "24px", fontWeight: "800", color: "#047857", marginTop: "6px" }}>
            ₹{totalCollected.toLocaleString("en-IN")}
          </div>
          <span style={{ fontSize: "12px", color: "#10b981", fontWeight: "600" }}>✓ October 2026 Collection</span>
        </div>

        <div style={{ backgroundColor: "#ffffff", padding: "18px", borderRadius: "14px", border: "1px solid #e2e8f0" }}>
          <span style={{ fontSize: "11px", fontWeight: "700", color: "#64748b", textTransform: "uppercase" }}>Pending Dues</span>
          <div style={{ fontSize: "24px", fontWeight: "800", color: totalPending > 0 ? "#b45309" : "#0f172a", marginTop: "6px" }}>
            ₹{totalPending.toLocaleString("en-IN")}
          </div>
          <span style={{ fontSize: "12px", color: "#d97706", fontWeight: "600" }}>
            ⚠️ {filteredStudents.filter((s) => s.feeStatus !== "Paid").length} Students pending
          </span>
        </div>

        <div style={{ backgroundColor: "#ffffff", padding: "18px", borderRadius: "14px", border: "1px solid #e2e8f0" }}>
          <span style={{ fontSize: "11px", fontWeight: "700", color: "#64748b", textTransform: "uppercase" }}>Filtered Students</span>
          <div style={{ fontSize: "24px", fontWeight: "800", color: "#0f172a", marginTop: "6px" }}>
            {filteredStudents.length}
          </div>
          <span style={{ fontSize: "12px", color: "#64748b", fontWeight: "600" }}>🎓 Out of {students.length} Total</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div style={{ backgroundColor: "#ffffff", padding: "16px", borderRadius: "14px", border: "1px solid #e2e8f0", display: "flex", flexWrap: "wrap", gap: "12px", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ flex: 1, minWidth: "220px" }}>
          <input
            type="text"
            placeholder="Search student name, roll number, or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "13px", outline: "none", boxSizing: "border-box" }}
          />
        </div>

        <div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>
          {/* Fixed Class 3 to 10 Filter Dropdown */}
          <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
            <span style={{ fontSize: "12px", fontWeight: "600", color: "#64748b" }}>Class:</span>
            <select
              value={classFilter}
              onChange={(e) => setClassFilter(e.target.value)}
              style={{ padding: "9px 12px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "13px", outline: "none", backgroundColor: "#fff", cursor: "pointer" }}
            >
              <option value="All">All Classes (3 to 10)</option>
              {academicClasses.map((cls) => (
                <option key={cls} value={cls}>{cls}</option>
              ))}
            </select>
          </div>

          {/* Status Filter Dropdown */}
          <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
            <span style={{ fontSize: "12px", fontWeight: "600", color: "#64748b" }}>Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{ padding: "9px 12px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "13px", outline: "none", backgroundColor: "#fff", cursor: "pointer" }}
            >
              <option value="All">All Status</option>
              <option value="Paid">Paid</option>
              <option value="Pending">Pending</option>
            </select>
          </div>
        </div>
      </div>

      {/* Fee Table */}
      <div style={{ backgroundColor: "#ffffff", borderRadius: "14px", border: "1px solid #e2e8f0", overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "13px" }}>
            <thead>
              <tr style={{ backgroundColor: "#f8fafc", color: "#64748b", fontSize: "11px", textTransform: "uppercase", borderBottom: "1px solid #e2e8f0" }}>
                <th style={{ padding: "12px 18px" }}>Student</th>
                <th style={{ padding: "12px 16px" }}>Class</th>
                <th style={{ padding: "12px 16px" }}>Father's Name</th>
                <th style={{ padding: "12px 16px" }}>Monthly Fee</th>
                <th style={{ padding: "12px 16px" }}>Current Status</th>
                <th style={{ padding: "12px 16px" }}>12-Month Ledger</th>
                <th style={{ padding: "12px 18px", textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" style={{ padding: "32px", textAlign: "center", color: "#64748b" }}>
                    🔄 Loading fees ledger from MongoDB...
                  </td>
                </tr>
              ) : filteredStudents.length > 0 ? (
                filteredStudents.map((st) => {
                  const paidCount = sessionMonths.filter((m) => !!getMonthRecord(st, m)).length;

                  return (
                    <tr key={st.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                      <td style={{ padding: "12px 18px" }}>
                        <div style={{ fontWeight: "700", color: "#0f172a" }}>{st.name}</div>
                        <div style={{ fontSize: "11px", color: "#94a3b8" }}>{st.id} • Roll: {st.rollNo}</div>
                      </td>
                      <td style={{ padding: "12px 16px", color: "#0f172a", fontWeight: "600" }}>{st.class}</td>
                      <td style={{ padding: "12px 16px", color: "#475569" }}>{st.fatherName}</td>
                      <td style={{ padding: "12px 16px", fontWeight: "700", color: "#0f172a" }}>₹{st.monthlyFee}</td>
                      <td style={{ padding: "12px 16px" }}>
                        <span
                          style={{
                            display: "inline-block",
                            padding: "3px 10px",
                            borderRadius: "9999px",
                            fontSize: "11px",
                            fontWeight: "700",
                            backgroundColor: st.feeStatus === "Paid" ? "#ecfdf5" : "#fef3c7",
                            color: st.feeStatus === "Paid" ? "#047857" : "#b45309",
                          }}
                        >
                          {st.feeStatus}
                        </span>
                      </td>
                      <td style={{ padding: "12px 16px" }}>
                        <button
                          onClick={() => setSelectedLedgerStudent(st)}
                          style={{
                            backgroundColor: "#eff6ff",
                            color: "#1d4ed8",
                            border: "1px solid #bfdbfe",
                            padding: "6px 12px",
                            borderRadius: "8px",
                            fontSize: "12px",
                            fontWeight: "700",
                            cursor: "pointer",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "6px",
                          }}
                        >
                          📅 View Ledger ({paidCount}/12 Paid)
                        </button>
                      </td>
                      <td style={{ padding: "12px 18px", textAlign: "right" }}>
                        <div style={{ display: "inline-flex", gap: "6px" }}>
                          {st.feeStatus !== "Paid" ? (
                            <>
                              <button
                                onClick={() => openCollectModal(st)}
                                style={{
                                  backgroundColor: "#2563eb",
                                  color: "#ffffff",
                                  border: "none",
                                  padding: "7px 12px",
                                  borderRadius: "8px",
                                  fontSize: "12px",
                                  fontWeight: "700",
                                  cursor: "pointer",
                                }}
                              >
                                💳 Collect Fee
                              </button>
                              <a
                                href={generateWhatsAppLink(st.mobile, getFeeReminderMessage(st))}
                                target="_blank"
                                rel="noreferrer"
                                style={{
                                  textDecoration: "none",
                                  backgroundColor: "#22c55e",
                                  color: "#ffffff",
                                  padding: "7px 10px",
                                  borderRadius: "8px",
                                  fontSize: "12px",
                                  fontWeight: "700",
                                  display: "inline-flex",
                                  alignItems: "center",
                                  gap: "4px",
                                }}
                                title="Send WhatsApp Fee Reminder"
                              >
                                💬 Remind
                              </a>
                            </>
                          ) : (
                            <button
                              onClick={() => {
                                const lastFee = st.feeHistory?.[0] || {
                                  month: "October 2026",
                                  amount: st.monthlyFee,
                                  mode: "Cash / UPI",
                                  date: new Date().toISOString().split("T")[0],
                                };
                                setReceiptData({
                                  receiptNo: `REC-${Math.floor(100000 + Math.random() * 900000)}`,
                                  studentName: st.name,
                                  studentClass: st.class,
                                  studentId: st.id,
                                  amount: lastFee.amount,
                                  month: lastFee.month,
                                  mode: lastFee.mode,
                                  date: lastFee.date,
                                  fatherName: st.fatherName,
                                });
                              }}
                              style={{
                                backgroundColor: "#f8fafc",
                                color: "#0f172a",
                                border: "1px solid #cbd5e1",
                                padding: "7px 14px",
                                borderRadius: "8px",
                                fontSize: "12px",
                                fontWeight: "600",
                                cursor: "pointer",
                              }}
                            >
                              📄 Receipt
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="7" style={{ padding: "32px", textAlign: "center", color: "#94a3b8" }}>
                    No students match the selected class and status filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MONTH-WISE DETAILED FEE LEDGER MODAL */}
      {selectedLedgerStudent && (
        <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(15, 23, 42, 0.7)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 120, padding: "16px" }}>
          <div style={{ backgroundColor: "#ffffff", borderRadius: "18px", width: "100%", maxWidth: "680px", maxHeight: "90vh", overflowY: "auto", boxShadow: "0 20px 40px rgba(0,0,0,0.2)", padding: "24px", boxSizing: "border-box" }}>
            
            {/* Modal Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", borderBottom: "1px solid #e2e8f0", paddingBottom: "14px", marginBottom: "16px" }}>
              <div>
                <h3 style={{ fontSize: "18px", fontWeight: "800", color: "#0f172a", margin: 0 }}>
                  {selectedLedgerStudent.name} — Monthly Fee Ledger
                </h3>
                <p style={{ margin: "4px 0 0", fontSize: "12px", color: "#64748b" }}>
                  Class: <strong>{selectedLedgerStudent.class}</strong> | Monthly Fee: <strong>₹{selectedLedgerStudent.monthlyFee}</strong> | Mobile: <strong>{selectedLedgerStudent.mobile}</strong>
                </p>
              </div>
              <button
                onClick={() => setSelectedLedgerStudent(null)}
                style={{ background: "#f1f5f9", border: "none", borderRadius: "50%", width: "32px", height: "32px", cursor: "pointer", fontWeight: "700", color: "#64748b" }}
              >
                ✕
              </button>
            </div>

            {/* Quick Metrics */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "16px" }}>
              <div style={{ backgroundColor: "#ecfdf5", border: "1px solid #a7f3d0", padding: "12px 16px", borderRadius: "10px" }}>
                <span style={{ fontSize: "11px", fontWeight: "700", color: "#047857", textTransform: "uppercase" }}>Paid Months</span>
                <div style={{ fontSize: "20px", fontWeight: "800", color: "#065f46", marginTop: "2px" }}>
                  {sessionMonths.filter((m) => !!getMonthRecord(selectedLedgerStudent, m)).length} / 12 Months
                </div>
              </div>
              <div style={{ backgroundColor: "#fef2f2", border: "1px solid #fecaca", padding: "12px 16px", borderRadius: "10px" }}>
                <span style={{ fontSize: "11px", fontWeight: "700", color: "#b91c1c", textTransform: "uppercase" }}>Pending Months</span>
                <div style={{ fontSize: "20px", fontWeight: "800", color: "#991b1b", marginTop: "2px" }}>
                  {sessionMonths.filter((m) => !getMonthRecord(selectedLedgerStudent, m)).length} Months
                </div>
              </div>
            </div>

            {/* Months Status Breakdown Table */}
            <div style={{ border: "1px solid #e2e8f0", borderRadius: "12px", overflow: "hidden" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px" }}>
                <thead>
                  <tr style={{ backgroundColor: "#f8fafc", borderBottom: "1px solid #e2e8f0", color: "#64748b", textTransform: "uppercase", fontSize: "11px" }}>
                    <th style={{ padding: "10px 14px", textAlign: "left" }}>Academic Month</th>
                    <th style={{ padding: "10px 14px", textAlign: "left" }}>Status</th>
                    <th style={{ padding: "10px 14px", textAlign: "left" }}>Payment Details</th>
                    <th style={{ padding: "10px 14px", textAlign: "right" }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {sessionMonths.map((m) => {
                    const record = getMonthRecord(selectedLedgerStudent, m);
                    const isPaid = !!record;

                    return (
                      <tr key={m} style={{ borderBottom: "1px solid #f1f5f9" }}>
                        <td style={{ padding: "10px 14px", fontWeight: "700", color: "#0f172a" }}>
                          {m}
                        </td>
                        <td style={{ padding: "10px 14px" }}>
                          <span
                            style={{
                              display: "inline-block",
                              padding: "2px 8px",
                              borderRadius: "9999px",
                              fontSize: "11px",
                              fontWeight: "700",
                              backgroundColor: isPaid ? "#dcfce7" : "#fee2e2",
                              color: isPaid ? "#15803d" : "#b91c1c",
                            }}
                          >
                            {isPaid ? "✓ Paid" : "✕ Pending"}
                          </span>
                        </td>
                        <td style={{ padding: "10px 14px", color: "#64748b" }}>
                          {isPaid ? (
                            <span>₹{record.amount || selectedLedgerStudent.monthlyFee} • {record.mode || "Paid"} ({record.date || "-"})</span>
                          ) : (
                            <span style={{ color: "#94a3b8" }}>Due ₹{selectedLedgerStudent.monthlyFee}</span>
                          )}
                        </td>
                        <td style={{ padding: "10px 14px", textAlign: "right" }}>
                          {!isPaid ? (
                            <button
                              onClick={() => openCollectModal(selectedLedgerStudent, m)}
                              style={{
                                backgroundColor: "#2563eb",
                                color: "#ffffff",
                                border: "none",
                                padding: "5px 10px",
                                borderRadius: "6px",
                                fontSize: "11px",
                                fontWeight: "700",
                                cursor: "pointer",
                              }}
                            >
                              + Pay This Month
                            </button>
                          ) : (
                            <button
                              onClick={() => {
                                setReceiptData({
                                  receiptNo: `REC-${Math.floor(100000 + Math.random() * 900000)}`,
                                  studentName: selectedLedgerStudent.name,
                                  studentClass: selectedLedgerStudent.class,
                                  studentId: selectedLedgerStudent.id,
                                  amount: record.amount || selectedLedgerStudent.monthlyFee,
                                  month: m,
                                  mode: record.mode || "Online",
                                  date: record.date || new Date().toISOString().split("T")[0],
                                  fatherName: selectedLedgerStudent.fatherName,
                                });
                              }}
                              style={{
                                background: "none",
                                border: "1px solid #cbd5e1",
                                padding: "4px 8px",
                                borderRadius: "6px",
                                fontSize: "11px",
                                fontWeight: "600",
                                cursor: "pointer",
                                color: "#475569",
                              }}
                            >
                              Receipt
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "16px" }}>
              <button
                onClick={() => setSelectedLedgerStudent(null)}
                style={{
                  backgroundColor: "#0f172a",
                  color: "#ffffff",
                  border: "none",
                  padding: "8px 18px",
                  borderRadius: "8px",
                  fontSize: "12px",
                  fontWeight: "700",
                  cursor: "pointer",
                }}
              >
                Close Ledger
              </button>
            </div>

          </div>
        </div>
      )}

      {/* COLLECT FEE MODAL */}
      {collectModalOpen && activeStudent && (
        <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(15, 23, 42, 0.6)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 130, padding: "16px" }}>
          <div style={{ backgroundColor: "#ffffff", borderRadius: "16px", padding: "24px", maxWidth: "460px", width: "100%", boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <h3 style={{ fontSize: "18px", fontWeight: "700", color: "#0f172a", margin: 0 }}>
                Collect Monthly Fee
              </h3>
              <button onClick={() => setCollectModalOpen(false)} style={{ background: "none", border: "none", fontSize: "18px", cursor: "pointer", color: "#64748b" }}>
                ✕
              </button>
            </div>

            <div style={{ backgroundColor: "#f8fafc", padding: "12px 14px", borderRadius: "10px", marginBottom: "16px", border: "1px solid #e2e8f0" }}>
              <div style={{ fontWeight: "700", color: "#0f172a" }}>{activeStudent.name}</div>
              <div style={{ fontSize: "12px", color: "#64748b" }}>
                Class: {activeStudent.class} • ID: {activeStudent.id} • Mobile: {activeStudent.mobile}
              </div>
            </div>

            <form onSubmit={handleCollectSubmit} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div>
                <label style={{ fontSize: "12px", fontWeight: "600", color: "#475569", display: "block", marginBottom: "4px" }}>Select Month *</label>
                <select
                  value={feeForm.month}
                  onChange={(e) => setFeeForm({ ...feeForm, month: e.target.value })}
                  style={{ width: "100%", padding: "8px 12px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "13px", backgroundColor: "#fff" }}
                >
                  {sessionMonths.map((m) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ fontSize: "12px", fontWeight: "600", color: "#475569", display: "block", marginBottom: "4px" }}>Fee Amount (₹) *</label>
                <input
                  type="number"
                  required
                  value={feeForm.amount}
                  onChange={(e) => setFeeForm({ ...feeForm, amount: e.target.value })}
                  style={{ width: "100%", padding: "8px 12px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "13px", boxSizing: "border-box" }}
                />
              </div>

              <div>
                <label style={{ fontSize: "12px", fontWeight: "600", color: "#475569", display: "block", marginBottom: "4px" }}>Payment Mode *</label>
                <select
                  value={feeForm.mode}
                  onChange={(e) => setFeeForm({ ...feeForm, mode: e.target.value })}
                  style={{ width: "100%", padding: "8px 12px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "13px", backgroundColor: "#fff" }}
                >
                  <option value="UPI (Google Pay)">UPI (Google Pay)</option>
                  <option value="UPI (PhonePe)">UPI (PhonePe)</option>
                  <option value="UPI (Paytm)">UPI (Paytm)</option>
                  <option value="Cash">Cash</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: "12px", fontWeight: "600", color: "#475569", display: "block", marginBottom: "4px" }}>Payment Date *</label>
                <input
                  type="date"
                  required
                  value={feeForm.date}
                  onChange={(e) => setFeeForm({ ...feeForm, date: e.target.value })}
                  style={{ width: "100%", padding: "8px 12px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "13px", boxSizing: "border-box" }}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "12px" }}>
                <button
                  type="button"
                  onClick={() => setCollectModalOpen(false)}
                  style={{ padding: "8px 16px", borderRadius: "8px", border: "1px solid #cbd5e1", background: "none", fontSize: "13px", cursor: "pointer", color: "#475569" }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ padding: "8px 18px", borderRadius: "8px", border: "none", backgroundColor: "#047857", color: "#fff", fontSize: "13px", fontWeight: "700", cursor: "pointer" }}
                >
                  Confirm & Save Payment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* RECEIPT MODAL */}
      {receiptData && (
        <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(15, 23, 42, 0.65)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 150, padding: "16px" }}>
          <div style={{ backgroundColor: "#ffffff", borderRadius: "16px", padding: "26px", maxWidth: "440px", width: "100%", boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)", border: "1px solid #cbd5e1" }}>
            
            <div style={{ textAlign: "center", borderBottom: "2px dashed #cbd5e1", paddingBottom: "14px", marginBottom: "16px" }}>
              <h3 style={{ fontSize: "18px", fontWeight: "800", color: "#0f172a", margin: 0 }}>NAVEEN ACADEMY</h3>
              <p style={{ fontSize: "12px", color: "#64748b", margin: "2px 0 0" }}>Greater Noida, Uttar Pradesh</p>
              <div style={{ display: "inline-block", backgroundColor: "#ecfdf5", color: "#047857", fontSize: "11px", fontWeight: "700", padding: "3px 10px", borderRadius: "9999px", marginTop: "8px" }}>
                FEE PAYMENT RECEIPT
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: "#64748b", marginBottom: "12px" }}>
              <span>Receipt No: <strong>{receiptData.receiptNo}</strong></span>
              <span>Date: <strong>{receiptData.date}</strong></span>
            </div>

            <div style={{ backgroundColor: "#f8fafc", borderRadius: "10px", padding: "12px", fontSize: "13px", display: "flex", flexDirection: "column", gap: "8px", marginBottom: "16px" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#64748b" }}>Student Name:</span>
                <strong style={{ color: "#0f172a" }}>{receiptData.studentName}</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#64748b" }}>Class & ID:</span>
                <span style={{ color: "#0f172a" }}>{receiptData.studentClass} ({receiptData.studentId})</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#64748b" }}>Parent Name:</span>
                <span style={{ color: "#0f172a" }}>{receiptData.fatherName}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#64748b" }}>Fee Month:</span>
                <span style={{ color: "#0f172a", fontWeight: "600" }}>{receiptData.month}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#64748b" }}>Payment Mode:</span>
                <span style={{ color: "#0f172a" }}>{receiptData.mode}</span>
              </div>
              <div style={{ borderTop: "1px solid #e2e8f0", paddingTop: "8px", display: "flex", justifyContent: "space-between", fontSize: "15px" }}>
                <strong style={{ color: "#0f172a" }}>Total Paid:</strong>
                <strong style={{ color: "#047857" }}>₹{receiptData.amount}</strong>
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", gap: "10px" }}>
              <button
                onClick={() => window.print()}
                style={{ flex: 1, padding: "9px", borderRadius: "8px", border: "1px solid #2563eb", backgroundColor: "#eff6ff", color: "#1d4ed8", fontSize: "13px", fontWeight: "700", cursor: "pointer" }}
              >
                🖨️ Print Receipt
              </button>
              <button
                onClick={() => setReceiptData(null)}
                style={{ flex: 1, padding: "9px", borderRadius: "8px", border: "none", backgroundColor: "#0f172a", color: "#ffffff", fontSize: "13px", fontWeight: "600", cursor: "pointer" }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
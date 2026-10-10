import React, { useState, useEffect } from "react";
import { fetchStudentsAPI, payFeeAPI } from "../../services/api";
import { getFeeReminderMessage, generateWhatsAppLink } from "../../utils/whatsappTemplates";

export default function Fees() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

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

  const monthsList = [
    "January 2026",
    "February 2026",
    "March 2026",
    "April 2026",
    "May 2026",
    "June 2026",
    "July 2026",
    "August 2026",
    "September 2026",
    "October 2026",
    "November 2026",
    "December 2026",
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

  const openCollectModal = (student) => {
    setActiveStudent(student);
    setFeeForm({
      month: "October 2026",
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

  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.id.toLowerCase().includes(search.toLowerCase()) ||
      s.mobile.includes(search);
    const matchesStatus =
      statusFilter === "All" || s.feeStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalCollected = students
    .filter((s) => s.feeStatus === "Paid")
    .reduce((sum, s) => sum + (Number(s.monthlyFee) || 0), 0);

  const totalPending = students
    .filter((s) => s.feeStatus !== "Paid")
    .reduce((sum, s) => sum + (Number(s.monthlyFee) || 0), 0);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "22px", fontFamily: "'Inter', system-ui, sans-serif" }}>
      
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
        <div>
          <h2 style={{ fontSize: "22px", fontWeight: "700", color: "#0f172a", margin: 0 }}>Fees Management</h2>
          <p style={{ fontSize: "13px", color: "#64748b", margin: "4px 0 0 0" }}>Track monthly collections, record fee receipts & send parent WhatsApp reminders</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px" }}>
        <div style={{ backgroundColor: "#ffffff", padding: "18px", borderRadius: "14px", border: "1px solid #e2e8f0" }}>
          <span style={{ fontSize: "11px", fontWeight: "700", color: "#64748b", textTransform: "uppercase" }}>Total Collected</span>
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
            ⚠️ {students.filter((s) => s.feeStatus !== "Paid").length} Students pending
          </span>
        </div>

        <div style={{ backgroundColor: "#ffffff", padding: "18px", borderRadius: "14px", border: "1px solid #e2e8f0" }}>
          <span style={{ fontSize: "11px", fontWeight: "700", color: "#64748b", textTransform: "uppercase" }}>Total Active Students</span>
          <div style={{ fontSize: "24px", fontWeight: "800", color: "#0f172a", marginTop: "6px" }}>
            {students.length}
          </div>
          <span style={{ fontSize: "12px", color: "#64748b", fontWeight: "600" }}>🎓 Naveen Academy Roster</span>
        </div>
      </div>

      {/* Filter and Search */}
      <div style={{ backgroundColor: "#ffffff", padding: "16px", borderRadius: "14px", border: "1px solid #e2e8f0", display: "flex", flexWrap: "wrap", gap: "12px", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ flex: 1, minWidth: "240px" }}>
          <input
            type="text"
            placeholder="Search by student name, roll number, or mobile..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "13px", outline: "none", boxSizing: "border-box" }}
          />
        </div>

        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          <span style={{ fontSize: "12px", fontWeight: "600", color: "#64748b" }}>Status Filter:</span>
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

      {/* Fee Table */}
      <div style={{ backgroundColor: "#ffffff", borderRadius: "14px", border: "1px solid #e2e8f0", overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "13px" }}>
            <thead>
              <tr style={{ backgroundColor: "#f8fafc", color: "#64748b", fontSize: "11px", textTransform: "uppercase", borderBottom: "1px solid #e2e8f0" }}>
                <th style={{ padding: "12px 18px" }}>Student</th>
                <th style={{ padding: "12px 16px" }}>Class</th>
                <th style={{ padding: "12px 16px" }}>Father's Name</th>
                <th style={{ padding: "12px 16px" }}>Phone</th>
                <th style={{ padding: "12px 16px" }}>Monthly Fee</th>
                <th style={{ padding: "12px 16px" }}>Status</th>
                <th style={{ padding: "12px 18px", textAlign: "right" }}>Action</th>
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
                filteredStudents.map((st) => (
                  <tr key={st.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                    <td style={{ padding: "12px 18px" }}>
                      <div style={{ fontWeight: "600", color: "#0f172a" }}>{st.name}</div>
                      <div style={{ fontSize: "11px", color: "#94a3b8" }}>{st.id} • Roll: {st.rollNo}</div>
                    </td>
                    <td style={{ padding: "12px 16px", color: "#0f172a", fontWeight: "600" }}>{st.class}</td>
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
                          fontWeight: "700",
                          backgroundColor: st.feeStatus === "Paid" ? "#ecfdf5" : "#fef3c7",
                          color: st.feeStatus === "Paid" ? "#047857" : "#b45309",
                        }}
                      >
                        {st.feeStatus}
                      </span>
                    </td>
                    <td style={{ padding: "12px 18px", textAlign: "right" }}>
                      {st.feeStatus !== "Paid" ? (
                        <div style={{ display: "inline-flex", gap: "6px" }}>
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
                        </div>
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
                          📄 View Receipt
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" style={{ padding: "32px", textAlign: "center", color: "#94a3b8" }}>
                    No fee records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* COLLECT FEE MODAL */}
      {collectModalOpen && activeStudent && (
        <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(15, 23, 42, 0.6)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, padding: "16px" }}>
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
                {activeStudent.class} • ID: {activeStudent.id} • Mobile: {activeStudent.mobile}
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
                  {monthsList.map((m) => (
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
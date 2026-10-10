import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchStudentsAPI } from "../../services/api";

export default function AdminDashboard() {
  const navigate = useNavigate();

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Real data MongoDB Atlas se fetch karna
  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        const res = await fetchStudentsAPI();
        if (res && res.success && Array.isArray(res.data)) {
          setStudents(res.data);
        }
      } catch (err) {
        console.error("Failed to load dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  // Real-time calculations
  const totalStudents = students.length;

  const paidStudents = students.filter((s) => {
    const hasOctPaid = s.feeHistory?.some(
      (f) => (f.month?.toLowerCase().includes("oct") || f.status === "Paid") && f.status === "Paid"
    );
    return s.feeStatus === "Paid" || hasOctPaid;
  });

  const unpaidStudents = students.filter((s) => !paidStudents.includes(s));

  const monthlyRevenue = paidStudents.reduce(
    (sum, s) => sum + (Number(s.monthlyFee) || 0),
    0
  );

  const pendingDues = unpaidStudents.reduce(
    (sum, s) => sum + (Number(s.monthlyFee) || 0),
    0
  );

  // Recent fee transactions list
  const recentTransactions = [];
  students.forEach((s) => {
    if (s.feeHistory && s.feeHistory.length > 0) {
      s.feeHistory.forEach((f) => {
        if (f.status === "Paid") {
          recentTransactions.push({
            studentName: s.name,
            month: f.month || "October 2026",
            mode: f.mode || "Cash / UPI",
            date: f.date || "-",
            amount: f.amount || s.monthlyFee || 0,
          });
        }
      });
    }
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px", fontFamily: "'Inter', system-ui, sans-serif" }}>
      
      {/* Main Banner */}
      <div
        style={{
          background: "linear-gradient(135deg, #2563eb 0%, #4f46e5 100%)",
          borderRadius: "20px",
          padding: "32px",
          color: "#ffffff",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "20px",
          boxShadow: "0 10px 25px -5px rgba(37, 99, 235, 0.3)",
        }}
      >
        <div style={{ maxWidth: "620px" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              backgroundColor: "rgba(255, 255, 255, 0.18)",
              padding: "4px 12px",
              borderRadius: "9999px",
              fontSize: "12px",
              fontWeight: "600",
              marginBottom: "12px",
              backdropFilter: "blur(4px)",
            }}
          >
            <span>✨ Session 2026–2027 Active</span>
          </div>
          <h2 style={{ fontSize: "28px", fontWeight: "800", margin: "0 0 8px 0" }}>
            Welcome back, Director! 👋
          </h2>
          <p style={{ margin: 0, fontSize: "14px", color: "#e0e7ff", lineHeight: "1.5" }}>
            Naveen Academy Management Portal — Class 3 to 10 batches are running. Here is your operational summary today.
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "10px", minWidth: "160px" }}>
          <button
            onClick={() => navigate("/admin/students")}
            style={{
              backgroundColor: "#ffffff",
              color: "#2563eb",
              border: "none",
              padding: "11px 18px",
              borderRadius: "12px",
              fontSize: "13px",
              fontWeight: "700",
              cursor: "pointer",
              boxShadow: "0 4px 6px rgba(0,0,0,0.08)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "6px",
            }}
          >
            + Enroll Student
          </button>
          <button
            onClick={() => navigate("/admin/fees")}
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.15)",
              color: "#ffffff",
              border: "1px solid rgba(255, 255, 255, 0.3)",
              padding: "11px 18px",
              borderRadius: "12px",
              fontSize: "13px",
              fontWeight: "700",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "6px",
              backdropFilter: "blur(4px)",
            }}
          >
            💳 Collect Fee
          </button>
        </div>
      </div>

      {/* Real-Time Metrics Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: "18px",
        }}
      >
        {/* Card 1: Enrolled Students */}
        <div
          style={{
            backgroundColor: "#ffffff",
            padding: "22px",
            borderRadius: "16px",
            border: "1px solid #e2e8f0",
            boxShadow: "0 2px 4px rgba(0,0,0,0.02)",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <span style={{ fontSize: "11px", fontWeight: "700", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Enrolled Students
            </span>
            <span style={{ fontSize: "20px" }}>🎓</span>
          </div>
          <div style={{ fontSize: "32px", fontWeight: "800", color: "#0f172a", marginTop: "12px" }}>
            {loading ? "..." : totalStudents}
          </div>
          <div style={{ fontSize: "12px", color: "#10b981", fontWeight: "600", marginTop: "8px", display: "flex", alignItems: "center", gap: "4px" }}>
            <span>↑ Live synced from MongoDB</span>
          </div>
        </div>

        {/* Card 2: Monthly Revenue */}
        <div
          style={{
            backgroundColor: "#ffffff",
            padding: "22px",
            borderRadius: "16px",
            border: "1px solid #e2e8f0",
            boxShadow: "0 2px 4px rgba(0,0,0,0.02)",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <span style={{ fontSize: "11px", fontWeight: "700", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Monthly Revenue
            </span>
            <span style={{ fontSize: "20px" }}>💰</span>
          </div>
          <div style={{ fontSize: "32px", fontWeight: "800", color: "#0f172a", marginTop: "12px" }}>
            {loading ? "..." : `₹${monthlyRevenue.toLocaleString("en-IN")}`}
          </div>
          <div style={{ fontSize: "12px", color: "#047857", fontWeight: "600", marginTop: "8px", display: "flex", alignItems: "center", gap: "4px" }}>
            <span>• Total fees collected</span>
          </div>
        </div>

        {/* Card 3: Pending Dues */}
        <div
          style={{
            backgroundColor: "#ffffff",
            padding: "22px",
            borderRadius: "16px",
            border: "1px solid #e2e8f0",
            boxShadow: "0 2px 4px rgba(0,0,0,0.02)",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <span style={{ fontSize: "11px", fontWeight: "700", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Pending Dues
            </span>
            <span style={{ fontSize: "20px" }}>⏳</span>
          </div>
          <div style={{ fontSize: "32px", fontWeight: "800", color: pendingDues > 0 ? "#d97706" : "#0f172a", marginTop: "12px" }}>
            {loading ? "..." : `₹${pendingDues.toLocaleString("en-IN")}`}
          </div>
          <div style={{ fontSize: "12px", color: unpaidStudents.length > 0 ? "#b45309" : "#64748b", fontWeight: "600", marginTop: "8px", display: "flex", alignItems: "center", gap: "4px" }}>
            <span>{unpaidStudents.length > 0 ? `⚠️ ${unpaidStudents.length} Students unpaid fees` : "✓ All fees cleared"}</span>
          </div>
        </div>

        {/* Card 4: Study Material */}
        <div
          style={{
            backgroundColor: "#ffffff",
            padding: "22px",
            borderRadius: "16px",
            border: "1px solid #e2e8f0",
            boxShadow: "0 2px 4px rgba(0,0,0,0.02)",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <span style={{ fontSize: "11px", fontWeight: "700", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Study Material
            </span>
            <span style={{ fontSize: "20px" }}>📚</span>
          </div>
          <div style={{ fontSize: "32px", fontWeight: "800", color: "#0f172a", marginTop: "12px" }}>
            24
          </div>
          <div style={{ fontSize: "12px", color: "#64748b", fontWeight: "600", marginTop: "8px", display: "flex", alignItems: "center", gap: "4px" }}>
            <span>📁 PDF & Notes Class 3–10</span>
          </div>
        </div>
      </div>

      {/* Bottom Section: Real Live Lists */}
      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "20px" }}>
        
        {/* Real Enrolled Students */}
        <div style={{ backgroundColor: "#ffffff", padding: "20px", borderRadius: "16px", border: "1px solid #e2e8f0" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <div>
              <h3 style={{ fontSize: "15px", fontWeight: "700", color: "#0f172a", margin: 0 }}>Recent Enrolled Students</h3>
              <p style={{ fontSize: "12px", color: "#64748b", margin: "2px 0 0" }}>Active batch admissions</p>
            </div>
            <button
              onClick={() => navigate("/admin/students")}
              style={{ background: "none", border: "none", color: "#2563eb", fontSize: "12px", fontWeight: "700", cursor: "pointer" }}
            >
              View All Students →
            </button>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {students.length > 0 ? (
              students.slice(0, 5).map((st) => (
                <div key={st._id || st.studentId} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 12px", backgroundColor: "#f8fafc", borderRadius: "10px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <div style={{ width: "34px", height: "34px", borderRadius: "8px", backgroundColor: "#2563eb", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "700", fontSize: "12px" }}>
                      {st.name?.charAt(0)}
                    </div>
                    <div>
                      <div style={{ fontSize: "13px", fontWeight: "600", color: "#0f172a" }}>{st.name}</div>
                      <div style={{ fontSize: "11px", color: "#64748b" }}>{st.studentClass} • {st.mobile}</div>
                    </div>
                  </div>
                  <span
                    style={{
                      padding: "3px 8px",
                      borderRadius: "9999px",
                      fontSize: "11px",
                      fontWeight: "700",
                      backgroundColor: st.feeStatus === "Paid" ? "#ecfdf5" : "#fef3c7",
                      color: st.feeStatus === "Paid" ? "#047857" : "#b45309",
                    }}
                  >
                    {st.feeStatus || "Pending"}
                  </span>
                </div>
              ))
            ) : (
              <div style={{ textAlign: "center", padding: "20px", color: "#94a3b8", fontSize: "13px" }}>
                No students enrolled yet.
              </div>
            )}
          </div>
        </div>

        {/* Real Live Fee Transactions */}
        <div style={{ backgroundColor: "#ffffff", padding: "20px", borderRadius: "16px", border: "1px solid #e2e8f0" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <div>
              <h3 style={{ fontSize: "15px", fontWeight: "700", color: "#0f172a", margin: 0 }}>Fee Collections</h3>
              <p style={{ fontSize: "12px", color: "#64748b", margin: "2px 0 0" }}>Real-time receipt stream</p>
            </div>
            <button
              onClick={() => navigate("/admin/fees")}
              style={{ background: "none", border: "none", color: "#2563eb", fontSize: "12px", fontWeight: "700", cursor: "pointer" }}
            >
              Full Ledger →
            </button>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {recentTransactions.length > 0 ? (
              recentTransactions.slice(0, 5).map((tx, idx) => (
                <div key={tx.studentName + idx} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 12px", backgroundColor: "#f8fafc", borderRadius: "10px" }}>
                  <div>
                    <div style={{ fontSize: "13px", fontWeight: "600", color: "#0f172a" }}>{tx.studentName}</div>
                    <div style={{ fontSize: "11px", color: "#64748b" }}>{tx.month} • {tx.mode}</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: "14px", fontWeight: "800", color: "#047857" }}>₹{tx.amount}</div>
                    <span style={{ fontSize: "10px", color: "#10b981", fontWeight: "700" }}>Success</span>
                  </div>
                </div>
              ))
            ) : (
              <div style={{ textAlign: "center", padding: "20px", color: "#94a3b8", fontSize: "13px" }}>
                No completed payments yet.
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
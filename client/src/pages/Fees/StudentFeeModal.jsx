import React from "react";

const ACADEMIC_MONTHS = [
  "April 2026", "May 2026", "June 2026", "July 2026", 
  "August 2026", "September 2026", "October 2026", "November 2026", 
  "December 2026", "January 2027", "February 2027", "March 2027"
];

export default function StudentFeeModal({ student, onClose, onPayFee }) {
  if (!student) return null;

  // Check karna kaunse months paid hain student.feeHistory se
  const getMonthStatus = (monthName) => {
    const record = student.feeHistory?.find(
      (f) => f.month?.toLowerCase().trim() === monthName.toLowerCase().trim() && f.status === "Paid"
    );
    return record || null;
  };

  const totalPaidMonths = ACADEMIC_MONTHS.filter((m) => getMonthStatus(m)).length;
  const totalPendingMonths = ACADEMIC_MONTHS.length - totalPaidMonths;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(15, 23, 42, 0.65)",
        backdropFilter: "blur(4px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 999,
        padding: "16px",
      }}
    >
      <div
        style={{
          backgroundColor: "#ffffff",
          borderRadius: "20px",
          width: "100%",
          maxWidth: "700px",
          maxHeight: "90vh",
          overflowY: "auto",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
          padding: "28px",
          boxSizing: "border-box",
        }}
      >
        {/* Modal Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px" }}>
          <div>
            <h2 style={{ fontSize: "20px", fontWeight: "800", color: "#0f172a", margin: 0 }}>
              {student.name} — Monthly Fee Ledger
            </h2>
            <p style={{ margin: "4px 0 0", fontSize: "13px", color: "#64748b" }}>
              Class: <strong>{student.studentClass}</strong> | Monthly Fee: <strong>₹{student.monthlyFee || 0}</strong>
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "#f1f5f9",
              border: "none",
              borderRadius: "50%",
              width: "32px",
              height: "32px",
              cursor: "pointer",
              fontWeight: "700",
              color: "#64748b",
            }}
          >
            ✕
          </button>
        </div>

        {/* Quick Summary Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "20px" }}>
          <div style={{ backgroundColor: "#ecfdf5", padding: "14px", borderRadius: "12px", border: "1px solid #a7f3d0" }}>
            <span style={{ fontSize: "12px", color: "#047857", fontWeight: "700" }}>PAID MONTHS</span>
            <div style={{ fontSize: "22px", fontWeight: "800", color: "#065f46", marginTop: "4px" }}>
              {totalPaidMonths} / 12 Months
            </div>
          </div>
          <div style={{ backgroundColor: "#fef2f2", padding: "14px", borderRadius: "12px", border: "1px solid #fecaca" }}>
            <span style={{ fontSize: "12px", color: "#b91c1c", fontWeight: "700" }}>PENDING MONTHS</span>
            <div style={{ fontSize: "22px", fontWeight: "800", color: "#991b1b", marginTop: "4px" }}>
              {totalPendingMonths} Months
            </div>
          </div>
        </div>

        {/* 12 Months Status Table */}
        <div style={{ border: "1px solid #e2e8f0", borderRadius: "12px", overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "13px" }}>
            <thead>
              <tr style={{ backgroundColor: "#f8fafc", borderBottom: "1px solid #e2e8f0", color: "#475569" }}>
                <th style={{ padding: "12px 16px" }}>Month</th>
                <th style={{ padding: "12px 16px" }}>Status</th>
                <th style={{ padding: "12px 16px" }}>Paid Date & Mode</th>
                <th style={{ padding: "12px 16px", textAlign: "right" }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {ACADEMIC_MONTHS.map((month) => {
                const paidData = getMonthStatus(month);
                const isPaid = !!paidData;

                return (
                  <tr key={month} style={{ borderBottom: "1px solid #f1f5f9" }}>
                    <td style={{ padding: "12px 16px", fontWeight: "600", color: "#0f172a" }}>
                      {month}
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <span
                        style={{
                          display: "inline-block",
                          padding: "3px 10px",
                          borderRadius: "9999px",
                          fontSize: "11px",
                          fontWeight: "700",
                          backgroundColor: isPaid ? "#dcfce7" : "#fee2e2",
                          color: isPaid ? "#15803d" : "#b91c1c",
                        }}
                      >
                        {isPaid ? "✓ Paid" : "✕ Unpaid"}
                      </span>
                    </td>
                    <td style={{ padding: "12px 16px", color: "#64748b", fontSize: "12px" }}>
                      {isPaid ? `${paidData.date || "Completed"} (${paidData.mode || "Cash"})` : "—"}
                    </td>
                    <td style={{ padding: "12px 16px", textAlign: "right" }}>
                      {!isPaid && (
                        <button
                          onClick={() => onPayFee(student, month)}
                          style={{
                            backgroundColor: "#2563eb",
                            color: "#ffffff",
                            border: "none",
                            padding: "6px 12px",
                            borderRadius: "6px",
                            fontSize: "11px",
                            fontWeight: "700",
                            cursor: "pointer",
                          }}
                        >
                          Collect Fee
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}
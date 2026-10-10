import React, { useState, useEffect } from "react";
import { fetchNoticesAPI, createNoticeAPI, deleteNoticeAPI } from "../../services/api";
import { getNoticeBroadcastMessage } from "../../utils/whatsappTemplates";

export default function Notices() {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [filterClass, setFilterClass] = useState("All");

  const [formData, setFormData] = useState({
    title: "",
    targetClass: "All Classes",
    category: "General",
    priority: "Normal",
    message: "",
    date: new Date().toISOString().split("T")[0],
  });

  const loadNotices = async () => {
    try {
      setLoading(true);
      const res = await fetchNoticesAPI();
      if (res && res.success && Array.isArray(res.data)) {
        setNotices(res.data);
      }
    } catch (err) {
      console.error("Failed to load notices:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotices();
  }, []);

  const handleCreateNotice = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.message) return;

    try {
      const res = await createNoticeAPI(formData);
      if (res && res.success) {
        alert("✅ Notice published successfully!");
        setShowAddModal(false);
        setFormData({
          title: "",
          targetClass: "All Classes",
          category: "General",
          priority: "Normal",
          message: "",
          date: new Date().toISOString().split("T")[0],
        });
        loadNotices();
      } else {
        alert("❌ Failed to publish notice: " + (res?.message || ""));
      }
    } catch (err) {
      console.error(err);
      alert("❌ Server connection error.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this notice?")) return;
    try {
      const res = await deleteNoticeAPI(id);
      if (res && res.success) {
        alert("✅ Notice removed successfully.");
        loadNotices();
      }
    } catch (err) {
      console.error(err);
      alert("❌ Error deleting notice.");
    }
  };

  const filteredNotices = notices.filter(
    (n) => filterClass === "All" || n.targetClass === filterClass || n.targetClass === "All Classes"
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "22px", fontFamily: "'Inter', system-ui, sans-serif" }}>
      
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
        <div>
          <h2 style={{ fontSize: "22px", fontWeight: "700", color: "#0f172a", margin: 0 }}>Notices & Announcements</h2>
          <p style={{ fontSize: "13px", color: "#64748b", margin: "4px 0 0 0" }}>Broadcast test dates, batch updates, holidays & fee alerts to students</p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          style={{
            backgroundColor: "#2563eb",
            color: "#ffffff",
            padding: "10px 18px",
            borderRadius: "10px",
            fontSize: "13px",
            fontWeight: "700",
            border: "none",
            cursor: "pointer",
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            boxShadow: "0 2px 4px rgba(37,99,235,0.2)"
          }}
        >
          <span>📢 + Publish Notice</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div style={{ backgroundColor: "#ffffff", padding: "14px 18px", borderRadius: "14px", border: "1px solid #e2e8f0", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{ fontSize: "12px", fontWeight: "700", color: "#64748b" }}>Filter by Batch / Class:</span>
          <select
            value={filterClass}
            onChange={(e) => setFilterClass(e.target.value)}
            style={{ padding: "8px 12px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "13px", outline: "none", backgroundColor: "#fff" }}
          >
            <option value="All">All Notices</option>
            <option value="All Classes">All Classes</option>
            {["Class 10", "Class 9", "Class 8", "Class 7", "Class 6", "Class 5", "Class 4", "Class 3"].map((cls) => (
              <option key={cls} value={cls}>{cls}</option>
            ))}
          </select>
        </div>

        <div style={{ fontSize: "12px", color: "#64748b", fontWeight: "600" }}>
          Total Announcements: <strong>{filteredNotices.length}</strong>
        </div>
      </div>

      {/* Notices List */}
      <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
        {loading ? (
          <div style={{ backgroundColor: "#ffffff", padding: "32px", borderRadius: "14px", border: "1px solid #e2e8f0", textAlign: "center", color: "#64748b" }}>
            🔄 Connecting to MongoDB and fetching announcements...
          </div>
        ) : filteredNotices.length > 0 ? (
          filteredNotices.map((n) => {
            const isUrgent = n.priority === "Urgent";
            const isImportant = n.priority === "Important";

            return (
              <div
                key={n._id}
                style={{
                  backgroundColor: "#ffffff",
                  borderRadius: "14px",
                  border: isUrgent ? "1px solid #fca5a5" : "1px solid #e2e8f0",
                  padding: "20px",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.02)",
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                  position: "relative"
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "8px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
                    <span
                      style={{
                        padding: "3px 10px",
                        borderRadius: "9999px",
                        fontSize: "11px",
                        fontWeight: "700",
                        backgroundColor: isUrgent ? "#fee2e2" : isImportant ? "#fef3c7" : "#eff6ff",
                        color: isUrgent ? "#b91c1c" : isImportant ? "#b45309" : "#1d4ed8",
                      }}
                    >
                      {n.priority}
                    </span>
                    <span style={{ fontSize: "12px", color: "#2563eb", fontWeight: "700", backgroundColor: "#f1f5f9", padding: "3px 10px", borderRadius: "6px" }}>
                      🎯 {n.targetClass}
                    </span>
                    <span style={{ fontSize: "12px", color: "#64748b", fontWeight: "600" }}>
                      📁 {n.category}
                    </span>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <span style={{ fontSize: "12px", color: "#94a3b8" }}>📅 {n.date}</span>
                    <button
                      onClick={() => handleDelete(n._id)}
                      style={{ background: "none", border: "none", color: "#ef4444", fontSize: "12px", fontWeight: "700", cursor: "pointer" }}
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>

                <h3 style={{ fontSize: "16px", fontWeight: "800", color: "#0f172a", margin: 0 }}>
                  {n.title}
                </h3>

                <p style={{ fontSize: "13px", color: "#334155", lineHeight: "1.6", margin: 0, whiteSpace: "pre-wrap" }}>
                  {n.message}
                </p>

                {/* Direct Share on WhatsApp */}
                <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "4px" }}>
                  <a
                    href={`https://api.whatsapp.com/send?text=${getNoticeBroadcastMessage(n)}`}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      textDecoration: "none",
                      backgroundColor: "#22c55e",
                      color: "#ffffff",
                      fontSize: "12px",
                      fontWeight: "700",
                      padding: "6px 14px",
                      borderRadius: "8px",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                      boxShadow: "0 2px 4px rgba(34,197,94,0.2)",
                    }}
                  >
                    💬 Broadcast to Parents (WhatsApp)
                  </a>
                </div>
              </div>
            );
          })
        ) : (
          <div style={{ backgroundColor: "#ffffff", padding: "40px", borderRadius: "14px", border: "1px solid #e2e8f0", textAlign: "center", color: "#94a3b8" }}>
            No notices published yet. Click <strong>+ Publish Notice</strong> to send an announcement!
          </div>
        )}
      </div>

      {/* CREATE NOTICE MODAL */}
      {showAddModal && (
        <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(15, 23, 42, 0.6)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, padding: "16px" }}>
          <div style={{ backgroundColor: "#ffffff", borderRadius: "16px", padding: "24px", maxWidth: "520px", width: "100%", maxHeight: "90vh", overflowY: "auto", boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <h3 style={{ fontSize: "18px", fontWeight: "700", color: "#0f172a", margin: 0 }}>Publish New Announcement</h3>
              <button onClick={() => setShowAddModal(false)} style={{ background: "none", border: "none", fontSize: "18px", cursor: "pointer", color: "#64748b" }}>✕</button>
            </div>

            <form onSubmit={handleCreateNotice} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div>
                <label style={{ fontSize: "12px", fontWeight: "600", color: "#475569", display: "block", marginBottom: "4px" }}>Notice Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Science Weekly Test on Sunday / Diwali Vacation"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  style={{ width: "100%", padding: "8px 12px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "13px", boxSizing: "border-box" }}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div>
                  <label style={{ fontSize: "12px", fontWeight: "600", color: "#475569", display: "block", marginBottom: "4px" }}>Target Audience *</label>
                  <select
                    value={formData.targetClass}
                    onChange={(e) => setFormData({ ...formData, targetClass: e.target.value })}
                    style={{ width: "100%", padding: "8px 12px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "13px", backgroundColor: "#fff" }}
                  >
                    <option value="All Classes">All Classes (Whole Academy)</option>
                    {["Class 10", "Class 9", "Class 8", "Class 7", "Class 6", "Class 5", "Class 4", "Class 3"].map((cls) => (
                      <option key={cls} value={cls}>{cls}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: "12px", fontWeight: "600", color: "#475569", display: "block", marginBottom: "4px" }}>Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    style={{ width: "100%", padding: "8px 12px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "13px", backgroundColor: "#fff" }}
                  >
                    <option value="General">General Notice</option>
                    <option value="Exam / Test">Exam / Weekly Test</option>
                    <option value="Holiday">Holiday / Vacation</option>
                    <option value="Batch Timing">Batch Timing Update</option>
                    <option value="Fee Alert">Monthly Fee Reminder</option>
                  </select>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div>
                  <label style={{ fontSize: "12px", fontWeight: "600", color: "#475569", display: "block", marginBottom: "4px" }}>Priority</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    style={{ width: "100%", padding: "8px 12px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "13px", backgroundColor: "#fff" }}
                  >
                    <option value="Normal">Normal</option>
                    <option value="Important">Important</option>
                    <option value="Urgent">Urgent</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: "12px", fontWeight: "600", color: "#475569", display: "block", marginBottom: "4px" }}>Date</label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    style={{ width: "100%", padding: "8px 12px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "13px", boxSizing: "border-box" }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: "12px", fontWeight: "600", color: "#475569", display: "block", marginBottom: "4px" }}>Notice Details / Message *</label>
                <textarea
                  rows="4"
                  required
                  placeholder="Type complete details for parents and students..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "13px", outline: "none", boxSizing: "border-box", fontFamily: "inherit" }}
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
                  style={{ padding: "8px 18px", borderRadius: "8px", border: "none", backgroundColor: "#2563eb", color: "#fff", fontSize: "13px", fontWeight: "700", cursor: "pointer" }}
                >
                  Publish Notice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
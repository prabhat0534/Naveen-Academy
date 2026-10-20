import React, { useState, useEffect } from "react";
import { fetchNotesAPI, createNoteAPI, deleteNoteAPI } from "../../services/api";

const CLASS_OPTIONS = [
  "Class 3", "Class 4", "Class 5", "Class 6",
  "Class 7", "Class 8", "Class 9", "Class 10"
];

const SUBJECT_OPTIONS = [
  "Mathematics", "Science", "English", "Social Science",
  "Hindi", "Sanskrit", "Computer", "General"
];

export default function Notes() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedClass, setSelectedClass] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    subject: "Mathematics",
    studentClass: "Class 9",
    fileUrl: "",
    fileSize: "1.5 MB",
    fileType: "PDF",
  });

  // Load real notes from MongoDB
  const loadNotes = async () => {
    try {
      setLoading(true);
      const res = await fetchNotesAPI(selectedClass === "All" ? "" : selectedClass);
      if (res && res.success && Array.isArray(res.data)) {
        setNotes(res.data);
      } else {
        setNotes([]);
      }
    } catch (err) {
      console.error("Failed to load notes:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotes();
  }, [selectedClass]);

  // Handle Note Upload
  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.fileUrl) {
      alert("Please enter title and valid file/drive link");
      return;
    }

    try {
      setSubmitting(true);
      const res = await createNoteAPI(formData);
      if (res && res.success) {
        setIsModalOpen(false);
        setFormData({
          title: "",
          subject: "Mathematics",
          studentClass: "Class 9",
          fileUrl: "",
          fileSize: "1.5 MB",
          fileType: "PDF",
        });
        loadNotes();
      } else {
        alert(res.message || "Failed to upload note");
      }
    } catch (err) {
      console.error(err);
      alert("Error saving note to database");
    } finally {
      setSubmitting(false);
    }
  };

  // Handle Note Deletion
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this study material?")) return;
    try {
      const res = await deleteNoteAPI(id);
      if (res && res.success) {
        setNotes((prev) => prev.filter((item) => item._id !== id));
      } else {
        alert("Delete failed");
      }
    } catch (err) {
      console.error(err);
    }
  };

  // WhatsApp Share Trigger
  const handleWhatsAppShare = (note) => {
    const text = 
`📚 *Naveen Academy - Study Material*
━━━━━━━━━━━━━━━━━
📌 *Topic:* ${note.title}
📖 *Subject:* ${note.subject} (${note.studentClass})
📁 *File Type:* ${note.fileType || "PDF"} (${note.fileSize || "Study Note"})

📥 *Download / View Link:*
${note.fileUrl}

━━━━━━━━━━━━━━━━━
_Naveen Academy • Learn | Grow | Succeed_`;

    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, "_blank");
  };

  // Filter Search
  const filteredNotes = notes.filter((n) => {
    const q = searchQuery.toLowerCase();
    const matchTitle = n.title?.toLowerCase().includes(q);
    const matchSubject = n.subject?.toLowerCase().includes(q);
    return matchTitle || matchSubject;
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px", fontFamily: "'Inter', system-ui, sans-serif" }}>
      
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
        <div>
          <h1 style={{ fontSize: "22px", fontWeight: "800", color: "#0f172a", margin: 0 }}>
            Notes & Study Material
          </h1>
          <p style={{ margin: "4px 0 0", fontSize: "13px", color: "#64748b" }}>
            Upload PDFs, chapter notes, and question banks for student batches
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          style={{
            backgroundColor: "#2563eb",
            color: "#ffffff",
            border: "none",
            borderRadius: "10px",
            padding: "10px 18px",
            fontSize: "13px",
            fontWeight: "700",
            cursor: "pointer",
            boxShadow: "0 4px 10px rgba(37,99,235,0.25)",
            display: "flex",
            alignItems: "center",
            gap: "6px",
          }}
        >
          + Upload Study Material
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", backgroundColor: "#ffffff", padding: "16px", borderRadius: "14px", border: "1px solid #e2e8f0" }}>
        <input
          type="text"
          placeholder="Search by topic, chapter or subject..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            flex: 1,
            minWidth: "240px",
            padding: "10px 14px",
            borderRadius: "8px",
            border: "1px solid #cbd5e1",
            fontSize: "13px",
            outline: "none",
          }}
        />

        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ fontSize: "13px", fontWeight: "600", color: "#64748b" }}>Filter Class:</span>
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            style={{
              padding: "10px 14px",
              borderRadius: "8px",
              border: "1px solid #cbd5e1",
              fontSize: "13px",
              fontWeight: "600",
              color: "#0f172a",
              outline: "none",
              backgroundColor: "#f8fafc",
            }}
          >
            <option value="All">All Classes (3 to 10)</option>
            {CLASS_OPTIONS.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Cards Grid */}
      {loading ? (
        <div style={{ textAlign: "center", padding: "40px", color: "#64748b" }}>Loading notes from database...</div>
      ) : filteredNotes.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 20px", backgroundColor: "#ffffff", borderRadius: "14px", border: "1px dashed #cbd5e1" }}>
          <p style={{ margin: 0, fontSize: "15px", fontWeight: "600", color: "#64748b" }}>No study materials found</p>
          <p style={{ margin: "4px 0 0", fontSize: "12px", color: "#94a3b8" }}>Click "+ Upload Study Material" above to add the first PDF note.</p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "18px" }}>
          {filteredNotes.map((note) => (
            <div
              key={note._id}
              style={{
                backgroundColor: "#ffffff",
                borderRadius: "14px",
                border: "1px solid #e2e8f0",
                padding: "20px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                gap: "16px",
                boxShadow: "0 2px 4px rgba(0,0,0,0.02)",
              }}
            >
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                  <span style={{ fontSize: "11px", fontWeight: "700", color: "#2563eb", backgroundColor: "#eff6ff", padding: "3px 8px", borderRadius: "6px" }}>
                    {note.studentClass}
                  </span>
                  <span style={{ fontSize: "11px", fontWeight: "600", color: "#64748b" }}>
                    {note.subject}
                  </span>
                </div>
                <h3 style={{ fontSize: "15px", fontWeight: "700", color: "#0f172a", margin: "0 0 6px 0", lineHeight: "1.4" }}>
                  {note.title}
                </h3>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", fontSize: "11px", color: "#64748b" }}>
                  <span>📁 {note.fileType || "PDF"} • {note.fileSize || "1.2 MB"}</span>
                  <span>🗓️ {new Date(note.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: "flex", gap: "8px", borderTop: "1px solid #f1f5f9", paddingTop: "14px" }}>
                <a
                  href={note.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    flex: 1,
                    textAlign: "center",
                    textDecoration: "none",
                    backgroundColor: "#f8fafc",
                    color: "#2563eb",
                    border: "1px solid #bfdbfe",
                    padding: "7px 10px",
                    borderRadius: "8px",
                    fontSize: "12px",
                    fontWeight: "700",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "4px",
                  }}
                >
                  📥 View / Download
                </a>
                <button
                  type="button"
                  onClick={() => handleWhatsAppShare(note)}
                  title="Share to WhatsApp"
                  style={{
                    backgroundColor: "#25d366",
                    color: "#ffffff",
                    border: "none",
                    borderRadius: "8px",
                    padding: "7px 12px",
                    fontSize: "12px",
                    fontWeight: "700",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                  }}
                >
                  💬 Share
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(note._id)}
                  style={{
                    backgroundColor: "#ffffff",
                    color: "#ef4444",
                    border: "1px solid #fecaca",
                    borderRadius: "8px",
                    padding: "7px 10px",
                    fontSize: "12px",
                    fontWeight: "600",
                    cursor: "pointer",
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload Study Material Modal */}
      {isModalOpen && (
        <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: "16px" }}>
          <div style={{ backgroundColor: "#ffffff", width: "100%", maxWidth: "480px", borderRadius: "16px", padding: "24px", boxShadow: "0 20px 25px -5px rgba(0,0,0,0.2)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <h3 style={{ margin: 0, fontSize: "16px", fontWeight: "800", color: "#0f172a" }}>Upload Study Material</h3>
              <button onClick={() => setIsModalOpen(false)} style={{ background: "none", border: "none", fontSize: "18px", cursor: "pointer", color: "#64748b" }}>✕</button>
            </div>

            <form onSubmit={handleUploadSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: "700", color: "#334155", marginBottom: "4px" }}>Topic / Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Force & Laws of Motion Chapter Summary"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  style={{ width: "100%", boxSizing: "border-box", padding: "9px 12px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "13px" }}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: "700", color: "#334155", marginBottom: "4px" }}>Class</label>
                  <select
                    value={formData.studentClass}
                    onChange={(e) => setFormData({ ...formData, studentClass: e.target.value })}
                    style={{ width: "100%", boxSizing: "border-box", padding: "9px 12px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "13px" }}
                  >
                    {CLASS_OPTIONS.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: "700", color: "#334155", marginBottom: "4px" }}>Subject</label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    style={{ width: "100%", boxSizing: "border-box", padding: "9px 12px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "13px" }}
                  >
                    {SUBJECT_OPTIONS.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: "700", color: "#334155", marginBottom: "4px" }}>PDF / Drive Public Link *</label>
                <input
                  type="url"
                  required
                  placeholder="https://drive.google.com/... or Cloudinary URL"
                  value={formData.fileUrl}
                  onChange={(e) => setFormData({ ...formData, fileUrl: e.target.value })}
                  style={{ width: "100%", boxSizing: "border-box", padding: "9px 12px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "13px" }}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "10px" }}>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  style={{ backgroundColor: "#f1f5f9", color: "#475569", border: "none", padding: "9px 16px", borderRadius: "8px", fontSize: "13px", fontWeight: "600", cursor: "pointer" }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  style={{ backgroundColor: "#2563eb", color: "#ffffff", border: "none", padding: "9px 16px", borderRadius: "8px", fontSize: "13px", fontWeight: "700", cursor: "pointer" }}
                >
                  {submitting ? "Uploading..." : "Save Note"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
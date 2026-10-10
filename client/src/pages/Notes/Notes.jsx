import { useState } from "react";

export default function Notes() {
  const [search, setSearch] = useState("");
  const [selectedClass, setSelectedClass] = useState("All");
  const [showUploadModal, setShowUploadModal] = useState(false);

  // Mock Study Materials
  const [notesList, setNotesList] = useState([
    {
      id: "DOC-101",
      title: "Real Numbers & Polynomials Formula Sheet",
      subject: "Mathematics",
      class: "Class 10",
      fileType: "PDF",
      fileSize: "2.4 MB",
      uploadDate: "02 Oct 2026",
      downloads: 48,
    },
    {
      id: "DOC-102",
      title: "Chemical Reactions & Equations Handwritten Notes",
      subject: "Science",
      class: "Class 10",
      fileType: "PDF",
      fileSize: "4.1 MB",
      uploadDate: "28 Sep 2026",
      downloads: 62,
    },
    {
      id: "DOC-103",
      title: "Force & Laws of Motion Chapter Summary",
      subject: "Science",
      class: "Class 9",
      fileType: "PDF",
      fileSize: "1.8 MB",
      uploadDate: "25 Sep 2026",
      downloads: 34,
    },
    {
      id: "DOC-104",
      title: "Linear Equations in One Variable - Practice Sheet",
      subject: "Mathematics",
      class: "Class 8",
      fileType: "PDF",
      fileSize: "1.2 MB",
      uploadDate: "20 Sep 2026",
      downloads: 29,
    },
    {
      id: "DOC-105",
      title: "English Grammar Tenses Quick Reference Guide",
      subject: "English",
      class: "Class 7",
      fileType: "PDF",
      fileSize: "950 KB",
      uploadDate: "15 Sep 2026",
      downloads: 41,
    },
  ]);

  const [newNote, setNewNote] = useState({
    title: "",
    subject: "Mathematics",
    class: "Class 10",
    fileName: "",
  });

  const handleUpload = (e) => {
    e.preventDefault();
    if (!newNote.title) return;

    const doc = {
      id: `DOC-${Math.floor(100 + Math.random() * 900)}`,
      title: newNote.title,
      subject: newNote.subject,
      class: newNote.class,
      fileType: "PDF",
      fileSize: "2.5 MB",
      uploadDate: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
      downloads: 0,
    };

    setNotesList([doc, ...notesList]);
    setNewNote({ title: "", subject: "Mathematics", class: "Class 10", fileName: "" });
    setShowUploadModal(false);
  };

  const handleDelete = (id) => {
    setNotesList(notesList.filter((n) => n.id !== id));
  };

  const filteredNotes = notesList.filter((note) => {
    const matchesSearch =
      note.title.toLowerCase().includes(search.toLowerCase()) ||
      note.subject.toLowerCase().includes(search.toLowerCase());
    const matchesClass = selectedClass === "All" || note.class === selectedClass;
    return matchesSearch && matchesClass;
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "22px", fontFamily: "sans-serif" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
        <div>
          <h2 style={{ fontSize: "22px", fontWeight: "700", color: "#0f172a", margin: 0 }}>Notes & Study Material</h2>
          <p style={{ fontSize: "13px", color: "#64748b", margin: "4px 0 0 0" }}>
            Upload PDFs, chapter notes, and question banks for student batches
          </p>
        </div>

        <button
          onClick={() => setShowUploadModal(true)}
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
            boxShadow: "0 2px 4px rgba(37,99,235,0.2)",
          }}
        >
          <span>+ Upload Study Material</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div style={{ backgroundColor: "#ffffff", padding: "16px", borderRadius: "14px", border: "1px solid #e2e8f0", display: "flex", flexWrap: "wrap", gap: "12px", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ flex: 1, minWidth: "240px" }}>
          <input
            type="text"
            placeholder="Search by topic, chapter or subject..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "13px", outline: "none", boxSizing: "border-box" }}
          />
        </div>

        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          <span style={{ fontSize: "12px", fontWeight: "600", color: "#64748b" }}>Filter Class:</span>
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            style={{ padding: "9px 12px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "13px", outline: "none", backgroundColor: "#fff", cursor: "pointer" }}
          >
            <option value="All">All Classes (3 to 10)</option>
            <option value="Class 10">Class 10</option>
            <option value="Class 9">Class 9</option>
            <option value="Class 8">Class 8</option>
            <option value="Class 7">Class 7</option>
            <option value="Class 6">Class 6</option>
            <option value="Class 5">Class 5</option>
            <option value="Class 4">Class 4</option>
            <option value="Class 3">Class 3</option>
          </select>
        </div>
      </div>

      {/* Cards Grid View */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(290px, 1fr))", gap: "16px" }}>
        {filteredNotes.map((note) => (
          <div
            key={note.id}
            style={{
              backgroundColor: "#ffffff",
              borderRadius: "14px",
              border: "1px solid #e2e8f0",
              padding: "18px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              boxShadow: "0 1px 3px rgba(0,0,0,0.02)",
            }}
          >
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                <span style={{ fontSize: "11px", fontWeight: "700", padding: "3px 8px", borderRadius: "6px", backgroundColor: "#eff6ff", color: "#2563eb", border: "1px solid #bfdbfe" }}>
                  {note.class}
                </span>
                <span style={{ fontSize: "11px", fontWeight: "600", color: "#64748b" }}>
                  {note.subject}
                </span>
              </div>

              <h4 style={{ fontSize: "15px", fontWeight: "700", color: "#0f172a", margin: "0 0 8px 0", lineHeight: "1.4" }}>
                {note.title}
              </h4>

              <div style={{ display: "flex", gap: "12px", fontSize: "12px", color: "#94a3b8", marginBottom: "16px" }}>
                <span>📁 {note.fileType} • {note.fileSize}</span>
                <span>📅 {note.uploadDate}</span>
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid #f1f5f9", paddingTop: "12px" }}>
              <span style={{ fontSize: "12px", color: "#64748b" }}>
                ⬇️ {note.downloads} downloads
              </span>

              <div style={{ display: "flex", gap: "8px" }}>
                <button
                  onClick={() => alert(`Downloading "${note.title}"...`)}
                  style={{ backgroundColor: "#eff6ff", border: "1px solid #bfdbfe", color: "#1d4ed8", padding: "6px 12px", borderRadius: "8px", fontSize: "12px", fontWeight: "600", cursor: "pointer" }}
                >
                  Download
                </button>
                <button
                  onClick={() => handleDelete(note.id)}
                  style={{ backgroundColor: "#fff", border: "1px solid #fecdd3", color: "#e11d48", padding: "6px 10px", borderRadius: "8px", fontSize: "12px", fontWeight: "500", cursor: "pointer" }}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(15, 23, 42, 0.6)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, padding: "16px" }}>
          <div style={{ backgroundColor: "#ffffff", borderRadius: "16px", padding: "24px", maxWidth: "460px", width: "100%", boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <h3 style={{ fontSize: "18px", fontWeight: "700", color: "#0f172a", margin: 0 }}>Upload Study Material</h3>
              <button onClick={() => setShowUploadModal(false)} style={{ background: "none", border: "none", fontSize: "18px", cursor: "pointer", color: "#64748b" }}>
                ✕
              </button>
            </div>

            <form onSubmit={handleUpload} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div>
                <label style={{ fontSize: "12px", fontWeight: "600", color: "#475569", display: "block", marginBottom: "4px" }}>Document Title / Chapter *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Chapter 3 Pair of Linear Equations Notes"
                  value={newNote.title}
                  onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
                  style={{ width: "100%", padding: "8px 12px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "13px", boxSizing: "border-box" }}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div>
                  <label style={{ fontSize: "12px", fontWeight: "600", color: "#475569", display: "block", marginBottom: "4px" }}>Class *</label>
                  <select
                    value={newNote.class}
                    onChange={(e) => setNewNote({ ...newNote, class: e.target.value })}
                    style={{ width: "100%", padding: "8px 12px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "13px", boxSizing: "border-box", backgroundColor: "#fff" }}
                  >
                    {["Class 10", "Class 9", "Class 8", "Class 7", "Class 6", "Class 5", "Class 4", "Class 3"].map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: "12px", fontWeight: "600", color: "#475569", display: "block", marginBottom: "4px" }}>Subject *</label>
                  <select
                    value={newNote.subject}
                    onChange={(e) => setNewNote({ ...newNote, subject: e.target.value })}
                    style={{ width: "100%", padding: "8px 12px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "13px", boxSizing: "border-box", backgroundColor: "#fff" }}
                  >
                    <option value="Mathematics">Mathematics</option>
                    <option value="Science">Science</option>
                    <option value="English">English</option>
                    <option value="Social Science">Social Science</option>
                    <option value="Hindi">Hindi</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ fontSize: "12px", fontWeight: "600", color: "#475569", display: "block", marginBottom: "4px" }}>Attach File (PDF, DOCX) *</label>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  required
                  style={{ width: "100%", padding: "8px", borderRadius: "8px", border: "1px dashed #94a3b8", fontSize: "12px", boxSizing: "border-box" }}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "12px" }}>
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  style={{ padding: "8px 16px", borderRadius: "8px", border: "1px solid #cbd5e1", background: "none", fontSize: "13px", cursor: "pointer", color: "#475569" }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ padding: "8px 18px", borderRadius: "8px", border: "none", backgroundColor: "#2563eb", color: "#fff", fontSize: "13px", fontWeight: "600", cursor: "pointer" }}
                >
                  Upload Material
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
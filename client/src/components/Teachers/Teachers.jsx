function Teachers() {
  return (
    <section
      style={{
        padding: "80px 20px",
        background: "#ffffff",
        textAlign: "center",
      }}
    >
      <h2 style={{ fontSize: "36px", marginBottom: "20px" }}>
        Meet Your Mentor
      </h2>

      <div
        style={{
          maxWidth: "500px",
          margin: "auto",
          padding: "30px",
          borderRadius: "12px",
          background: "#f8fafc",
          boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
        }}
      >
        <div
          style={{
            width: "120px",
            height: "120px",
            borderRadius: "50%",
            background: "#2563eb",
            margin: "0 auto 20px",
          }}
        ></div>

        <h3 style={{ fontSize: "28px" }}>Naveen Sir</h3>

        <p>📚 Teaching Class 3 to Class 10</p>

        <p>⭐ Dedicated Mentor</p>

        <p style={{ marginTop: "15px", color: "#555" }}>
          Helping students build strong concepts, confidence, and excellent
          academic results through quality education.
        </p>

        <button
          style={{
            marginTop: "20px",
            padding: "12px 25px",
            background: "#2563eb",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          Contact Now
        </button>
      </div>
    </section>
  );
}

export default Teachers;
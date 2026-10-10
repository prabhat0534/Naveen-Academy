function Hero() {
  return (
    <section
      style={{
        background: "linear-gradient(135deg, #0f172a, #2563eb)",
        color: "white",
        textAlign: "center",
        padding: "100px 20px",
      }}
    >
      <h1 style={{ fontSize: "48px", marginBottom: "20px" }}>
        Welcome to Naveen Academy
      </h1>

      <p style={{ fontSize: "22px", marginBottom: "30px" }}>
        Best Coaching for Class 3 to 10
      </p>

      <button
        style={{
          padding: "12px 24px",
          marginRight: "15px",
          border: "none",
          borderRadius: "8px",
          backgroundColor: "#facc15",
          cursor: "pointer",
          fontSize: "16px",
        }}
      >
        Join Now
      </button>

      <button
        style={{
          padding: "12px 24px",
          border: "none",
          borderRadius: "8px",
          backgroundColor: "white",
          color: "#0f172a",
          cursor: "pointer",
          fontSize: "16px",
        }}
      >
        Explore Classes
      </button>
    </section>
  );
}

export default Hero;
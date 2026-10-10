function Contact() {
  return (
    <section
      style={{
        padding: "80px 20px",
        background: "#ffffff",
        textAlign: "center",
      }}
    >
      <h2 style={{ fontSize: "36px", marginBottom: "30px" }}>
        Contact Us
      </h2>

      <div
        style={{
          maxWidth: "600px",
          margin: "auto",
          background: "#f8fafc",
          padding: "30px",
          borderRadius: "10px",
          boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
        }}
      >
        <p><strong>🏫 Coaching:</strong> Naveen Academy</p>

        <p><strong>📍 Address:</strong>Thawe , Gajadhar Tola </p>

        <p><strong>📞 Mobile:</strong> +91 7481923106</p>

        <p><strong>📧 Email:</strong> naveenacademy@gmail.com</p>

        <p><strong>🕒 Timing:</strong> Monday - Saturday | 4 PM - 8 PM</p>

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

export default Contact;
function WhyChoose() {
  const features = [
    "Experienced Teacher",
    "Best Results",
    "Small Batch Size",
    "Study Material",
  ];

  return (
    <section
      style={{
        padding: "80px 20px",
        background: "#f8fafc",
        textAlign: "center",
      }}
    >
      <h2 style={{ fontSize: "36px", marginBottom: "40px" }}>
        Why Choose Naveen Academy?
      </h2>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          flexWrap: "wrap",
          gap: "20px",
        }}
      >
        {features.map((item, index) => (
          <div
            key={index}
            style={{
              width: "250px",
              background: "white",
              padding: "30px",
              borderRadius: "10px",
              boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
            }}
          >
            <h3>{item}</h3>
          </div>
        ))}
      </div>
    </section>
  );
}

export default WhyChoose;
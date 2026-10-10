function Classes() {
  const classList = [
    "Class 3",
    "Class 4",
    "Class 5",
    "Class 6",
    "Class 7",
    "Class 8",
    "Class 9",
    "Class 10",
  ];

  return (
    <section
      style={{
        padding: "80px 20px",
        textAlign: "center",
      }}
    >
      <h2 style={{ fontSize: "36px", marginBottom: "40px" }}>
        Our Classes
      </h2>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "20px",
        }}
      >
        {classList.map((item, index) => (
          <div
            key={index}
            style={{
              width: "180px",
              padding: "25px",
              background: "#2563eb",
              color: "white",
              borderRadius: "10px",
              fontSize: "20px",
              fontWeight: "bold",
            }}
          >
            {item}
          </div>
        ))}
      </div>
    </section>
  );
}

export default Classes;
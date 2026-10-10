function Testimonials() {
  const reviews = [
    {
      name: "Rahul Kumar",
      class: "Class 10",
      review: "Naveen Sir bahut achha padhate hain. Mere Maths me 95 marks aaye.",
    },
    {
      name: "Priya Singh",
      class: "Class 8",
      review: "Best coaching. Concepts bahut easily samajh aate hain.",
    },
    {
      name: "Aman Kumar",
      class: "Class 9",
      review: "Regular tests aur notes ki wajah se mera performance improve hua.",
    },
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
        Student Reviews
      </h2>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          flexWrap: "wrap",
          gap: "20px",
        }}
      >
        {reviews.map((item, index) => (
          <div
            key={index}
            style={{
              width: "300px",
              padding: "25px",
              background: "white",
              borderRadius: "10px",
              boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
            }}
          >
            <h3>{item.name}</h3>
            <p><strong>{item.class}</strong></p>
            <p>"{item.review}"</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Testimonials;
import { useNavigate } from "react-router-dom";
import "./Classes.css";

function Classes() {
  const navigate = useNavigate();

  const classes = [
    { id: 3, name: "Class 3", students: 35, teacher: "Naveen Sir" },
    { id: 4, name: "Class 4", students: 40, teacher: "Naveen Sir" },
    { id: 5, name: "Class 5", students: 38, teacher: "Naveen Sir" },
    { id: 6, name: "Class 6", students: 42, teacher: "Naveen Sir" },
    { id: 7, name: "Class 7", students: 39, teacher: "Naveen Sir" },
    { id: 8, name: "Class 8", students: 45, teacher: "Naveen Sir" },
    { id: 9, name: "Class 9", students: 48, teacher: "Naveen Sir" },
    { id: 10, name: "Class 10", students: 52, teacher: "Naveen Sir" },
  ];

  return (
    <div className="classes-page">
      <h1>🏫 Naveen Academy Classes</h1>

      <div className="class-grid">
        {classes.map((item) => (
          <div className="class-card" key={item.id}>
            <h2>{item.name}</h2>

            <p>👨‍🎓 Students: {item.students}</p>

            <p>👨‍🏫 Teacher: {item.teacher}</p>

            <button onClick={() => navigate(`/class/${item.id}`)}>
              View Details
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Classes;
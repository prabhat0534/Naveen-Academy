import { useParams } from "react-router-dom";
import "./ClassDetails.css";

function ClassDetails() {
  const { id } = useParams();

  return (
    <div className="class-details">
      <h1>🏫 Class {id}</h1>

      <div className="details-grid">

        <div className="detail-card">
          <h2>👨‍🏫 Teacher</h2>
          <p>Naveen Sir</p>
        </div>

        <div className="detail-card">
          <h2>👨‍🎓 Students</h2>
          <p>40 Students</p>
        </div>

        <div className="detail-card">
          <h2>📅 Attendance</h2>
          <p>View Attendance</p>
        </div>

        <div className="detail-card">
          <h2>💰 Fees</h2>
          <p>View Fees</p>
        </div>

        <div className="detail-card">
          <h2>📝 Results</h2>
          <p>View Results</p>
        </div>

        <div className="detail-card">
          <h2>📢 Notices</h2>
          <p>Latest Notices</p>
        </div>

      </div>
    </div>
  );
}

export default ClassDetails;
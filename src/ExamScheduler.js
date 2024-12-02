import React, { useState, useContext } from "react";
import UserContext from "./context/UserContext"; // Import your user context

function ExamScheduler() {
  const { candidateId } = useContext(UserContext); // Access candidateId from context

  const [formData, setFormData] = useState({
    subject: "",
    examDateTime: "",
  });
  const [error, setError] = useState("");

  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:8080";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleDateTimeChange = (e) => {
    const { name, value } = e.target;
    const date = formData.examDateTime.split("T")[0] || "";
    const time = formData.examDateTime.split("T")[1] || "";

    const updatedDateTime = name === "date" ? `${value}T${time}` : `${date}T${value}`;
    setFormData({ ...formData, examDateTime: updatedDateTime });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!candidateId) {
      setError("Candidate ID is missing. Please log in again.");
      return;
    }

    const { subject, examDateTime } = formData;

    if (!subject || !examDateTime.includes("T")) {
      setError("All fields are required.");
      return;
    }

    const payload = {
      candidateId, // Include candidateId
      subject,
      examDateTime,
    };

    try {
      const response = await fetch(`${API_BASE_URL}/api/exam/schedule`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        alert("Exam scheduled successfully!");
        setFormData({ subject: "", examDateTime: "" });
      } else {
        const errorText = await response.text();
        setError(errorText);
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    }
  };

  const dateValue = formData.examDateTime.split("T")[0] || "";
  const timeValue = formData.examDateTime.split("T")[1] || "";

  return (
    <div style={styles.container}>
      <h2>Schedule Exam</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <label style={styles.label}>
          Subject:
          <select
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            style={styles.input}
            required
          >
            <option value="">-- Select --</option>
            <option value="Math">Math</option>
            <option value="Biology">Biology</option>
            <option value="BEL">BEL</option>
            <option value="OPT">OPT</option>
            <option value="Physics">Physics</option>
            <option value="English">English</option>
          </select>
        </label>

        <label style={styles.label}>
          Date:
          <input
            type="date"
            name="date"
            value={dateValue}
            onChange={handleDateTimeChange}
            style={styles.input}
            required
          />
        </label>

        <label style={styles.label}>
          Time:
          <select
            name="time"
            value={timeValue}
            onChange={handleDateTimeChange}
            style={styles.input}
            required
          >
            <option value="">-- Select --</option>
            <option value="09:00">09:00</option>
            <option value="11:00">11:00</option>
            <option value="14:30">14:30</option>
          </select>
        </label>

        {error && <p style={styles.error}>{error}</p>}
        <button type="submit" style={styles.button}>
          Schedule Exam
        </button>
      </form>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    backgroundColor: "#f0f2f5",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
    width: "300px",
    padding: "2rem",
    border: "1px solid #ddd",
    borderRadius: "8px",
    backgroundColor: "#fff",
  },
  label: {
    display: "flex",
    flexDirection: "column",
    fontSize: "1rem",
    color: "#333",
  },
  input: {
    padding: "0.5rem",
    fontSize: "1rem",
    borderRadius: "4px",
    border: "1px solid #ddd",
  },
  button: {
    padding: "0.5rem",
    fontSize: "1rem",
    borderRadius: "4px",
    border: "none",
    color: "#fff",
    backgroundColor: "#007bff",
    cursor: "pointer",
  },
  error: {
    color: "red",
    fontSize: "0.9rem",
  },
};

export default ExamScheduler;

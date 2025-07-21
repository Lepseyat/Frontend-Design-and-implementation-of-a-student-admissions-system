import React, { useEffect, useState } from "react";
import axios from "axios";

const ManageAcceptedExams = () => {
    const [acceptedExams, setAcceptedExams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [editId, setEditId] = useState(null);
    const [gradeInputs, setGradeInputs] = useState({});

    useEffect(() => {
        fetchAcceptedExams();
    }, []);

    const fetchAcceptedExams = async () => {
        try {
            const response = await axios.get("http://localhost:8080/api/exam/manage/accepted");
            const formatted = response.data.map((item) => ({
            id: item.id,
            candidateName: item.candidateFullName,
            specialty: item.specialty,
            examName: item.examName,
            examScore: item.examScore,
            examGrade: item.examGrade
        }));
            setAcceptedExams(formatted);
        } catch (err) {
            setError("Failed to load accepted exams.");
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (id, field, value) => {
        setGradeInputs((prev) => ({
            ...prev,
            [id]: {
                ...prev[id],
                [field]: value
            }
        }));
    };

    const handleSave = async (id) => {
      const { examScore, examGrade } = gradeInputs[id] || {};
  
      // Debugging: log the data to ensure it's what you expect
      console.log("Saving exam with data:", {
          examScore: parseFloat(examScore),  // Ensure examScore is a number
          examGrade: parseFloat(examGrade),  // Ensure examGrade is a number
          status: "COMPLETED"                // Explicitly setting status as COMPLETED
      });
  
      try {
          // Send PUT request to update the exam score, grade, and status
          await axios.put(`http://localhost:8080/api/exam/manage/${id}/grade`, {
              examScore: parseFloat(examScore),  // Make sure it's a number
              examGrade: parseFloat(examGrade),  // Make sure it's a number
              status: "COMPLETED"                // Explicitly setting status as COMPLETED
          });
  
          setEditId(null);  // Close the edit mode
          fetchAcceptedExams();  // Reload the exams to reflect changes
      } catch (err) {
          console.error("Error saving grade:", err);  // Log any errors for debugging
          alert("Error saving grade.");
      }
  };
 
    if (loading) return <p style={styles.loading}>Loading...</p>;
    if (error) return <p style={styles.error}>{error}</p>;

    return (
        <div style={styles.container}>
            <h2 style={styles.heading}>Manage Accepted Exams & Grades</h2>
            {acceptedExams.length === 0 ? (
                <p style={styles.noRequests}>No accepted exams</p>
            ) : (
                <table style={styles.table}>
                  <thead>
                    <tr style={styles.tableHeader}>
                      <th style={styles.tableCell}>Candidate Name</th>
                      <th style={styles.tableCell}>Specialty</th>
                      <th style={styles.tableCell}>Exam Name</th>
                      <th style={styles.tableCell}>Score</th>
                      <th style={styles.tableCell}>Grade</th>
                      <th style={styles.tableCell}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {acceptedExams.map((item) => (
                      <tr key={item.id}>

                        <td style={styles.tableCell}>{item.candidateName}</td>
                        <td style={styles.tableCell}>{item.specialty}</td>
                        <td style={styles.tableCell}>{item.examName}</td>
                        <td style={styles.tableCell}>
                          {editId === item.id ? (
                            <input
                              type="number"
                              value={gradeInputs[item.id]?.examScore || ""}
                              onChange={(e) =>
                                handleInputChange(item.id, "examScore", e.target.value)
                              }
                            />
                          ) : (
                            item.examScore ?? "-"
                          )}
                        </td>
                        <td style={styles.tableCell}>
                          {editId === item.id ? (
                            <input
                              type="number"
                              value={gradeInputs[item.id]?.examGrade || ""}
                              onChange={(e) =>
                                handleInputChange(item.id, "examGrade", e.target.value)
                              }
                            />
                          ) : (
                            item.examGrade ?? "-"
                          )}
                        </td>
                        <td style={styles.tableCell}>
                          {editId === item.id ? (
                            <>
                              <button style={styles.acceptButton} onClick={() => handleSave(item.id)}>💾 Save</button>
                              <button style={styles.denyButton} onClick={() => setEditId(null)}>❌ Cancel</button>
                            </>
                          ) : (
                            <button
                              style={styles.receiptButton}
                              onClick={() => {
                                setEditId(item.id);
                                setGradeInputs((prev) => ({
                                  ...prev,
                                  [item.id]: {
                                    examScore: item.examScore || "",
                                    examGrade: item.examGrade || "",
                                  },
                                }));
                              }}
                            >
                              ✏️ Edit
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

            )}
        </div>
    );
};

const styles = {
  container: {
    padding: "20px",
    backgroundColor: "#f9f9f9",
    textAlign: "center",
    minHeight: "100vh",
  },
  heading: {
    fontSize: "24px",
    marginBottom: "20px",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    backgroundColor: "#fff",
    marginTop: "20px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  },
  tableHeader: {
    backgroundColor: "#007bff",
    color: "#fff",
  },
  tableCell: {
  padding: "8px",
  border: "1px solid #ddd",
  textAlign: "left",        
  whiteSpace: "normal",     
  wordWrap: "break-word",   
  maxWidth: "200px"         
}
,
  noRequests: {
    fontSize: "18px",
    color: "#555",
  },
  loading: {
    fontSize: "18px",
    fontWeight: "bold",
    color: "#007bff",
  },
  error: {
    fontSize: "18px",
    color: "#d9534f",
  },
  receiptButton: {
    padding: "6px 10px",
    backgroundColor: "#2196F3",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  acceptButton: {
    padding: "6px 12px",
    marginRight: "5px",
    backgroundColor: "green",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  denyButton: {
    padding: "6px 12px",
    backgroundColor: "red",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
};


export default ManageAcceptedExams;

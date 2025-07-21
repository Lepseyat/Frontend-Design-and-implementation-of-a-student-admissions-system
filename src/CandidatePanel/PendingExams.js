import React, { useEffect, useState } from "react";
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from "react-router-dom";
import axios from 'axios';

const PendingExams = () => {
  const [pendingExams, setPendingExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null); // State to store selected file
  const [uploadError, setUploadError] = useState(null); // State to store upload errors
  const [uploading, setUploading] = useState({}); // Track uploading state for each exam
  const [candidateId, setCandidateId] = useState(null);

  const navigate = useNavigate();

  // Extract candidate ID from JWT token once on component mount
      useEffect(() => {
          const token = localStorage.getItem("jwtToken");
  
          if (!token) {
              setError("No authentication token found.");
              return;
          }
  
          try {
              const decodedToken = jwtDecode(token);
              const userId = decodedToken.sub;
  
              if (!userId) {
                  setError("User ID not found in token.");
              } else {
                  setCandidateId(userId); // Set the candidateId which triggers the second useEffect
              }
          } catch (err) {
              setError("Invalid token.");
          }
      }, []);

  useEffect(() => {
  if (!candidateId) return;

  const fetchPendingExams = async () => {
    try {
      const token = localStorage.getItem("jwtToken");
      const response = await axios.get(`http://localhost:8080/api/exam/myRequests/${candidateId}`, {
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
      });

      setPendingExams(response.data.filter(exam => exam.status === "PENDING"));
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  fetchPendingExams();
}, [candidateId]);

  // Handle file selection
  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  // Handle receipt update
 const handleUpload = async (examId) => {
  if (!selectedFile) {
    setUploadError("Please select a file to upload.");
    return;
  }

  setUploading((prev) => ({ ...prev, [examId]: true }));
  setUploadError(null);

  const token = localStorage.getItem("jwtToken");
  const formData = new FormData();
  formData.append("receipt", selectedFile);

  try {
    await axios.put(`http://localhost:8080/api/exam/${examId}/update-receipt`, formData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    });

    alert("Receipt uploaded successfully!");
    setSelectedFile(null);
  } catch (error) {
    setUploadError(error.response?.data?.message || error.message);
  } finally {
    setUploading((prev) => ({ ...prev, [examId]: false }));
  }
};


  if (loading) return <div style={styles.loading}>Loading...</div>;
  if (error) return <div style={styles.error}>Error: {error}</div>;

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.headerText}>Pending Exam Requests</h1>
      </header>

      <div style={styles.content}>
        {pendingExams.length === 0 ? (
          <p>No pending exams.</p>
        ) : (
          <ul style={styles.list}>
            {pendingExams.map((exam) => (
              <li key={exam.id} style={styles.listItem}>
                <strong>Subject:</strong> {exam.exam.subject} <br />
                <strong>Date:</strong> {new Date(exam.exam.examDateTime).toLocaleString()} <br />
                <strong>Status:</strong> {exam.status} <br />
                {exam.status === "PENDING" && (
                  <>
                    <label htmlFor={`fileInput-${exam.id}`} style={styles.customFileButton}>
                      Choose File
                    </label>
                    <input
                      id={`fileInput-${exam.id}`}
                      type="file"
                      accept="image/*,application/pdf"
                      onChange={handleFileChange}
                      style={styles.input}
                    />
                    {uploadError && <div style={styles.error}>{uploadError}</div>}
                    <button
                      style={styles.button}
                      onClick={() => handleUpload(exam.id)}
                      disabled={uploading[exam.id]} // Disable button if uploading
                    >
                      {uploading[exam.id] ? "Uploading..." : "Upload Receipt"}
                    </button>
                  </>
                )}
              </li>
            ))}
          </ul>
        )}

        <button style={styles.button} onClick={() => navigate("/profile")}>
          Back to Profile
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: { 
    display: "flex", 
    flexDirection: "column", 
    alignItems: "center", 
    minHeight: "100vh", 
    backgroundColor: "#f9f9f9", 
    paddingTop: "40px" 
  },
  header: { 
    backgroundColor: "#007bff", 
    padding: "20px 0", 
    width: "100%", 
    textAlign: "center", 
    position: "fixed", 
    top: 0, 
    left: 0, 
    zIndex: 10 
  },
  headerText: { 
    color: "#fff", 
    fontSize: "2rem", 
    fontWeight: "bold", 
    margin: "0" 
  },
  content: { 
    backgroundColor: "#fff", 
    padding: "2rem", 
    borderRadius: "8px", 
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", 
    width: "100%", 
    maxWidth: "500px", 
    textAlign: "center", 
    marginTop: "80px" 
  },
  list: { listStyleType: "none", padding: 0 },
  listItem: { 
    backgroundColor: "#e9ecef", 
    padding: "1rem", 
    borderRadius: "8px", 
    marginBottom: "10px" 
  },
  button: { 
    marginTop: "1rem", 
    padding: "0.8rem", 
    fontSize: "1rem", 
    borderRadius: "10px", 
    border: "none", 
    color: "#fff", 
    backgroundColor: "#007bff", 
    cursor: "pointer", 
    textAlign: "center", 
    width: "150px", 
    marginLeft: "60px",
    transition: "background-color 0.3s ease" 
  },
  input: { display: "none" }, // Hide the default file input
  customFileButton: { 
    display: "inline-block", 
    padding: "0.8rem", 
    backgroundColor: "#007bff", 
    color: "#fff", 
    borderRadius: "10px", 
    cursor: "pointer", 
    textAlign: "center", 
    fontSize: "1rem", 
    width: "150px", 
    marginBottom: "1rem", // Ensure there's space below the file input button
    transition: "background-color 0.3s ease" 
  },
  loading: { fontSize: "1.2rem", color: "#555" },
  error: { fontSize: "1.2rem", color: "red" },
};

export default PendingExams;

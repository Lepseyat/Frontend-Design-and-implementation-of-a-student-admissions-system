import React, { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const CandidateResults = () => {
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [candidateId, setCandidateId] = useState(null); // Start as null

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

    // Fetch results when candidateId is set
    useEffect(() => {
        if (candidateId) {
            fetchResults(candidateId);
        }
    }, [candidateId]);

    const fetchResults = async (id) => {
        setLoading(true);
        setError("");

        try {
            const response = await axios.get(`http://localhost:8080/api/exam/result/${id}`);

            if (response.data.length > 0) {
                setResults(response.data);
            } else {
                setError("No completed exams found.");
            }
        } catch (error) {
            setError("Failed to fetch results. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <h2 style={styles.heading}>View Your Exam Results</h2>

            {loading && <p style={styles.loading}>Loading...</p>}
            {error && <p style={styles.error}>{error}</p>}

            {results.length > 0 && (
                <table style={styles.table}>
                    <thead>
                    <tr style={styles.tableHeader}>
                        <th style={styles.tableCell}>Specialty</th>
                        <th style={styles.tableCell}>Subject</th>
                        <th style={styles.tableCell}>Date</th>
                        <th style={styles.tableCell}>Score</th>
                        <th style={styles.tableCell}>Grade</th>
                        <th style={styles.tableCell}>BAL</th>
                    </tr>
                </thead>
                <tbody>
                  {results.map((exam) => {
                    const examDate = exam.exam?.examDateTime
                      ? new Date(exam.exam.examDateTime).toLocaleString()
                      : "N/A";
                    return (
                      <tr key={exam.id}>
                        <td style={styles.tableCell}>{exam.exam?.specialty || "N/A"}</td>
                        <td style={styles.tableCell}>{exam.exam?.subject || "N/A"}</td>
                        <td style={styles.tableCell}>{examDate}</td>
                        <td style={styles.tableCell}>{exam.examScore}</td>
                        <td style={styles.tableCell}>{exam.examGrade}</td>
                        <td style={styles.tableCell}>{exam.bal}</td>
                      </tr>
                    );
                })}
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
    loading: {
        fontSize: "18px",
        fontWeight: "bold",
        color: "#007bff",
    },
    error: {
        fontSize: "18px",
        color: "#d9534f",
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
    },
};

export default CandidateResults;

import React, { useEffect, useState } from "react";
import axios from "axios";

const ManageExamRequests = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchExamRequests();
    }, []);

    const fetchExamRequests = async () => {
        try {
            const response = await axios.get("http://localhost:8080/api/exam/pendingRequests");
            const formattedRequests = response.data.map(req => ({
                id: req.id,
                candidateName: req.candidateFullName,
                examName: req.examName,
                specialty: req.specialty,
                examScore: req.examScore,
                examGrade: req.examGrade,
                receipt: req.receipt,
                status: req.status
            }));
            setRequests(formattedRequests);
        } catch (err) {
            setError("Failed to load exam requests.");
        } finally {
            setLoading(false);
        }
    };

    const viewReceipt = async (id) => {
        try {
            const response = await axios.get(`http://localhost:8080/api/exam/${id}/receipt`, {
                responseType: "blob",
            });
            const imageUrl = URL.createObjectURL(response.data);
            window.open(imageUrl, "_blank");
        } catch (err) {
            alert("Failed to load receipt.");
        }
    };

    const handleAccept = async (id) => {
        try {
            await axios.post(`http://localhost:8080/api/exam/${id}/accept`);
            setRequests((prevRequests) => prevRequests.filter((req) => req.id !== id));
        } catch (err) {
            alert("Error accepting the request.");
        }
    };

    const handleDeny = async (id) => {
        try {
            await axios.post(`http://localhost:8080/api/exam/${id}/deny`);
            setRequests((prevRequests) => prevRequests.filter((req) => req.id !== id)); 
        } catch (err) {
            alert("Error denying the request.");
        }
    };

    if (loading) return <p style={styles.loading}>Loading...</p>;
    if (error) return <p style={styles.error}>{error}</p>;

    return (
        <div style={styles.container}>
            <h2 style={styles.heading}>Manage Exam Requests (Admin Panel)</h2>
            {requests.length === 0 ? (
                <p style={styles.noRequests}>No pending requests</p>
            ) : (
                <table style={styles.table}>
                   <thead>
                        <tr>
                            <th>Candidate Name</th>
                            <th>Exam Name</th>
                            <th>Status</th>
                            <th>Receipt</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {requests.map((req) => (
                            <tr key={req.id}>
                                <td>{req.candidateName}</td>
                                <td>{req.examName}</td>
                                <td>{req.status}</td>
                                <td>
                                    {req.receipt ? (
                                        <button style={styles.receiptButton} onClick={() => viewReceipt(req.id)}>
                                            📄 View Receipt
                                        </button>
                                    ) : (
                                        "No receipt"
                                    )}
                                </td>
                                <td>
                                    <button style={styles.acceptButton} onClick={() => handleAccept(req.id)}>
                                        ✅ Accept
                                    </button>
                                    <button style={styles.denyButton} onClick={() => handleDeny(req.id)}>
                                        ❌ Deny
                                    </button>
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
    },
    heading: {
        fontSize: "24px",
        marginBottom: "20px",
    },
    table: {
        width: "100%",
        borderCollapse: "collapse",
        backgroundColor: "#fff",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    },
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
    }
};

export default ManageExamRequests;

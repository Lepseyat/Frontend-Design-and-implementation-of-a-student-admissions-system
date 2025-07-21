import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

function ExamRequest() {
    const location = useLocation();
    const { exam, candidateId } = location.state || {};

    const [file, setFile] = useState(null);
    const [averageDiplomaDegree, setAverageDiplomaDegree] = useState('');
    const [subjectDegree, setSubjectDegree] = useState('');
    const [error, setError] = useState('');

    if (!exam || !candidateId) {
        return <p>Invalid request. Please go back and select an exam again.</p>;
    }

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handleSubmit = async () => {
        if (!averageDiplomaDegree || !subjectDegree || !file) {
            setError("All fields are required, including the receipt file.");
            return;
        }

        const avg = parseFloat(averageDiplomaDegree);
        const subj = parseFloat(subjectDegree);

        if (isNaN(avg) || isNaN(subj) || avg < 0 || avg > 20 || subj < 0 || subj > 20) {
            setError("Degrees must be numbers between 0 and 20.");
            return;
        }

        const formData = new FormData();
        formData.append("candidateId", candidateId);
        formData.append("examId", exam.id);
        formData.append("status", "PENDING");
        formData.append("receipt", file);
        formData.append("averageDiplomaDegree", avg);
        formData.append("subjectDegree", subj);

        try {
            await axios.post("http://localhost:8080/api/exam/request", formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            alert("Exam request submitted! Waiting for admin approval.");
        } catch (error) {
            console.error('Error submitting request:', error);
            if (error.response && error.response.status === 409) {
                setError("You have already submitted a request for this exam.");
            } else {
                setError("Failed to submit exam request. Please try again.");
            }
        }
    };

    return (
        <div style={styles.container}>
            <header style={styles.header}>
                <h1 style={styles.headerText}>Exam Request</h1>
            </header>
            <div style={styles.content}>
                <p style={styles.examDetails}><strong>Exam Name:</strong> {exam.subject}</p>
                <p style={styles.examDetails}><strong>Date & Time:</strong> {new Date(exam.examDateTime).toLocaleString()}</p>

                <label style={styles.label}>Average Diploma Degree</label>
                <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="20"
                    value={averageDiplomaDegree}
                    onChange={(e) => setAverageDiplomaDegree(e.target.value)}
                    style={styles.input}
                    placeholder=""
                />

                <label style={styles.label}>Subject Degree</label>
                <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="20"
                    value={subjectDegree}
                    onChange={(e) => setSubjectDegree(e.target.value)}
                    style={styles.input}
                    placeholder=""
                />

                <h3 style={styles.uploadHeader}>Upload Payment Receipt</h3>
                <input
                    type="file"
                    accept="image/*,application/pdf"
                    onChange={handleFileChange}
                    style={styles.fileInput}
                />

                <button onClick={handleSubmit} style={styles.button}>
                    Submit Request
                </button>

                {error && <p style={styles.error}>{error}</p>}
            </div>
        </div>
    );
}

const styles = {
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#f9f9f9',
        paddingTop: '40px',
    },
    header: {
        backgroundColor: '#007bff',
        padding: '20px 0',
        width: '100%',
        textAlign: 'center',
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 10,
    },
    headerText: {
        color: '#fff',
        fontSize: '2rem',
        fontWeight: 'bold',
        margin: 0,
    },
    content: {
        backgroundColor: '#fff',
        padding: '20px 30px',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        width: '100%',
        maxWidth: '500px',
        marginTop: '80px',
    },
    examDetails: {
        fontSize: '1rem',
        marginBottom: '8px',
        textAlign: 'left',
    },
    label: {
        display: 'block',
        fontWeight: 'bold',
        marginTop: '15px',
        marginBottom: '5px',
        textAlign: 'left',
    },
    input: {
        width: '100%',
        padding: '10px',
        border: '1px solid #ccc',
        borderRadius: '5px',
        fontSize: '1rem',
    },
    uploadHeader: {
        fontSize: '1.2rem',
        marginTop: '20px',
        textAlign: 'left',
    },
    fileInput: {
        marginTop: '10px',
        padding: '8px',
        fontSize: '1rem',
        width: '100%',
        borderRadius: '5px',
        border: '1px solid #ddd',
        backgroundColor: '#f9f9f9',
    },
    button: {
        backgroundColor: '#007bff',
        color: 'white',
        padding: '10px 20px',
        border: 'none',
        cursor: 'pointer',
        borderRadius: '5px',
        marginTop: '20px',
        width: '100%',
        fontSize: '1rem',
    },
    error: {
        color: 'red',
        fontWeight: 'bold',
        marginTop: '15px',
    },
};

export default ExamRequest;

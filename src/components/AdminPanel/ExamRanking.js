import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ExamRanking = () => {
  const [specialty, setSpecialty] = useState('');
  const [specialties, setSpecialties] = useState([]);
  const [exams, setExams] = useState([]);
  const [selectedExamId, setSelectedExamId] = useState('');
  const [ranking, setRanking] = useState([]);
  const [error, setError] = useState('');
  const [noExams, setNoExams] = useState(false);


  useEffect(() => {
    axios.get('http://localhost:8080/api/exam/manage/specialties')
      .then(res => setSpecialties(res.data))
      .catch(() => setError('Failed to load specialties.'));
  }, []);

  useEffect(() => {
  if (!specialty) return;

  setSelectedExamId(''); // Reset selected exam
  setNoExams(false);     // Reset no-exams flag

  axios
    .get(`http://localhost:8080/api/exam/manage/exams/${specialty}`)
    .then(res => {
      setExams(res.data);
      setNoExams(res.data.length === 0); // Check if it's empty
    })
    .catch(() => {
      setError('Failed to load exams.');
      setExams([]);
      setNoExams(false); // Don't show message on error
    });
}, [specialty]);

const fetchRanking = async () => {
  if (!specialty || !selectedExamId) return;

  try {
    const response = await axios.get(`http://localhost:8080/api/exam/manage/ranking/${specialty}/${selectedExamId}`);
    setRanking(response.data);
    setError('');
  } catch {
    setError('Failed to fetch ranking data.');
  }
};


  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>View Exam Rankings</h2>

      <div style={{ marginBottom: '15px' }}>
        <label style={styles.label}>
          Select Specialty:&nbsp;
          <select style={styles.select} onChange={e => setSpecialty(e.target.value)} value={specialty}>
            <option value="">-- Choose --</option>
            {specialties.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </label>
      </div>

      {specialty && (
  <>
    <div style={{ marginBottom: '15px' }}>
      <label style={styles.label}>
        Select Exam:&nbsp;
        <select
          style={styles.select}
          onChange={e => setSelectedExamId(e.target.value)}
          value={selectedExamId}
        >
          <option value="">-- Choose --</option>
          {exams.map(exam => {
            const date = new Date(exam.examDateTime);
            const dateString = date.toLocaleDateString();
            const timeString = date.toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            });

            return (
              <option key={exam.id} value={exam.id}>
                {exam.subject} — {dateString} at {timeString}
              </option>
            );
          })}
        </select>
      </label>
    </div>

    {noExams && (
      <p style={{ color: 'gray', fontStyle: 'italic', marginBottom: '15px' }}>
        No exams available for this specialty.
      </p>
    )}
  </>
)}

      <button style={styles.button} onClick={fetchRanking} disabled={!specialty || !selectedExamId}>
        View Ranking
      </button>

      {error && <p style={styles.error}>{error}</p>}

      {ranking.length > 0 && (
        <table style={styles.table}>
          <thead>
            <tr style={styles.tableHeader}>
              <th style={styles.tableCell}>Name</th>
              <th style={styles.tableCell}>Exam Grade</th>
              <th style={styles.tableCell}>Diploma Degree</th>
              <th style={styles.tableCell}>Subject Degree</th>
              <th style={styles.tableCell}>BAL</th>
            </tr>
          </thead>
          <tbody>
            {ranking.map((r, index) => (
              <tr key={index}>
                <td style={styles.tableCell}>{r.fullName}</td>
                <td style={styles.tableCell}>{r.examGrade}</td>
                <td style={styles.tableCell}>{r.averageDiplomaDegree}</td>
                <td style={styles.tableCell}>{r.subjectDegree}</td>
                <td style={styles.tableCell}>{r.bal}</td>
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
  label: {
    fontSize: "16px",
    marginRight: "10px",
  },
  select: {
    padding: "8px",
    fontSize: "16px",
    borderRadius: "4px",
    border: "1px solid #ccc",
  },
  button: {
    padding: "10px 16px",
    fontSize: "16px",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    marginTop: "10px",
  },
  error: {
    fontSize: "16px",
    color: "#d9534f",
    marginTop: "10px",
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

export default ExamRanking;

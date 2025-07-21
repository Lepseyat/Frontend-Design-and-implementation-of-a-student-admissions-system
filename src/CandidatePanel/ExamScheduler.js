import React, { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function ExamScheduler() {
  const [specialty, setSpecialty] = useState('');
  const [specialties] = useState(['SIT', 'KST',]);
  const [exams, setExams] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [candidateId, setCandidateId] = useState(null);
  const navigate = useNavigate();

  // Decode JWT to get candidateId
  useEffect(() => {
    const token = localStorage.getItem('jwtToken');
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        const userId = decodedToken?.sub;
        if (userId) setCandidateId(userId);
        else setError('Invalid token: User ID not found.');
      } catch {
        setError('Failed to decode token.');
      }
    } else {
      setError('No authentication token found.');
    }
  }, []);

  // Fetch exams when specialty is selected
  useEffect(() => {
    if (!specialty) return;

    setLoading(true);
    axios
      .get(`http://localhost:8080/api/exam/by-specialty/${specialty}`)
      .then((response) => {
        setExams(response.data);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to fetch exams');
        setLoading(false);
      });
  }, [specialty]);

  const handleRequestExam = (exam) => {
    navigate('/exam-request', { state: { exam, candidateId } });
  };

  return (
    <div style={styles.container}>
      <div style={styles.examWrapper}>
        <header style={styles.header}>
          <h1 style={styles.headerText}>Available Exams</h1>
        </header>

        <div style={{ marginTop: '70px', marginBottom: '20px' }}>
          <label htmlFor="specialty">Select Specialty:</label>
          <select
            id="specialty"
            value={specialty}
            onChange={(e) => setSpecialty(e.target.value)}
            style={styles.select}
          >
            <option value="">-- Choose a specialty --</option>
            {specialties.map((spec) => (
              <option key={spec} value={spec}>
                {spec}
              </option>
            ))}
          </select>
        </div>

        {loading && <p style={styles.loading}>Loading exams...</p>}
        {error && <p style={styles.error}>{error}</p>}

        {!loading && exams.length === 0 && specialty && <p>No exams available for {specialty}.</p>}

        {!loading && exams.length > 0 && (
          <ul style={styles.examList}>
            {exams.map((exam) => (
              <li key={exam.id} style={styles.examItem}>
                <h3>{exam.subject}</h3>
                <p>Scheduled for: {new Date(exam.examDateTime).toLocaleString()}</p>
                <button
                  onClick={() => handleRequestExam(exam)}
                  disabled={exam.requested}
                  style={exam.requested ? styles.disabledButton : styles.button}
                >
                  {exam.requested ? 'Request Pending' : 'Request Exam'}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

// Add styling for the dropdown
const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#f9f9f9',
    paddingTop: '40px',
  },
  examWrapper: {
    textAlign: 'center',
    padding: '20px',
    width: '100%',
    maxWidth: '800px',
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
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
    margin: 0,
  },
  headerText: {
    color: '#fff',
    fontSize: '2rem',
    fontWeight: 'bold',
    margin: 0,
  },
  select: {
    marginTop: '10px',
    padding: '8px',
    fontSize: '1rem',
    borderRadius: '5px',
    border: '1px solid #ccc',
    width: '100%',
    maxWidth: '300px',
  },
  examList: {
    listStyleType: 'none',
    paddingLeft: 0,
    marginTop: '20px',
  },
  examItem: {
    marginBottom: '15px',
    padding: '15px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
    backgroundColor: '#f9f9f9',
    textAlign: 'left',
  },
  button: {
    backgroundColor: '#007bff',
    color: 'white',
    padding: '10px 20px',
    border: 'none',
    cursor: 'pointer',
    borderRadius: '5px',
    transition: 'background-color 0.3s ease',
    marginTop: '10px',
    width: '100%',
  },
  disabledButton: {
    backgroundColor: '#ccc',
    color: 'white',
    padding: '10px 20px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'not-allowed',
    marginTop: '10px',
    width: '100%',
  },
  loading: {
    fontSize: '1.2rem',
    color: '#555',
  },
  error: {
    color: 'red',
    fontWeight: 'bold',
    marginTop: '20px',
  },
};

export default ExamScheduler;

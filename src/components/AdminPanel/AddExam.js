import React, { useState } from 'react';
import axios from 'axios';
import { DateTime } from "luxon";

function AddExam() {
  const [subject, setSubject] = useState('');
  const [examDateTime, setExamDateTime] = useState('');
  const [error, setError] = useState('');
  const [specialty, setSpecialty] = useState('');


  const handleSubmit = (e) => {
  e.preventDefault();
  setError('');

  const formattedDateTime = DateTime.fromISO(examDateTime, { zone: "local" })
    .toFormat("yyyy-MM-dd'T'HH:mm:ss");

  const examData = {
    subject,
    specialty,
    examDateTime: formattedDateTime,
  };

  axios.post('http://localhost:8080/api/exam/create', examData, {
    headers: {
      'Content-Type': 'application/json',
    },
  })
  .then(response => {
    alert('Exam created successfully!');
    setSubject('');
    setSpecialty('');
    setExamDateTime('');
  })
  .catch(error => {
    if (error.response) {
      setError(`Failed to create exam: ${JSON.stringify(error.response.data)}`);
    } else {
      setError('Unknown error');
    }
  });
};

  
  return (
    <div style={styles.container}>
      <h2>Create Exam</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.field}>
          <label style={styles.label}>Subject:</label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            style={styles.input}
            required
          />
        </div>
        <div style={styles.field}>
          <label style={styles.label}>Specialty:</label>
          <select
            value={specialty}
            onChange={(e) => setSpecialty(e.target.value)}
            style={styles.input}
            required
          >
            <option value="">-- Select Specialty --</option>
            <option value="SIT">Software and Internet Technologies (SIT)</option>
            <option value="KST">Knowledge and Software Technologies (KST)</option>
            <option value="CS">Computer Science (CS)</option>
          </select>
        </div>
        <div style={styles.field}>
          <label style={styles.label}>Exam Date and Time:</label>
          <input
            type="datetime-local"
            value={examDateTime}
            onChange={(e) => setExamDateTime(e.target.value)}
            style={styles.input}
            required
          />
        </div>
        {error && <p style={styles.error}>{error}</p>}
        <button type="submit" style={styles.button}>Create Exam</button>
      </form>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '10vh',
    backgroundColor: '#f9f9f9',
    padding: '20px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    width: '400px',
    padding: '2rem',
    borderRadius: '8px',
    border: '1px solid #ccc',
    backgroundColor: '#fff',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    marginBottom: '1rem',
  },
  label: {
    fontSize: '1rem',
    color: '#333',
    marginBottom: '0.5rem',
  },
  input: {
    padding: '0.75rem',
    fontSize: '1rem',
    borderRadius: '5px',
    border: '1px solid #ddd',
    outline: 'none',
  },
  button: {
    padding: '0.75rem',
    fontSize: '1.1rem',
    color: '#fff',
    backgroundColor: '#4CAF50',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  },
  buttonHover: {
    backgroundColor: '#45a049',
  },
  error: {
    color: '#d9534f',
    fontSize: '1rem',
    textAlign: 'center',
    margin: '0.5rem 0',
  },
};

export default AddExam;

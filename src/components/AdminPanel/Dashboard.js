import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { DateTime } from "luxon";

function Dashboard() {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingExam, setEditingExam] = useState(null);
  const [updatedExam, setUpdatedExam] = useState({ subject: "", examDateTime: "" });

  useEffect(() => {
    fetchExams();
  }, []);

  const fetchExams = () => {
    axios.get('http://localhost:8080/api/exam/list')
      .then(response => {
        setExams(response.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to fetch exams.");
        setLoading(false);
      });
  };

  const handleEditClick = (exam) => {
    setEditingExam(exam.id);
    setUpdatedExam({ 
      subject: exam.subject, 
      examDateTime: DateTime.fromISO(exam.examDateTime).toFormat("yyyy-MM-dd'T'HH:mm") 
    });
  };

  const handleUpdate = (examId) => {
    const formattedDateTime = DateTime.fromISO(updatedExam.examDateTime, { zone: "local" })
      .toFormat("yyyy-MM-dd'T'HH:mm:ss");

    axios.put(`http://localhost:8080/api/exam/${examId}/update`, {
      subject: updatedExam.subject,
      examDateTime: formattedDateTime,
    })
    .then(() => {
      setEditingExam(null);
      fetchExams();
    })
    .catch(error => console.error('Error updating exam:', error));
  };

  const handleDelete = (examId) => {
    axios.delete(`http://localhost:8080/api/exam/${examId}/delete`)
      .then(() => {
        setExams(prevExams => prevExams.filter(exam => exam.id !== examId));
      })
      .catch(error => console.error('Error deleting exam:', error));
  };

  if (loading) return <div>Loading exams...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div style={styles.container}>
      <h1>Admin Dashboard</h1>
      <p>Manage exams</p>

      <table style={styles.table}>
        <thead>
          <tr>
            <th>Specialty</th>
            <th>Exam Subject</th>
            <th>Exam Date & Time</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {exams.length === 0 ? (
            <tr><td colSpan="4">No exams available</td></tr>
          ) : (
            exams.map(exam => (
              <tr key={exam.id}>
                <th>{exam.specialty}</th>
                <th>{exam.subject}</th>
                <th>{DateTime.fromISO(exam.examDateTime).toLocaleString(DateTime.DATETIME_MED)}</th>
                <th>
                  <button style={styles.editButton} onClick={() => handleEditClick(exam)}>Edit</button>
                  <button style={styles.deleteButton} onClick={() => handleDelete(exam.id)}>Delete</button>
                </th>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Edit Exam Modal */}
      {editingExam !== null && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <h2>Edit Exam</h2>
            <form style={styles.form}>
              <div style={styles.field}>
                <label style={styles.label}>Subject:</label>
                <input
                  type="text"
                  value={updatedExam.subject}
                  onChange={(e) => setUpdatedExam({ ...updatedExam, subject: e.target.value })}
                  style={styles.input}
                  required
                />
              </div>
              <div style={styles.field}>
                <label style={styles.label}>Exam Date and Time:</label>
                <input
                  type="datetime-local"
                  value={updatedExam.examDateTime}
                  onChange={(e) => setUpdatedExam({ ...updatedExam, examDateTime: e.target.value })}
                  style={styles.input}
                  required
                />
              </div>
              <div style={styles.buttonGroup}>
                <button type="button" style={styles.saveButton} onClick={() => handleUpdate(editingExam)}>Save</button>
                <button type="button" style={styles.cancelButton} onClick={() => setEditingExam(null)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'start',
    justifyContent: 'flex-start',
    padding: '20px 5%',
    width: '100%',
    backgroundColor: '#f9f9f9',
  },
  table: {
    width: '80%',
    borderCollapse: 'collapse',
    backgroundColor: '#fff',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  },
  editButton: {
    marginRight: '10px',
    padding: '8px 12px',
    backgroundColor: '#4CAF50',
    color: '#fff',
    border: 'none',
    cursor: 'pointer',
    borderRadius: '5px',
  },
  deleteButton: {
    padding: '8px 12px',
    backgroundColor: '#d9534f',
    color: '#fff',
    border: 'none',
    cursor: 'pointer',
    borderRadius: '5px',
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modal: {
    width: '400px',
    backgroundColor: '#fff',
    padding: '2rem',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
    textAlign: 'center',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
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
  buttonGroup: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  saveButton: {
    padding: '0.75rem',
    fontSize: '1.1rem',
    color: '#fff',
    backgroundColor: '#4CAF50',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  cancelButton: {
    padding: '0.75rem',
    fontSize: '1.1rem',
    color: '#fff',
    backgroundColor: '#d9534f',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
};

export default Dashboard;

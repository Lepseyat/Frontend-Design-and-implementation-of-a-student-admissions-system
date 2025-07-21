import React from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Dashboard from './Dashboard';
import AddExam from './AddExam';
import ManageExamRequests from './ManageExamRequests';
import ManageAcceptedExams from './ManageAcceptedExams';
import ExamRanking from './ExamRanking';

function AdminPanel() {
  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.clear();
    navigate('/login');
  };

  return (
    <div style={styles.container}>
      <aside style={styles.sidebar}>
        <h2>Admin Panel</h2>
        <nav style={styles.nav}>
          <button onClick={() => navigate('/admin/dashboard')} style={styles.button}>
            Dashboard
          </button>
          <button onClick={() => navigate('/admin/add exam')} style={styles.button}>
            Add an exam
          </button>
          <button onClick={() => navigate('/admin/manage exam requests')} style={styles.button}>
            Manage exams
          </button>
          <button onClick={() => navigate('/admin/manage accepted exams')} style={styles.button}>
            Manage accepted exams
          </button>
          <button onClick={() => navigate('/admin/exam ranking')} style={styles.button}>
            Exam Ranking
          </button>
          <button onClick={handleLogout} style={{ ...styles.button, backgroundColor: 'red' }}>
            Logout
          </button>
        </nav>
      </aside>
      <main style={styles.main}>
        <Routes>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="add exam" element={<AddExam />} />
          <Route path="manage exam requests" element={<ManageExamRequests />} />
          <Route path="manage accepted exams" element={<ManageAcceptedExams />} />
          <Route path="exam ranking" element={<ExamRanking />} />
        </Routes>
      </main>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    height: '100vh',
  },
  sidebar: {
    width: '250px',
    backgroundColor: '#333',
    color: '#fff',
    padding: '1rem',
  },
  nav: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  button: {
    padding: '0.5rem',
    fontSize: '1rem',
    borderRadius: '4px',
    border: 'none',
    cursor: 'pointer',
    color: '#fff',
    backgroundColor: '#007bff',
  },
  main: {
    flex: 1,
    padding: '1rem',
  },
};

export default AdminPanel;

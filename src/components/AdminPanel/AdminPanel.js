import React from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Dashboard from './Dashboard';
import Users from './Users';
import Settings from './Settings';

function AdminPanel() {
  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.clear(); // Clear session storage
    navigate('/login'); // Redirect to login page
  };

  return (
    <div style={styles.container}>
      <aside style={styles.sidebar}>
        <h2>Admin Panel</h2>
        <nav style={styles.nav}>
          <button onClick={() => navigate('/admin/dashboard')} style={styles.button}>
            Dashboard
          </button>
          <button onClick={() => navigate('/admin/users')} style={styles.button}>
            Users
          </button>
          <button onClick={() => navigate('/admin/settings')} style={styles.button}>
            Settings
          </button>
          <button onClick={handleLogout} style={{ ...styles.button, backgroundColor: 'red' }}>
            Logout
          </button>
        </nav>
      </aside>
      <main style={styles.main}>
        <Routes>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="users" element={<Users />} />
          <Route path="settings" element={<Settings />} />
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

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import Modal from 'react-modal';

Modal.setAppElement('#root'); // Required for accessibility

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetMessage, setResetMessage] = useState('');
  const API_BASE_URL = 'http://localhost:8080';
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const { token } = await response.json();
        localStorage.setItem('jwtToken', token);
        const decodedToken = jwtDecode(token);
        const userId = decodedToken.sub;
        const role = decodedToken.role;

        sessionStorage.setItem('userId', userId);
        sessionStorage.setItem('role', role);

        alert('Login successful!');
        navigate(role === 'ADMIN' ? '/admin' : '/profile');
      } else if (response.status === 401) {
        setError('Invalid credentials. Please try again.');
      } else {
        setError('An error occurred. Please try again later.');
      }
    } catch (err) {
      setError('Unable to connect to the server. Please try again later.');
    }
  };

  const handleRequestPasswordReset = async () => {
    setResetMessage('');
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setResetMessage('Password reset email sent. Check your inbox.');
      } else {
        setResetMessage('Failed to send reset email. Try again later.');
      }
    } catch (err) {
      setResetMessage('Network error. Please try again later.');
    }
  };

  const handleGoToRegistration = () => {
    navigate('/registration');
  };

  return (
    <div style={styles.container}>
      <h2>Log in</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <label style={styles.label}>
          Username:
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={styles.input}
            required
          />
        </label>
        <label style={styles.label}>
          Password:
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
            required
          />
        </label>
        {error && <p style={styles.error}>{error}</p>}
        <button type="button" onClick={handleGoToRegistration} style={styles.button}>
          Register Here
        </button>
        <button type="submit" style={styles.button}>Log in</button>
        <button
          type="button"
          onClick={() => setShowResetModal(true)}
          style={{ ...styles.button, backgroundColor: '#6c757d' }}
        >
          Forgot Password?
        </button>
      </form>

      <Modal
        isOpen={showResetModal}
        onRequestClose={() => setShowResetModal(false)}
        contentLabel="Reset Password"
        style={{
          content: {
            width: '400px',
            margin: 'auto',
            padding: '2rem',
            borderRadius: '8px',
            textAlign: 'center'
          }
        }}
      >
        <h3>Reset Password</h3>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={styles.input}
        />
        <div style={{ marginTop: '1rem' }}>
          <button onClick={handleRequestPasswordReset} style={styles.button}>Send Email</button>
          <button
            onClick={() => setShowResetModal(false)}
            style={{ ...styles.button, backgroundColor: '#dc3545', marginLeft: '1rem' }}
          >
            Cancel
          </button>
        </div>
        {resetMessage && <p style={{ marginTop: '1rem', color: 'green' }}>{resetMessage}</p>}
      </Modal>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    backgroundColor: '#f0f2f5',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    width: '300px',
    padding: '2rem',
    border: '1px solid #ddd',
    borderRadius: '8px',
    backgroundColor: '#fff',
  },
  label: {
    display: 'flex',
    flexDirection: 'column',
    fontSize: '1rem',
    color: '#333',
  },
  input: {
    padding: '0.5rem',
    fontSize: '1rem',
    borderRadius: '4px',
    border: '1px solid #ddd',
  },
  button: {
    padding: '0.5rem',
    fontSize: '1rem',
    borderRadius: '4px',
    border: 'none',
    color: '#fff',
    backgroundColor: '#007bff',
    cursor: 'pointer',
  },
  error: {
    color: 'red',
    fontSize: '0.9rem',
  },
};

export default Login;

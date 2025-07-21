import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token'); // Retrieve the token from the URL
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent form submission from causing a page reload
  
    // Check if password fields are empty
    if (!newPassword || !confirmPassword) {
      setMessage('Password fields cannot be empty.');
      return;
    }
  
    // Check if the passwords match
    if (newPassword !== confirmPassword) {
      setMessage('Passwords do not match.');
      return;
    }
  
    // Check if password is at least 8 characters long
    if (newPassword.length < 8) {
      setMessage('Password must be at least 8 characters long.');
      return;
    }
  
    // Password strength validation regex checks
    const upperCase = /[A-Z]/;  // At least 1 uppercase letter
    const lowerCase = /[a-z]/;  // At least 1 lowercase letter
    const digit = /\d/;         // At least 1 digit
    const symbol = /[!@#$%^&*(),.?":{}|<>]/;  // At least 1 symbol
  
    // Check if password meets the required criteria
    if (!upperCase.test(newPassword)) {
      setMessage('Password must contain at least one uppercase letter.');
      return;
    }
  
    if (!lowerCase.test(newPassword)) {
      setMessage('Password must contain at least one lowercase letter.');
      return;
    }
  
    if (!digit.test(newPassword)) {
      setMessage('Password must contain at least one digit.');
      return;
    }
  
    if (!symbol.test(newPassword)) {
      setMessage('Password must contain at least one special character (e.g., @, #, $, etc.).');
      return;
    }
  
    // If all checks pass, proceed with the password reset logic
    try {
      // Making the API call to reset the password
      const res = await fetch('http://localhost:8080/api/auth/reset-password/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword }),
      });
  
      if (res.ok) {
        setMessage('Password successfully reset! You can now log in.');
        setTimeout(() => navigate('/login'), 2000);  // Redirect after a short time
      } else {
        const errText = await res.text();
        setMessage('Reset failed: ' + errText);
      }
    } catch (err) {
      setMessage('Something went wrong. Try again later.');
    }
  };
  

  return (
    <div style={styles.container}>
      <h2>Reset Your Password</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.field}>
          <label style={styles.label}>New Password:</label>
          <input
            type="password"
            placeholder="Enter new password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            style={styles.input}
            required
          />
        </div>

        <div style={styles.field}>
          <label style={styles.label}>Confirm Password:</label>
          <input
            type="password"
            placeholder="Confirm your password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            style={styles.input}
            required
          />
        </div>

        {message && <p style={styles.error}>{message}</p>}
        <button type="submit" style={styles.button}>Submit</button>
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
    minHeight: '100vh',
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

export default ResetPassword;

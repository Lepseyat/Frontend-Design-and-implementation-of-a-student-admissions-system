import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Registration() {
  const [username, setUsername] = useState('');
  const [surname, setSurname] = useState('');
  const [lastName, setLastName] = useState('');
  const [egn, setEgn] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Registration Details:
    Username: ${username}
    Surname: ${surname}
    Last Name: ${lastName}
    EGN: ${egn}
    Phone Number: ${phoneNumber}
    Email: ${email}`);
  };

  const navigate = useNavigate();

  const handleGoToSignIn = () => {
    navigate('/');
  };

  return (
    <div style={styles.container}>
      <h2>Registration</h2>
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
          Surname:
          <input
            type="text"
            value={surname}
            onChange={(e) => setSurname(e.target.value)}
            style={styles.input}
            required
          />
        </label>
        <label style={styles.label}>
          Last Name:
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            style={styles.input}
            required
          />
        </label>
        <label style={styles.label}>
          EGN:
          <input
            type="text"
            value={egn}
            onChange={(e) => setEgn(e.target.value)}
            style={styles.input}
            required
          />
        </label>
        <label style={styles.label}>
          Phone Number:
          <input
            type="text"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            style={styles.input}
            required
          />
        </label>
        <label style={styles.label}>
          Email:
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
            required
          />
        </label>
        <button type="button" onClick={handleGoToSignIn} style={styles.linkButton}>
          Already have an account? Sign In
        </button>
        <button type="submit" style={styles.button}>Register</button>
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
  linkButton: {
    backgroundColor: 'transparent',
    color: '#007bff',
    fontSize: '1rem',
    cursor: 'pointer',
    border: 'none',
    textDecoration: 'underline',
    alignSelf: 'flex-start',
    padding: '0',
  },
};

export default Registration;

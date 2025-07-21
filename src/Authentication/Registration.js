import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Registration() {
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    lastname: '',
    email: '',
    egn: '',
    phone: '',
    latinName: '',
    latinSurname: '',
    latinLastname: '',
    dateOfBirth: '',
    placeOfBirth: '',
    idNumber: '',
    dateIdCreated: '',
    idIssuedBy: '',
    address: '',
    city: '',
    municipality: '',
    district: '',
    schoolName: '',
    schoolCity: '',
    secondaryEducation: '',
  });
  const [error, setError] = useState('');
  const API_BASE_URL = 'http://localhost:8080';
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/registration`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert('Registration successful!');
        navigate('/login'); // Navigate to login after successful registration
      } else {
        const errorText = await response.text();
        setError(errorText);
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <div style={styles.container}>
      <h2>Register</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        {/* Name, Surname, Last Name */}
        <div style={styles.fieldGroup}>
          <label style={styles.label}>
            Name:
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              style={styles.input}
              required
            />
          </label>
          <label style={styles.label}>
            Surname:
            <input
              type="text"
              name="surname"
              value={formData.surname}
              onChange={handleChange}
              style={styles.input}
              required
            />
          </label>
          <label style={styles.label}>
            Last Name:
            <input
              type="text"
              name="lastname"
              value={formData.lastname}
              onChange={handleChange}
              style={styles.input}
              required
            />
          </label>
        </div>

        {/* Email */}
        <label style={styles.label}>
          Email:
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            style={styles.input}
            required
          />
        </label>

        {/* Other Fields */}
        <label style={styles.label}>
          EGN:
          <input
            type="text"
            name="egn"
            value={formData.egn}
            onChange={handleChange}
            style={styles.input}
          />
        </label>
        <label style={styles.label}>
          Phone:
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            style={styles.input}
          />
        </label>

        {/* Date and Place of Birth */}
        <div style={styles.fieldGroup}>
          <label style={styles.label}>
            Date of Birth:
            <input
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleChange}
              style={styles.input}
            />
          </label>
          <label style={styles.label}>
            Place of Birth:
            <input
              type="text"
              name="placeOfBirth"
              value={formData.placeOfBirth}
              onChange={handleChange}
              style={styles.input}
            />
          </label>
        </div>

        {/* ID Information */}
        <div style={styles.fieldGroup}>
          <label style={styles.label}>
            ID Number:
            <input
              type="text"
              name="idNumber"
              value={formData.idNumber}
              onChange={handleChange}
              style={styles.input}
            />
          </label>
          <label style={styles.label}>
            Date ID Created:
            <input
              type="date"
              name="dateIdCreated"
              value={formData.dateIdCreated}
              onChange={handleChange}
              style={styles.input}
            />
          </label>
          <label style={styles.label}>
            ID Issued By:
            <input
              type="text"
              name="idIssuedBy"
              value={formData.idIssuedBy}
              onChange={handleChange}
              style={styles.input}
            />
          </label>
        </div>

        {/* Address and Education */}
        <div style={styles.fieldGroup}>
          <label style={styles.label}>
            Address:
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              style={styles.input}
            />
          </label>
          <label style={styles.label}>
            City:
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              style={styles.input}
            />
          </label>
          <label style={styles.label}>
            Municipality:
            <input
              type="text"
              name="municipality"
              value={formData.municipality}
              onChange={handleChange}
              style={styles.input}
            />
          </label>
          <label style={styles.label}>
            District:
            <input
              type="text"
              name="district"
              value={formData.district}
              onChange={handleChange}
              style={styles.input}
            />
          </label>
        </div>

        {/* School Details */}
        <div style={styles.fieldGroup}>
          <label style={styles.label}>
            School Name:
            <input
              type="text"
              name="schoolName"
              value={formData.schoolName}
              onChange={handleChange}
              style={styles.input}
            />
          </label>
          <label style={styles.label}>
            School City:
            <input
              type="text"
              name="schoolCity"
              value={formData.schoolCity}
              onChange={handleChange}
              style={styles.input}
            />
          </label>
          <label style={styles.label}>
            Secondary Education:
            <input
              type="text"
              name="secondaryEducation"
              value={formData.secondaryEducation}
              onChange={handleChange}
              style={styles.input}
            />
          </label>
        </div>

        {/* Error Message */}
        {error && <p style={styles.error}>{error}</p>}

        {/* Submit Button */}
        <button type="submit" style={styles.button}>Register</button>
      </form>
      <button
        type="button"
        onClick={() => navigate('/login')}
        style={styles.button}
      >
        Already have an account? Sign In
      </button>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start', // Change to flex-start to allow for more space
    minHeight: '100vh', // Use minHeight to ensure it can expand to fit the content
    backgroundColor: '#f0f2f5',
  },  
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    width: '400px',
    padding: '2rem',
    border: '1px solid #ddd',
    borderRadius: '8px',
    backgroundColor: '#fff',
    maxHeight: '80vh', // Limit the height of the form
    overflowY: 'auto', // Enable scrolling if the content exceeds the height
  },
  fieldGroup: {
    display: 'flex',
    flexDirection: 'column', // Changed to column to better fit single-field inputs
    gap: '1rem',
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
    width: '100%', // Full width for input fields
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

export default Registration;

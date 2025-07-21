import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [resetMessage, setResetMessage] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("jwtToken");
        if (!token) throw new Error("No authentication token found.");

        const decodedToken = jwtDecode(token);
        const userId = decodedToken.sub;
        if (!userId) throw new Error("User ID not found in token.");

        const response = await fetch(`http://localhost:8080/candidates/${userId}`, {
          headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        });

        if (!response.ok) throw new Error("Failed to fetch profile data.");
        const data = await response.json();
        setProfile(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleScheduleExam = () => navigate("/exam-scheduler");
  const handleCheckResults = () => navigate("/candidate-results");
  const handleViewPendingExams = () => navigate("/pending-exams");
  const handleLogout = () => {
    localStorage.removeItem("jwtToken");
    navigate("/");
  };

  const handleResetPassword = async () => {
    try {
      const token = localStorage.getItem("jwtToken");
      if (!token) throw new Error("No authentication token found.");

      const decodedToken = jwtDecode(token);
      const email = decodedToken.username; // Assuming the email is in the decoded token

      // Send request to reset password
      const response = await fetch("http://localhost:8080/api/auth/reset-password", {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setResetMessage("Password reset link sent to your email!");
      } else {
        const errText = await response.text();
        setResetMessage("Failed to send reset link: " + errText);
      }
    } catch (error) {
      setResetMessage("Error sending password reset email: " + error.message);
    }
  };

  if (loading) return <div style={styles.loading}>Loading...</div>;
  if (error) return <div style={styles.error}>Error: {error}</div>;
  if (!profile) return <div style={styles.noProfile}>No profile data available.</div>;

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.headerText}>User Profile</h1>
      </header>
      <div style={styles.profileContent}>
        <p><strong>Name:</strong> {profile.name} {profile.surname}</p>
        <p><strong>Email:</strong> {profile.email}</p>
        <p><strong>Username:</strong> {profile.username}</p>

        <div style={styles.buttonContainer}>
          <button style={styles.button} onClick={handleScheduleExam}>Schedule Exam</button>
          <button style={styles.button} onClick={handleViewPendingExams}>View Pending Exams</button> 
          <button style={styles.button} onClick={handleCheckResults}>Check Results</button>
          <button style={styles.button} onClick={handleLogout}>Logout</button>
        </div>

        <div style={styles.buttonContainer}>
          <button style={styles.button} onClick={handleResetPassword}>Reset Password</button>
        </div>

        {resetMessage && <p style={styles.resetMessage}>{resetMessage}</p>}
      </div>
    </div>
  );
};

// Styles
const styles = {
  container: {
    display: "flex", flexDirection: "column", alignItems: "center", minHeight: "100vh", backgroundColor: "#f9f9f9", paddingTop: "40px"
  },
  header: {
    backgroundColor: "#007bff", padding: "20px 0", width: "100%", textAlign: "center", position: "fixed", top: 0, left: 0, zIndex: 10
  },
  headerText: { color: "#fff", fontSize: "2rem", fontWeight: "bold", margin: "0" },
  profileContent: {
    backgroundColor: "#fff", padding: "2rem", borderRadius: "8px", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", width: "100%", maxWidth: "500px", textAlign: "center", marginTop: "80px"
  },
  buttonContainer: { display: "flex", justifyContent: "center", gap: "1rem", marginTop: "2rem" },
  button: {
    padding: "0.8rem", fontSize: "1rem", borderRadius: "4px", border: "none", color: "#fff", backgroundColor: "#007bff", cursor: "pointer", width: "180px", transition: "background-color 0.3s ease"
  },
  loading: { fontSize: "1.2rem", color: "#555" },
  error: { fontSize: "1.2rem", color: "red" },
  noProfile: { fontSize: "1.2rem", color: "#555" },
  resetMessage: {
    color: "#28a745",
    fontSize: "1rem",
    marginTop: "1rem",
  },
};

export default Profile;

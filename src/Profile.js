import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode"; // Import the jwt-decode library
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation

const Profile = () => {
  const [profile, setProfile] = useState(null); // State to store user profile data
  const [loading, setLoading] = useState(true); // State to manage loading status
  const [error, setError] = useState(null); // State to manage errors

  const navigate = useNavigate(); // Hook to handle navigation

  // Fetch profile data when the component loads
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // Get JWT from localStorage
        const token = localStorage.getItem("jwtToken");

        if (!token) {
          throw new Error("No authentication token found. Please log in.");
        }

        // Decode the JWT token to get the user ID (which is in the 'sub' field)
        const decodedToken = jwtDecode(token);
        console.log("Decoded Token: ", decodedToken); // Log the decoded token to verify the structure

        const userId = decodedToken.sub; // Use 'sub' to get the user ID
        if (!userId) {
          throw new Error("User ID not found in the token.");
        }

        // Make the API request with the JWT in the Authorization header
        const response = await fetch(`http://localhost:8080/candidates/${userId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          if (response.status === 401) {
            throw new Error("Unauthorized. Please log in again.");
          } else {
            throw new Error("Failed to fetch profile data.");
          }
        }

        const data = await response.json();
        setProfile(data); // Update the state with fetched profile data
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false); // Stop the loading spinner
      }
    };

    fetchProfile();
  }, []);

  // Button actions for scheduling exam, checking results, and logging out
  const handleScheduleExam = () => {
    navigate("/exam-scheduler"); // Navigate to exam scheduler page
  };

  const handleCheckResults = () => {
    navigate("/results"); // Navigate to results page (make sure this route exists)
  };

  const handleUploadFiles = () => {
    navigate("/upload-files");
  };

  const handleLogout = () => {
    localStorage.removeItem("jwtToken"); // Remove token on logout
    navigate("/"); // Navigate back to the login page
  };

  if (loading) {
    return <div style={styles.loading}>Loading...</div>;
  }

  if (error) {
    return <div style={styles.error}>Error: {error}</div>;
  }

  if (!profile) {
    return <div style={styles.noProfile}>No profile data available.</div>;
  }

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.headerText}>User Profile</h1>
      </header>
      <div style={styles.profileContent}>
        <p><strong>Name:</strong> {profile.name} {profile.surname}</p>
        <p><strong>Email:</strong> {profile.email}</p>
        <p><strong>Username:</strong> {profile.username}</p>

        {/* Horizontal button layout */}
        <div style={styles.buttonContainer}>
          <button style={styles.button} onClick={handleScheduleExam}>
            Schedule Exam
          </button>
          <button style={styles.button} onClick={handleCheckResults}>
            Check Results
          </button>
          <button style={styles.button} onClick={handleUploadFiles}>
            Upload Files
          </button>
          <button style={styles.button} onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

// Styles for buttons and layout
const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start', // Ensure content starts from top
    minHeight: '100vh',
    backgroundColor: '#f9f9f9',
    paddingTop: '40px', // Add some padding at the top for spacing
    paddingBottom: '1rem', // Bottom padding to prevent content from sticking to the bottom
  },
  header: {
    backgroundColor: '#007bff',
    padding: '20px 0',
    width: '100%',
    textAlign: 'center',
    position: 'fixed', // Fixed header at the top
    top: 0, // Position at the top of the page
    left: 0, // Ensure it's left-aligned
    zIndex: 10, // Ensure the header is above other content
  },
  headerText: {
    color: '#fff',
    fontSize: '2rem',
    fontWeight: 'bold',
    margin: '0', // Remove margin for the header to stick at the top
  },
  profileContent: {
    backgroundColor: '#fff',
    padding: '2rem',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    width: '100%',
    maxWidth: '500px',
    textAlign: 'center',
    marginTop: '80px', // Adjust content to be below the fixed header
  },
  buttonContainer: {
    display: 'flex', // Change from column to row for horizontal buttons
    justifyContent: 'center', // Center buttons horizontally
    gap: '1rem', // Space between buttons
    marginTop: '2rem',
  },
  button: {
    padding: '0.8rem',
    fontSize: '1rem',
    borderRadius: '4px',
    border: 'none',
    color: '#fff',
    backgroundColor: '#007bff',
    cursor: 'pointer',
    width: '150px', // Set width for consistent button size
    transition: 'background-color 0.3s ease',
  },
  loading: {
    fontSize: '1.2rem',
    color: '#555',
  },
  error: {
    fontSize: '1.2rem',
    color: 'red',
  },
  noProfile: {
    fontSize: '1.2rem',
    color: '#555',
  },
};

export default Profile;

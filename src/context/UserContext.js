import { createContext } from "react";

// Create a UserContext with default values (you can adjust this as needed)
const UserContext = createContext({
  candidateId: null, // This is where the candidate ID will be stored
  setCandidateId: () => {}, // This is a placeholder for the setter function
});

export default UserContext;

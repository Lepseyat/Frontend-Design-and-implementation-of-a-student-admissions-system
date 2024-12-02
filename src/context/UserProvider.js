import React, { useState } from "react";
import UserContext from "./UserContext";

const UserProvider = ({ children }) => {
  const [candidateId, setCandidateId] = useState(null); // Initially no candidateId

  return (
    <UserContext.Provider value={{ candidateId, setCandidateId }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;

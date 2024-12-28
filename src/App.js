import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom'; 
import SignIn from './Login';
import Registration from './Register';
import UserProvider from "./context/UserProvider";
import ExamScheduler from './ExamScheduler';
import Profile from './Profile';

function App() {
  return (
    <UserProvider> {/* Wrap the app with UserProvider */}
      <div className="App">
        <Routes>
         <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<SignIn />} />
          <Route path="/register" element={<Registration />} />
          <Route path="/exam-scheduler" element={<ExamScheduler />} /> {/* New Route */}
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </div>
    </UserProvider>
  );
}

export default App;

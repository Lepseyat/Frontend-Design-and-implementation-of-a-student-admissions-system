import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import UserProvider from "./context/UserProvider";
import ProtectedRoute from './components/ProtectedRoute';

import AdminPanel from './components/AdminPanel/AdminPanel';

import Login from './Authentication/Login'; 
import Registration from './Authentication/Registration';
import ResetPassword from './Authentication/ResetPassword';

import CandidateResults from './CandidatePanel/CandidateResults';
import ExamRequest from './CandidatePanel/ExamRequest';
import ExamScheduler from './CandidatePanel/ExamScheduler';
import PendingExams from './CandidatePanel/PendingExams';
import Profile from './CandidatePanel/Profile';


function App() {
  return (
    <UserProvider> {}
      <div className="App">
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registration" element={<Registration />} />
          <Route path="/exam-scheduler" element={<ExamScheduler />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/admin/*" element={<ProtectedRoute><AdminPanel /></ProtectedRoute>} />
          <Route path="/exam-request" element={<ExamRequest />} />
          <Route path="/pending-exams" element={<PendingExams />} />
          <Route path="/candidate-results" element={<CandidateResults />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          

        </Routes>
      </div>
    </UserProvider>
  );
}

export default App;

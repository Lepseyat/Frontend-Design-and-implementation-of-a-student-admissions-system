import React from 'react';
import { Routes, Route } from 'react-router-dom';
import SignIn from './SignIn';
import Registration from './Registration';
import UserProvider from "./context/UserProvider"; // Import UserProvider
import ExamScheduler from './ExamScheduler'; // Import the ExamScheduler component

function App() {
  return (
    <UserProvider> {/* Wrap the app with UserProvider */}
      <div className="App">
        <Routes>
          <Route path="/" element={<SignIn />} />
          <Route path="/register" element={<Registration />} />
          <Route path="/exam-scheduler" element={<ExamScheduler />} /> {/* New Route */}
        </Routes>
      </div>
    </UserProvider>
  );
}

export default App;

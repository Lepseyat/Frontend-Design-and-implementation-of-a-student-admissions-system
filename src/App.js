import React from 'react';
import { Routes, Route } from 'react-router-dom';
import SignIn from './SignIn';
import Registration from './Registration';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<SignIn />} />
        <Route path="/register" element={<Registration />} />
      </Routes>
    </div>
  );
}

export default App;


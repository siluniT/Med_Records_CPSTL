// src/App.js
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// Corrected import path: ensure 'Pages' matches the actual folder casing
import Login from "./Pages/Login"; 
import AddNewPatient from "./Pages/AddNewPatient"; 
import ProfilePage from "./Pages/ProfilePage"; // Make sure this is imported
import Dashboard from "./Pages/Dashboard"; // Make sure this is imported


function App() {
  return (
    <Router>
      <div>
        <Routes>
          {/* Only the public login route is included */}
          <Route path="/" element={<Login />} />
          <Route path="/AddNewPatient" element={<AddNewPatient />} />
          <Route path="/ProfilePage" element={<ProfilePage />} />
          <Route path="/Dashboard" element={<Dashboard />} />

        </Routes>
      </div>
    </Router>
  );
}

export default App;
// App.js
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// Corrected import path: ensure 'Pages' matches the actual folder casing
import Login from "./Pages/Login"; 
import AddNewPatient from "./Pages/AddNewPatient"; 

function App() {
  return (
    <Router>
      <div>
        <Routes>
          {/* Only the public login route is included */}
          <Route path="/" element={<Login />} />
          <Route path="/AddNewPatient" element={<AddNewPatient />} />


        </Routes>
      </div>
    </Router>
  );
}

export default App;
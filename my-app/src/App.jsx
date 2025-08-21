// App.js
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// Corrected import path: ensure 'Pages' matches the actual folder casing
import Login from "./Pages/Login"; 

function App() {
  return (
    <Router>
      <div>
        <Routes>
          {/* Only the public login route is included */}
          <Route path="/" element={<Login />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
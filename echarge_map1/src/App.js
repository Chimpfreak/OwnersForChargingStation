import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import NavBar from './NavBar';
import MapComponent from './MapComponent';
import AddStation from './AddStation';
import StationsList from './StationsList';
import Login from './Login';
import Register from './Register';
import { AuthProvider, useAuth } from './AuthContent'; // Ensure this is correctly named and imported

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth(); // Use AuthContext to check auth status
  const navigate = useNavigate(); // Corrected to useNavigate

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login'); // Redirect to login if not authenticated
    }
  }, [isAuthenticated, navigate]);

  return isAuthenticated ? children : null; // Render children if authenticated
};

function App() {
  const [stations, setStations] = useState([]);

  useEffect(() => {
    axios.get(`http://localhost:5000/stations`)
      .then(response => {
        setStations(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the stations', error);
      });
  }, []); 
  return (
    <AuthProvider> {/* Wrap your app with AuthProvider */}
      <Router>
        <NavBar />
        <div className="container mt-3">
          <Routes>
            <Route path="/" element={<ProtectedRoute><MapComponent stations={stations} /></ProtectedRoute>} />
            <Route path="/add-station" element={<ProtectedRoute><AddStation /></ProtectedRoute>} />
            <Route path="/stationslist" element={<ProtectedRoute><StationsList stations={stations} /></ProtectedRoute>} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;

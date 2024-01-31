import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavBar from './NavBar';
import MapComponent from './MapComponent';
import AddStation from './AddStation';
import StationsList from './StationsList';

function App() {
  const [stations, setStations] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:3000/stations')
      .then(response => {
        setStations(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the stations', error);
      });
  }, []);

  return (
    <Router>
      <NavBar />
      <div className="container mt-3">
        <Routes>
          <Route path="/" element={<MapComponent stations={stations} />} />
          <Route path="/add-station" element={<AddStation />} />
          <Route path="/stationslist" element={<StationsList stations={stations}/>}/>
        </Routes>
      </div>
    </Router>
  );
}

export default App;

import React, { useState, useEffect } from 'react';
import axios from 'axios'; // or use 'fetch' if you prefer
import { useAuth } from './AuthContent';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

const customMarkerIcon = new L.Icon({
  iconUrl: 'https://i.ibb.co/MCMwgBZ/placeholder.png',
  iconSize: [41, 41], // Size of the icon
  iconAnchor: [12, 41], // Point of the icon which will correspond to marker's location
  popupAnchor: [1, -34], // Point from which the popup should open relative to the iconAnchor
});

const AddStation = () => {
  const { username } = useAuth();
  const [stationData, setStationData] = useState({
    name: '',
    latitude: '',
    longitude: '',
    charge: '',
    username: username
  });
  const [userLocation, setUserLocation] = useState([17.397528, 78.49025]);
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setStationData(stationData => ({
          ...stationData,
          latitude: latitude,
          longitude: longitude
        }));
        setUserLocation([latitude, longitude]);
      },
      () => {
        console.log("Unable to retrieve your location");
        // Set a default location if you want
        // setUserLocation([defaultLatitude, defaultLongitude]);
      }
    );
  }, []);

  const handleInputChange = (e) => {
    setStationData({ ...stationData, [e.target.name]: e.target.value });
  };
  const HandleMapClick = () => {
    useMapEvents({
      click: (e) => {
        setStationData({ ...stationData, latitude: e.latlng.lat, longitude: e.latlng.lng });
      },
    });
    return null;
  };

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevents the default form submission behavior
    axios.post('http://localhost:5000/stations', stationData)
      .then(response => {
        console.log(response.data); // Log the response
        // You can add redirection or a success message here
      })
      .catch(error => {
        console.error('Error adding station:', error);
        // Handle the error, show an error message, etc.
      });
  };

  return (
    <div className="container mt-5">
      <h2>Add Charging Station</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Station Name</label>
          <input
            type="text"
            className="form-control"
            name="name"
            value={stationData.name}
            onChange={handleInputChange}
            placeholder="Enter station name"
          />
        </div>
        <div className="form-group">
          <label>Latitude</label>
          <input
            type="text"
            className="form-control"
            name="latitude"
            value={stationData.latitude}
            onChange={handleInputChange}
            placeholder="Enter latitude"
          />
        </div>
        <div className="form-group">
          <label>Longitude</label>
          <input
            type="text"
            className="form-control"
            name="longitude"
            value={stationData.longitude}
            onChange={handleInputChange}
            placeholder="Enter longitude"
          />
        </div>
        <div className="form-group">
          <label>Charge Type</label>
          <input
            type="text"
            className="form-control"
            name="charge"
            value={stationData.charge}
            onChange={handleInputChange}
            placeholder="Enter charge type"
          />
        </div>
        <div className="form-group">
          <label>Map (Click to select location):</label>
          <MapContainer center={userLocation} zoom={13} style={{ height: '400px' }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <HandleMapClick />
            {stationData.latitude && stationData.longitude && (
              <Marker 
              position={[stationData.latitude, stationData.longitude]} 
              icon={customMarkerIcon} 
            />
            )}
          </MapContainer>
        </div>
        <button type="submit" className="btn btn-primary">Add Station</button>
      </form>
    </div>
  );
};

export default AddStation;

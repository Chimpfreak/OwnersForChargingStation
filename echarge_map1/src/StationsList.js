// StationsList.js
import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContent';
import Modal from 'react-modal';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

Modal.setAppElement('#root');

const customMarkerIcon = new L.Icon({
  iconUrl: 'https://i.ibb.co/MCMwgBZ/placeholder.png',
  iconSize: [41, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const customStyles = {
  content: {
    top: '20%',
    left: '20%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-20%',
    transform: 'translate(-20%, -20%)',
  },
};

function LocationMarker({ onLocationSelect }) {
  useMapEvents({
    click(e) {
      onLocationSelect(e.latlng);
    },
  });
  return null;
}

const StationsList = ({ stations, onEdit, onDelete }) => {
  const [showEditModal, setShowEditModal] = useState(false);
  // Initialize selectedStation as an object with empty default properties
  const [selectedStation, setSelectedStation] = useState({
    _id: '', name: '', latitude: 0, longitude: 0, charge: ''
  });
  const { username } = useAuth();

  const handleDelete = async (stationId) => {
    try {
      if (!username) {
        console.error('User is not logged in');
        return;
      }

      const response = await axios.delete(`http://localhost:5000/stations/${stationId}`, {
        data: { username: username }
      });
      console.log(response.data);
      onDelete(stationId);
    } catch (error) {
      console.error('Error deleting station', error);
    }
  };


  // Handle station edit
  const handleEdit = (station) => {
    setSelectedStation(station);
    setShowEditModal(true);
  };

  const closeModal = () => {
    setShowEditModal(false);
    setSelectedStation({ _id: '', name: '', latitude: 0, longitude: 0, charge: '' }); // Reset selectedStation on modal close
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedStation(prev => ({ ...prev, [name]: value }));
  };

  const handleLocationSelect = (latlng) => {
    setSelectedStation(prev => ({
      ...prev,
      latitude: latlng.lat,
      longitude: latlng.lng,
    }));
  };

  const handleEditSubmit = async (event) => {
    event.preventDefault();
    try {
      await axios.put(`http://localhost:5000/stations/${selectedStation._id}`, {
        ...selectedStation,
        username,
      });
      closeModal();
      onEdit(); // You may need to adjust this to properly refresh or update the list of stations displayed
    } catch (error) {
      console.error('Error updating station', error);
    }
  };

  return (
    <div>
      <h2 className="mt-3 mb-4">Stations List</h2>
      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Latitude</th>
            <th>Longitude</th>
            <th>Charge Type</th>
            <th>User</th>
            <th>Revenue</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {stations && stations.length > 0 ? (
            stations.map(station => (
              <tr key={station.name}>
                <td>{station.name}</td>
                <td>{station.latitude}</td>
                <td>{station.longitude}</td>
                <td>{station.charge}</td>
                <td>{station.username}</td>
                <td>0 $</td>
                <td>
                  <button
                    className="btn btn-primary btn-sm me-2"
                    onClick={() => handleEdit(station)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDelete(station._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6">No stations available</td>
            </tr>
          )}
        </tbody>
      </table>
      <Modal isOpen={showEditModal} onRequestClose={closeModal} style={customStyles} contentLabel="Edit Station">
        <h2>Edit Station</h2>
        <form onSubmit={handleEditSubmit}>
          {/* Form fields for station details */}
          <div className="form-group">
            <label>Station Name</label>
            <input type="text" className="form-control" name="name" value={selectedStation.name} onChange={handleInputChange} placeholder="Enter station name" />
          </div>
          <div className="form-group">
            <label>Latitude</label>
            <input type="text" className="form-control" name="latitude" value={selectedStation.latitude} onChange={handleInputChange} placeholder="Enter latitude" />
          </div>
          <div className="form-group">
            <label>Longitude</label>
            <input type="text" className="form-control" name="longitude" value={selectedStation.longitude} onChange={handleInputChange} placeholder="Enter longitude" />
          </div>
          <div className="form-group">
            <label>Charge Type</label>
            <input type="text" className="form-control" name="charge" value={selectedStation.charge} onChange={handleInputChange} placeholder="Enter charge type" />
          </div>
          <div className="form-group">
            <label>Map (Click to select location):</label>
            <MapContainer center={[selectedStation.latitude || 0, selectedStation.longitude || 0]} zoom={13} style={{ height: '400px' }}>
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <LocationMarker onLocationSelect={handleLocationSelect} />
              {selectedStation.latitude && selectedStation.longitude && (
                <Marker position={[selectedStation.latitude, selectedStation.longitude]} icon={customMarkerIcon} />
              )}
            </MapContainer>
          </div>
          <button type="submit" className="btn btn-primary">Submit</button>
        </form>
      </Modal>
    </div>
  );
};

export default StationsList;

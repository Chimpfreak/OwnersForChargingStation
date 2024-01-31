// StationsList.js
import React from 'react';
import axios from 'axios';
import { useAuth } from './AuthContent';

const StationsList = ({ stations, onEdit, onDelete }) => {
  // Handle station deletion
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
    // Implement the logic to navigate to the edit page or open a modal for editing
    onEdit(station);
  };

  return (
    <div>
      <h2 className="mt-3 mb-4">Stations List</h2>
      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Latitude</th>
            <th>Longitude</th>
            <th>Charge Type</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {stations && stations.length > 0 ? (
            stations.map(station => (
              <tr key={station.name}>
                <td>{station.id}</td>
                <td>{station.name}</td>
                <td>{station.latitude}</td>
                <td>{station.longitude}</td>
                <td>{station.charge}</td>
                <td>
                  <button
                    className="btn btn-primary btn-sm me-2"
                    onClick={() => handleEdit(station)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDelete(station)}
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
    </div>
  );
};

export default StationsList;

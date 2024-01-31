import React, { useState } from 'react';
import axios from 'axios'; // or use 'fetch' if you prefer

const AddStation = () => {
  const [stationData, setStationData] = useState({
    name: '',
    latitude: '',
    longitude: '',
    charge: ''
  });

  const handleInputChange = (e) => {
    setStationData({ ...stationData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevents the default form submission behavior
    axios.post('http://localhost:3000/stations', stationData)
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
        <button type="submit" className="btn btn-primary">Add Station</button>
      </form>
    </div>
  );
};

export default AddStation;

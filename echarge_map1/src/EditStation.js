import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom'; // Assuming you're using React Router for routing

const EditStation = () => {
  const { id } = useParams(); // Get the station ID from the URL
  const [stationData, setStationData] = useState({
    name: '',
    latitude: '',
    longitude: '',
    charge: ''
  });

  useEffect(() => {
    // Fetch the existing station data
    axios.get(`http://localhost:5000/stations/${id}`)
      .then(response => {
        setStationData(response.data);
      })
      .catch(error => console.error('There was an error fetching the station data', error));
  }, [id]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setStationData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Submit the updated data to the backend
    axios.put(`http://localhost:5000/stations/${id}`, stationData)
      .then(response => {
        console.log('Station updated successfully');
        // Handle successful update (e.g., redirect or show a success message)
      })
      .catch(error => console.error('There was an error updating the station', error));
  };

  // Form JSX (similar to your provided form, with the button text changed to "Update Station")
  return (
    <div className="container mt-5">
    <h1>Edit Station</h1>
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
        <button type="submit" className="btn btn-primary">Submit</button>
      </form>
</div>
  );
};

export default EditStation;

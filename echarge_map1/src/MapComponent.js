import React, { useState, useEffect, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

const MapComponent = ({ stations }) => {
  const [userLocation, setUserLocation] = useState(null);
  const [nearestStation, setNearestStation] = useState(null);
  const [stationsWithinRadius, setStationsWithinRadius] = useState([]);
  const deg2rad = useCallback((deg) => deg * (Math.PI / 180), []);
  const getDistanceFromLatLonInKm = useCallback((lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
  }, [deg2rad]); // Add deg2rad as a dependency


  useEffect(() => {
    const findNearestStationAndFilter = (lat, lon) => {
      let closest = null;
      let closestDistance = Infinity;
      let filteredStations = [];

      stations.forEach(station => {
        const distance = getDistanceFromLatLonInKm(lat, lon, station.latitude, station.longitude);
        if (distance <= 10) { // Check if the station is within 10km radius
          filteredStations.push(station);

          if (distance < closestDistance) {
            closestDistance = distance;
            closest = station;
          }
        }
      });

      setNearestStation(closest);
      setStationsWithinRadius(filteredStations);
    };

    navigator.geolocation.getCurrentPosition(position => {
      const { latitude, longitude } = position.coords;
      setUserLocation({ latitude, longitude });
      findNearestStationAndFilter(latitude, longitude);
    }, (err) => {
      console.error(err);
      setUserLocation({ latitude: 17.396910, longitude: 78.490368 });
    });
  }, [stations, getDistanceFromLatLonInKm]); // Add stations as a dependency

 


  return (
    <MapContainer center={userLocation ? [userLocation.latitude, userLocation.longitude] : [17.396910, 78.490368]} zoom={13} style={{ height: '100vh', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {userLocation && (
        <Marker 
          position={[userLocation.latitude, userLocation.longitude]}
          icon={L.icon({
            iconUrl: 'https://i.ibb.co/MCMwgBZ/placeholder.png', // User icon
            iconSize: [41, 41],
            iconAnchor: [21, 41],
            popupAnchor: [0, -35],
          })}
        >
          <Popup>You are here</Popup>
        </Marker>
      )}
      {stationsWithinRadius.map(station => (
        <Marker 
          key={station.id} 
          position={[station.latitude, station.longitude]}
          icon={L.icon({
            iconUrl: station === nearestStation ? 'https://i.ibb.co/5MXnMQX/nearest.png' : 'https://unpkg.com/leaflet@1.3.3/dist/images/marker-icon.png', // Different icon for nearest station
            iconSize: station === nearestStation? [35, 40]:[25, 41],
            iconAnchor: station === nearestStation? [17, 40]:[12, 41],
            popupAnchor: [1, -34],
          })}
        >
            <Popup>
  <div style={{ padding: '10px', color: 'darkslategray' }}>
    <h3 style={{ margin: '0 0 5px 0' }}>{station.name}</h3>
    <p style={{ margin: '0' }}>Charge: {station.charge}</p>
    {/* More information here */}
  </div>
</Popup>

        </Marker>
      ))}
    </MapContainer>
  );
};

export default MapComponent;

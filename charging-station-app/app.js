const express = require('express');
const mongoose = require('mongoose');
const app = express();
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');


app.use(cors());
app.use(express.json());

// MongoDB Atlas connection string
const mongoDBUri = 'mongodb+srv://user1:Hridai123M@cluster0.iaknsjj.mongodb.net/';

mongoose.connect(mongoDBUri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

const stationSchema = new mongoose.Schema({
  name: String,
  latitude: Number,
  longitude: Number,
  charge: String,
  username: String
});

const Station = mongoose.model('Station', stationSchema);
app.use('/api', authRoutes);

// Create a station
app.post('/stations', async (req, res) => {
  const station = new Station({
    name: req.body.name,
    latitude: req.body.latitude,
    longitude: req.body.longitude,
    charge: req.body.charge,
    username: req.body.username // Include username
  });

  try {
    const newStation = await station.save();
    res.status(201).json(newStation);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get all stations 
// Get all stations
app.get('/stations', async (req, res) => {
  try {
    const stations = await Station.find({});
    res.json(stations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// Get a single station
app.get('/stations/:id', async (req, res) => {
  try {
    const station = await Station.findById(req.params.id);
    if (!station) {
      return res.status(404).json({ message: 'Cannot find station' });
    }
    
    // Check if the station belongs to the logged-in user
    if (station.username !== req.user.username) {
      return res.status(403).json({ message: 'Not authorized to access this station' });
    }

    res.json(station);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// Update a station
app.put('/stations/:id', async (req, res) => {
  try {
    // Retrieve the station by its ID
    const station = await Station.findById(req.params.id);
    if (!station) {
      return res.status(404).json({ message: 'Cannot find station' });
    }

    // Check if the username in the request body matches the station's username
    // This is a basic form of authorization check without using JWT
    if (station.username !== req.body.username) {
      // If the usernames don't match, respond with an unauthorized error
      return res.status(403).json({ message: 'Unauthorized to update this station' });
    }

    // If authorized, update the station's fields with the new values
    // Use the nullish coalescing operator (??) to only update fields if new values are provided
    station.name = req.body.name ?? station.name;
    station.latitude = req.body.latitude ?? station.latitude;
    station.longitude = req.body.longitude ?? station.longitude;
    station.charge = req.body.charge ?? station.charge;

    // Save the updated station document to the database
    const updatedStation = await station.save();
    res.json(updatedStation);
  } catch (err) {
    // If an error occurs, respond with a 400 Bad Request status and the error message
    res.status(400).json({ message: err.message });
  }
});



// Delete a station
// app.delete('/stations/:id', async (req, res) => {
//   try {
//     const station = await Station.findById(req.params.id);
//     if (!station) return res.status(404).json({ message: 'Cannot find station' });

//     await station.remove();
//     res.json({ message: 'Deleted Station' });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });
//by name
app.delete('/stations/:id', async (req, res) => {
  try {
    console.log("Request to delete station with ID:", req.params.id);
    console.log("Request body:", req.body);

    const station = await Station.findById(req.params.id);
    if (!station) {
      console.log("Station not found");
      return res.status(404).json({ message: 'Cannot find station' });
    }

    if (station.username !== req.body.username) {
      console.log("Unauthorized attempt to delete station");
      return res.status(403).json({ message: 'Unauthorized to delete this station' });
    }

    // Use findByIdAndDelete
    await Station.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted Station' });
  } catch (err) {
    console.error('Server error:', err);
    res.status(500).json({ message: err.message });
  }
});



const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server running on port ${port}`));

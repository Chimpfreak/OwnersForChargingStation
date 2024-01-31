const express = require('express');
const mongoose = require('mongoose');
const app = express();
const cors = require('cors');


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
  charge: String
});

const Station = mongoose.model('Station', stationSchema);

// Create a station
app.post('/stations', async (req, res) => {
  const station = new Station({
    name: req.body.name,
    latitude: req.body.latitude,
    longitude: req.body.longitude,
    charge: req.body.charge
  });

  try {
    const newStation = await station.save();
    res.status(201).json(newStation);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get all stations
app.get('/stations', async (req, res) => {
  try {
    const stations = await Station.find();
    res.json(stations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get a single station
app.get('/stations/:id', async (req, res) => {
  try {
    const station = await Station.findById(req.params.id);
    if (!station) return res.status(404).json({ message: 'Cannot find station' });
    res.json(station);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update a station
app.put('/stations/:id', async (req, res) => {
  let station;
  try {
    station = await Station.findById(req.params.id);
    if (!station) return res.status(404).json({ message: 'Cannot find station' });

    if (req.body.name != null) {
      station.name = req.body.name;
    }
    if (req.body.latitude != null) {
      station.latitude = req.body.latitude;
    }
    if (req.body.longitude != null) {
      station.longitude = req.body.longitude;
    }
    if (req.body.charge != null) {
      station.charge = req.body.charge;
    }

    const updatedStation = await station.save();
    res.json(updatedStation);
  } catch (err) {
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
app.delete('/stations/name/:name', async (req, res) => {
  try {
    const result = await Station.findOneAndDelete({ name: req.params.name });
    if (!result) {
      return res.status(404).json({ message: 'Cannot find station' });
    }
    res.json({ message: 'Deleted Station' });
  } catch (err) {
    console.error(err); // Log the error for debugging
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));

require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const Weather = require('../models/weather');

const app = express();
const port = process.env.PORT || 3000;

const DEFAULT_MONGODB_URI = 'mongodb+srv://Vercel-Admin-atlas-purple-nest:admin2026@atlas-purple-nest.bhfdnvi.mongodb.net/?appName=atlas-purple-nest';
const MONGODB_URI = process.env.MONGODB_URI || DEFAULT_MONGODB_URI;

app.use(express.json());

let mongoConnectionPromise = null;

async function connectToMongo() {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (!mongoConnectionPromise) {
    mongoConnectionPromise = mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
    });
  }

  return mongoConnectionPromise;
}

app.get('/', async (req, res) => {
  try {
    await connectToMongo();
    res.json({
      message: '09-07 app is running',
      mongo: mongoose.connection.readyState === 1,
    }); 
  } catch (error) {
    res.status(503).json({
      ok: false,
      message: 'MongoDB connection failed',
      error: error.message,
    });
  }
});
app.get('/api/add', async (req, res) => {
    
  /* const Weather = mongoose.model('Weather', {
    temperature: Number,
    city: String,
    date: Date
  }); */
  let temperature = 33
  let city = 'Paris'
  let date = new Date()
  

  const newWeather = new Weather({
    temperature,
    city,
    date
  });

    await newWeather.save().then(() => console.log({newWeather}));
    res.json(newWeather)
})

app.get('/api/list', async (req, res) => {
  const weathers = await Weather.find();
  res.json(weathers);
});

app.get('/health', async (req, res) => {
  try {
    await connectToMongo();
    res.json({
      ok: true,
      status: 'healthy',
      mongo: mongoose.connection.readyState === 1,
    });
  } catch (error) {
    res.status(503).json({
      ok: false,
      status: 'unhealthy',
      error: error.message,
    });
  }
});

if (require.main === module) {
  connectToMongo()
    .then(() => {
      app.listen(port, () => {
        console.log(`Server is running on http://localhost:${port}`);
      });
    })
    .catch((error) => {
      console.error('MongoDB connection failed:', error.message);
      app.listen(port, () => {
        console.log(`Server is running on http://localhost:${port}`);
      });
    });
}

module.exports = app;

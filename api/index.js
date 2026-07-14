const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
require('dotenv').config();

const express = require('express');
const Weather = require('../models/weather');
const User = require('../models/user');

const app = express();
app.use(express.static(path.join(__dirname, '..')));
app.set('view engine', 'pug');

const port = process.env.PORT || 3000;

//const DEFAULT_MONGODB_URI = 'mongodb+srv://Vercel-Admin-atlas-purple-nest:admin2026@atlas-purple-nest.bhfdnvi.mongodb.net/?appName=atlas-purple-nest';
const MONGODB_URI = process.env.MONGODB_URI //|| DEFAULT_MONGODB_URI;

app.use(express.json());
app.use(bodyParser.json());

let mongoConnectionPromise = null;

async function connectToMongo() {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (!MONGODB_URI) {
    throw new Error('MONGODB_URI is not defined. Set the MONGODB_URI environment variable (for example in Vercel dashboard or in a local .env file).');
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
    res.render('home', { title: 'Главная' });
    /* res.json({
      ok: true,
      message: 'Express + MongoDB Atlas app is running',
      mongo: mongoose.connection.readyState === 1,
    });  */
  } catch (error) {
    res.status(503).json({
      ok: false,
      message: 'MongoDB connection failed',
      error: error.message,
    });
  }
});
app.get('/home', async (req, res) => {
  try {
    await connectToMongo();
    res.render('home', { title: 'Главная' });
    //res.send('Express + MongoDB Atlas app is running')
    /* res.json({
      ok: true,
      message: 'Express + MongoDB Atlas app is running',
      mongo: mongoose.connection.readyState === 1,
    });  */
  } catch (error) {
    res.status(503).json({
      ok: false,
      message: 'MongoDB connection failed',
      error: error.message,
    });
  }
});
app.get('/register', (req, res) => {
  res.render('register', { title: 'Регистрация', withoutHeader: true });
});

app.post('/api/adduser', async (req, res) => {
  try {
    await connectToMongo();

    const { firstName, lastName, email } = req.body;
    if (!firstName || !lastName || !email) {
      return res.status(400).json({ ok: false, message: 'Заполните все поля формы' });
    }

    const newUser = new User({ firstName, lastName, email });
    await newUser.save();

    res.status(201).json({ ok: true, message: 'Пользователь зарегистрирован', user: newUser });
  } catch (error) {
    console.error('Add user error:', error);

    if (error.code === 11000) {
      return res.status(409).json({ ok: false, message: 'Пользователь с таким email уже зарегистрирован' });
    }

    const validationMessages = [];
    if (error.errors) {
      Object.values(error.errors).forEach((err) => {
        if (err && err.message) validationMessages.push(err.message);
      });
    }

    res.status(400).json({
      ok: false,
      message: validationMessages.length ? validationMessages.join('. ') : error.message || 'Не удалось зарегистрировать пользователя',
    });
  }
});
  app.get('/listusers', async (req, res) => {
  try {
    await connectToMongo();

    const users = await User.find();
    const totalCount = await User.countDocuments({});
    const formatDate = (date) => {
      if (!(date instanceof Date)) {
        date = new Date(date);
      }
      const pad = (value) => String(value).padStart(2, '0');
      return `${date.getDate()}.${pad(date.getMonth() + 1)}.${pad(date.getFullYear())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
    };
    const lst = users.map((user) => ({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      createdAt: user.createdAt ? formatDate(user.createdAt) : '',
    }));
    res.render('users', {
      title: `Список пользователей (всего ${totalCount})`,
      totalCount,
      lst,
    });
    //res.json(users);
    
    /*const database = parmclient.db('test');
    const collection = database.collection('users');

    const totalCount = await collection.countDocuments({});
    const listUsers = await collection.find({}).toArray();
    const lst = listUsers.map((user) => ({
      firstName: user.name,
      email: user.email,
      TIMESTAMP: '',//user.TIMESTAMP,
    }));

  //console.log(`form test Всего юзеров: ${totalCount}`);
    res.render('users', {
      title: `Список пользователей (всего ${totalCount})`,
      totalCount,
      lst,
    });
    */
  } catch (error) {
    console.error('Ошибка:', error);
    res.status(500).json({ message: 'Ошибка при получении списка пользователей' });
  } finally {
    //await client.close();
  }
});


app.get('/api/add', async (req, res) => {
    
  /* const Weather = mongoose.model('Weather', {
    temperature: Number,
    city: String,
    date: Date
  }); */
  let temperature = 22
  let city = 'Berlin'
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

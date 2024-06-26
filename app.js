const express = require('express');
const mongoose = require('mongoose');

const auth = require('../middleware/auth');

// Routes
const bookRoutes = require('./routes/books');
const userRoutes = require('./routes/user');

const app = express();

mongoose.connect('mongodb+srv://manuelzuanon:ZmTWZ0Lo8irq32jo@cluster0.kn9njmi.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch((err) => {
    console.error('Connexion à MongoDB échouée !', err);
  });


app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.use(express.json());

app.use('/api/book', bookRoutes);
app.use('/api/auth', userRoutes);



module.exports = app;
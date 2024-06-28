const express = require('express');
const mongoose = require('mongoose');
const Book = require('./models/book'); 

const app = express();

mongoose.connect('mongodb+srv://manuelzuanon:ZmTWZ0Lo8irq32jo@cluster0.kn9njmi.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch((err) => {
    console.error('Connexion à MongoDB échouée !', err);
  });

app.use(express.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

// Route pour récupérer tous les livres
app.get('/api/books', (req, res, next) => {
    Book.find()
      .then(books => {
        console.log(books); // Logue tous les livres dans la console
        res.status(200).json(books); // Retourne les livres en réponse JSON
      })
      .catch(error => res.status(400).json({ error }));
});    

module.exports = app;
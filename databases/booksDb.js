const mongoose = require('mongoose');

const booksDb = mongoose.createConnection
    ('mongodb+srv://manuelzuanon:ZmTWZ0Lo8irq32jo@cluster0.kn9njmi.mongodb.net/books?retryWrites=true&w=majority&appName=Cluster0');

booksDb.on('connected', () => {
    console.log('books : Connexion à MongoDB réussie !');
});

booksDb.on('error', (err) => {
    console.error('books : Connexion à MongoDB échouée !', err);
});

module.exports = booksDb;

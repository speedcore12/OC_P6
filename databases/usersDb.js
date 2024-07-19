const mongoose = require('mongoose');

const usersDb = mongoose.createConnection
    ('mongodb+srv://manuelzuanon:YYYYYYY@cluster0.kn9njmi.mongodb.net/users?retryWrites=true&w=majority&appName=Cluster0');

usersDb.on('connected', () => {
    console.log('users : Connexion à MongoDB réussie !');
});

usersDb.on('error', (err) => {
    console.error('users : Connexion à MongoDB échouée !', err);
});

module.exports = usersDb;
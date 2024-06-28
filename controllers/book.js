const Book = require('../models/book'); 


exports.getAllBooks =  (req, res) => {
    Book.find()
        .then(books => {
        console.log(books);
        res.status(200).json(books); // Retourne les livres en réponse JSON
        })
        .catch(error => res.status(400).json({ error }));
};
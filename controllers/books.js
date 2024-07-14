const Book = require('../models/book');
const fs = require('fs');

// Récupère tous les livres
exports.getAllBooks = (req, res) => {
    Book.find()
        .then(books => {
            res.status(200).json(books); 
        })
        .catch(error => {
            res.status(400).json({ error });
        });
};

// Récupère les trois livres ayant la meilleure note moyenne
exports.getBestRating = (req, res) => {
    Book.find().sort({ averageRating: -1 }).limit(3)
        .then(books => {
            res.status(200).json(books);
        })
        .catch(error => {
            res.status(400).json({ error });
        });
};

// Récupère un livre par son ID
exports.getOneBook = (req, res) => {
    Book.findOne({ _id: req.params.id })
        .then(book => res.status(200).json(book))
        .catch(error => res.status(404).json({ error }));
};

// Crée un nouveau livre
exports.createBook = (req, res, next) => {
    const bookObject = JSON.parse(req.body.book);

    // Supprime l'ID utilisateur du corps de la requête
    delete bookObject.userId;

    const book = new Book({
        ...bookObject,
        userId: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });

    // Sauvegarde le nouveau livre dans la base de données
    book.save()
        .then(() => { res.status(201).json({ message: 'Livre enregistré !' }) })
        .catch(error => { res.status(400).json({ error }) })
};

// Met à jour un livre existant
exports.updateBook = (req, res, next) => {
    const bookObject = req.file ? {
        ...JSON.parse(req.body.book),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };

    // Supprime l'ID utilisateur du corps de la requête
    delete bookObject._userId;
    Book.findOne({ _id: req.params.id })
        .then((book) => {
            if (book.userId != req.auth.userId) {
                res.status(401).json({ message: 'Non autorisé' });
            } else {
                // Met à jour le livre avec les nouvelles informations
                Book.updateOne({ _id: req.params.id }, { ...bookObject, _id: req.params.id })
                    .then(() => res.status(200).json({ message: 'Livre mis à jour !' }))
                    .catch(error => res.status(401).json({ error }));
            }
        })
        .catch((error) => {
            res.status(400).json({ error });
        });
};

// Supprime un livre existant
exports.deleteBook = (req, res, next) => {
    Book.findOne({ _id: req.params.id })
        .then(book => {
            if (book.userId != req.auth.userId) {
                res.status(401).json({ message: 'Non autorisé' });
            } else {
                const filename = book.imageUrl.split('/images/')[1];
                // Supprime l'image associée
                fs.unlink(`images/${filename}`, () => {
                    // Supprime le livre de la base de données
                    Book.deleteOne({ _id: req.params.id })
                        .then(() => { res.status(200).json({ message: 'Livre supprimé !' }) })
                        .catch(error => res.status(401).json({ error }));
                });
            }
        })
        .catch(error => {
            res.status(500).json({ error });
        });
};



exports.rateBook = (req, res, next) => {
    console.log('Données reçues:', req.body);
    console.log('ID du livre:', req.params.id);

    // Vérifie que la note est un nombre valide entre 0 et 5
    if (typeof req.body.rating !== 'number' || req.body.rating < 0 || req.body.rating > 5) {
        return res.status(400).json({ message: 'La note doit être un nombre entre 0 et 5' });
    }

    // Recherche du livre par _id
    Book.findOne({ _id: req.params.id })
        .then(book => {
            if (!book) {
                return res.status(404).json({ message: 'Livre non trouvé' });
            }

            // Vérifie si l'utilisateur a déjà noté ce livre
            if (book.ratings.some(r => r.userId === req.body.userId)) {
                return res.status(400).json({ message: 'L\'utilisateur a déjà noté ce livre' });
            }

            // Ajoute la nouvelle note
            book.ratings.push({ userId: req.body.userId, grade: req.body.rating });

            // Calcule la nouvelle note moyenne avec une boucle
            let sumGrades = 0;
            for (let i = 0; i < book.ratings.length; i++) {
                sumGrades += book.ratings[i].grade;
            }
            const newAverage = sumGrades / book.ratings.length;
            console.log('Somme des notes:', sumGrades);
            console.log('Nombre de notes:', book.ratings.length);
            console.log('Nouvelle moyenne:', newAverage);

            book.averageRating = newAverage;

            // Sauvegarde le livre mis à jour
            book.save()
                .then(updatedBook => res.status(200).json(updatedBook))
                .catch(error => {
                    console.error('Erreur lors de la sauvegarde du livre:', error);
                    res.status(400).json({ error });
                });
        })
        .catch(error => {
            console.error('Erreur lors de la recherche du livre:', error);
            res.status(400).json({ error });
        });
};
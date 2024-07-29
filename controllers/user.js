const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

// Inscription d'un nouvel utilisateur
exports.signup = (req, res) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    // Vérification de la validité de l'email
    if (!emailRegex.test(req.body.email)) {
        return res.status(400).json({ message: 'Email invalide' });
    }

    // Hachage du mot de passe avec un coût de 10
    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            // Création d'un nouvel utilisateur avec l'email et le mot de passe haché
            const user = new User({
                email: req.body.email,
                password: hash
            });
            // Sauvegarde de l'utilisateur dans la base de données
            user.save()
                .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
                .catch(error => res.status(400).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};


// Connexion d'un utilisateur existant
exports.login = (req, res) => {
    // Recherche de l'utilisateur par son email
    User.findOne({ email: req.body.email })
        .then(user => {
            if (!user) {
                // Si l'utilisateur n'existe pas, retourne une erreur
                return res.status(401).json({ error: 'Nom d\'utilisateur ou mot de passe incorrect' });
            }
            // Comparaison du mot de passe fourni avec le mot de passe haché en base de données
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if (!valid) {
                        // Si le mot de passe est incorrect, retourne une erreur
                        return res.status(401).json({ error: 'Mot de passe incorrect' });
                    }
                    // Si l'authentification est valide, renvoie l'ID utilisateur et un token JWT
                    res.status(200).json({
                        userId: user._id,
                        token: jwt.sign(
                            { userId: user._id },
                            'RANDOM_TOKEN_secret_key_to_change_in_production_mode',
                            { expiresIn: '24h' }
                        )
                    });
                })
                .catch(error => res.status(500).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};
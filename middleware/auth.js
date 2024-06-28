const jwt = require('jsonwebtoken');

exports.auth = (req, res, next) => {
    try{
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, 'RANDOM_TOKEN');
        const userId = decodedToken.userId;

        req.auth ={
            userId: userId
        };

    } catch (error) {
        res.status(401).json({ error: error | 'Requête non authentifiée !'});
    }

};
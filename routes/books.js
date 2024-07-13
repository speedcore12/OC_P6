const express = require('express');
const router = express.Router();
const bookController = require('../controllers/books');
const auth = require('../middleware/auth');
const multer = require('../middleware/multerConfig');

router.get('/bestrating', bookController.getBestRating);
router.get('/', bookController.getAllBooks);
router.get('/:id', bookController.getOneBook);

router.post('/', auth, multer, bookController.createBook);
router.put('/:id', auth, multer, bookController.updateBook);
router.delete('/:id', auth, bookController.deleteBook);

router.post('/:id/rating', auth, bookController.rateBook);

module.exports = router;
const multer = require('multer');
const sharp = require('sharp');
const path = require('path');

// Définir les types MIME acceptés
const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'
};

// Configuration de multer pour stocker les fichiers en mémoire
const storage = multer.memoryStorage();
const upload = multer({ storage: storage }).single('image');

// Middleware pour traiter l'image après son téléchargement
const processImage = (req, res, next) => {
  if (!req.file) {
    return next();
  }

  const extension = 'webp'; // Utiliser le format WebP pour toutes les images
  const fileName = `${Date.now()}-${req.file.originalname.split(' ').join('_')}.${extension}`;
  req.file.filename = fileName;
  const outputPath = path.join('images', fileName);

  sharp(req.file.buffer)
    .resize({ width: 206, height: 260, fit: 'inside' }) // Redimensionne l'image à une taille maximale de 206x260 pixels
    .toFormat(extension) // Convertit l'image en format WebP
    .toFile(outputPath)
    .then(() => {
      req.file.path = outputPath; // Ajouter le chemin du fichier traité à req.file
      next();
    })
    .catch(err => {
      console.error('Erreur lors du traitement de l\'image:', err);
      res.status(500).json({ error: 'Erreur lors du traitement de l\'image' });
    });
};

module.exports = (req, res, next) => {
  upload(req, res, err => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    processImage(req, res, next);
  });
};

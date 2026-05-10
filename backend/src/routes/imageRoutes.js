const express = require('express');
const { uploadImage, getImages, deleteImage } = require('../controllers/imageController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');
const { uploadLimiter } = require('../middleware/rateLimiter');

const router = express.Router();

router.use(protect); // Protect all image routes

router.post('/upload', uploadLimiter, upload.single('image'), uploadImage);
router.get('/', getImages);
router.delete('/:id', deleteImage);

module.exports = router;

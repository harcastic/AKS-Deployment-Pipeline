const Image = require('../models/Image');
const asyncHandler = require('../utils/asyncHandler');
const { uploadToBlob, deleteFromBlob } = require('../services/blobService');

// @desc    Upload an image
// @route   POST /api/images/upload
// @access  Private
exports.uploadImage = asyncHandler(async (req, res, next) => {
  if (!req.file) {
    return res.status(400).json({ status: 'error', message: 'Please upload an image' });
  }

  try {
    const { url, blobName } = await uploadToBlob(req.user.id, req.file);

    const image = await Image.create({
      userId: req.user.id,
      imageUrl: url,
      blobName: blobName,
      fileSize: req.file.size
    });

    res.status(201).json({
      status: 'success',
      data: image
    });
  } catch (err) {
    return res.status(500).json({ status: 'error', message: 'Error uploading file' });
  }
});

// @desc    Get user's images
// @route   GET /api/images
// @access  Private
exports.getImages = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 20;
  const startIndex = (page - 1) * limit;

  const images = await Image.find({ userId: req.user.id })
    .sort({ uploadedAt: -1 })
    .skip(startIndex)
    .limit(limit);

  const total = await Image.countDocuments({ userId: req.user.id });

  res.status(200).json({
    status: 'success',
    count: images.length,
    pagination: {
      total,
      page,
      pages: Math.ceil(total / limit)
    },
    data: images
  });
});

// @desc    Delete an image
// @route   DELETE /api/images/:id
// @access  Private
exports.deleteImage = asyncHandler(async (req, res, next) => {
  const image = await Image.findOne({ _id: req.params.id, userId: req.user.id });

  if (!image) {
    return res.status(404).json({ status: 'error', message: 'Image not found or not authorized' });
  }

  try {
    await deleteFromBlob(image.blobName);
    await image.deleteOne();

    res.status(200).json({
      status: 'success',
      data: {}
    });
  } catch (err) {
    return res.status(500).json({ status: 'error', message: 'Error deleting file' });
  }
});

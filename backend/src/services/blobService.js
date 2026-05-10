const { BlobServiceClient } = require('@azure/storage-blob');
const crypto = require('crypto');
const path = require('path');

const AZURE_STORAGE_CONNECTION_STRING = process.env.AZURE_STORAGE_CONNECTION_STRING;
const containerName = process.env.AZURE_CONTAINER_NAME || 'gallery-uploads';

let blobServiceClient;
let containerClient;

if (AZURE_STORAGE_CONNECTION_STRING) {
  try {
    blobServiceClient = BlobServiceClient.fromConnectionString(AZURE_STORAGE_CONNECTION_STRING);
    containerClient = blobServiceClient.getContainerClient(containerName);
  } catch (error) {
    console.error("Failed to initialize Azure Blob Service:", error.message);
  }
}

// Upload a file to Azure Blob Storage
const uploadToBlob = async (userId, file) => {
  if (!containerClient) {
    throw new Error('Azure Storage not configured');
  }

  // Create unique filename
  const uniquePrefix = crypto.randomBytes(16).toString('hex');
  const extension = path.extname(file.originalname);
  const blobName = `${userId}/${uniquePrefix}${extension}`;
  
  const blockBlobClient = containerClient.getBlockBlobClient(blobName);

  // Upload data
  await blockBlobClient.uploadData(file.buffer, {
    blobHTTPHeaders: { blobContentType: file.mimetype }
  });

  return {
    blobName,
    url: blockBlobClient.url
  };
};

// Delete a file from Azure Blob Storage
const deleteFromBlob = async (blobName) => {
  if (!containerClient) {
    throw new Error('Azure Storage not configured');
  }

  const blockBlobClient = containerClient.getBlockBlobClient(blobName);
  await blockBlobClient.deleteIfExists();
};

module.exports = {
  uploadToBlob,
  deleteFromBlob
};

const fs = require('fs').promises;
const path = require('path');
const crypto = require('crypto');
const AppError = require('../utils/AppError');

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '../../uploads');

const ensureUploadsDirExists = async () => {
    try {
        await fs.access(uploadsDir);
    } catch {
        await fs.mkdir(uploadsDir, { recursive: true });
    }
};

const uploadImage = async (file) => {
    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.mimetype)) {
        throw new AppError('Invalid file type. Only images are allowed.', 400);
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
        throw new AppError('File size too large. Max 5MB allowed.', 400);
    }

    // Ensure uploads directory exists
    await ensureUploadsDirExists();

    // Generate unique filename
    const fileExt = path.extname(file.originalname);
    const fileName = `${crypto.randomBytes(16).toString('hex')}${fileExt}`;
    const filePath = path.join(uploadsDir, fileName);

    // Save file to disk
    await fs.writeFile(filePath, file.buffer);

    // Return URL that can be accessed via the server
    const baseUrl = process.env.BACKEND_URL || 'http://localhost:5000';
    const url = `${baseUrl}/uploads/${fileName}`;

    return {
        url,
        fileName,
        path: filePath
    };
};

module.exports = {
    uploadImage
};

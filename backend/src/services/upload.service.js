const cloudinary = require('../config/cloudinary');
const AppError = require('../utils/AppError');

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

    // Upload to Cloudinary
    const result = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder: 'slate-notes',
                resource_type: 'image'
            },
            (error, result) => {
                if (error) reject(error);
                else resolve(result);
            }
        );

        uploadStream.end(file.buffer);
    });

    return {
        url: result.secure_url,
        publicId: result.public_id
    };
};

module.exports = {
    uploadImage
};

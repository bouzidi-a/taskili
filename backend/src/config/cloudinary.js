const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// ── Storage Factories ──────────────────────────────────────────────────────────

const makeStorage = (folder, allowedFormats, resourceType = 'image') =>
    new CloudinaryStorage({
        cloudinary,
        params: {
            folder: `taskili/${folder}`,
            resource_type: resourceType,
            allowed_formats: allowedFormats,
            transformation:
                resourceType === 'image'
                    ? [{ quality: 'auto', fetch_format: 'auto' }]
                    : undefined
        }
    });

// ── Multer Upload Instances ────────────────────────────────────────────────────

const uploadAvatar = multer({
    storage: makeStorage('avatars', ['jpg', 'jpeg', 'png', 'webp']),
    limits: { fileSize: 3 * 1024 * 1024 } // 3 MB
}).single('avatar');

const uploadCover = multer({
    storage: makeStorage('covers', ['jpg', 'jpeg', 'png', 'webp']),
    limits: { fileSize: 5 * 1024 * 1024 } // 5 MB
}).single('cover');

const uploadCV = multer({
    storage: makeStorage('cvs', ['pdf'], 'raw'),
    limits: { fileSize: 8 * 1024 * 1024 } // 8 MB
}).single('cv');

const uploadPortfolio = multer({
    storage: makeStorage('portfolio', ['jpg', 'jpeg', 'png', 'webp']),
    limits: { fileSize: 5 * 1024 * 1024 } // 5 MB each
}).array('portfolio', 10); // max 10 images

// ── Delete helper ──────────────────────────────────────────────────────────────
const deleteFromCloudinary = async (url, resourceType = 'image') => {
    if (!url) return;
    try {
        // Extract public_id from URL  (e.g. taskili/avatars/abc123)
        const parts = url.split('/');
        const filename = parts[parts.length - 1].split('.')[0];
        const folder = parts[parts.length - 2];
        const parentFolder = parts[parts.length - 3];
        const publicId = `${parentFolder}/${folder}/${filename}`;
        await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
    } catch (err) {
        console.error('Cloudinary delete error:', err.message);
    }
};

module.exports = {
    cloudinary,
    uploadAvatar,
    uploadCover,
    uploadCV,
    uploadPortfolio,
    deleteFromCloudinary
};
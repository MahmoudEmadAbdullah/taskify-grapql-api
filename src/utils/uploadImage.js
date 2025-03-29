const sharp = require('sharp');
const { v4: uuidv4 } = require('uuid');
const cloudinary = require('../config/cloudinaryConfig');
const { Readable } = require('stream');
const { ValidationError } = require('../utils/errors');

// Upload stream to Cloudinary
const uploadToCloudinary = (stream, filename) => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                resource_type: 'image', 
                folder: 'tasks',
                public_id: filename,
            },
            (error, result) => {
                if(error) return reject(error);
                resolve(result);
            }
        );
        // Send file stream to Cloudinary
        stream.pipe(uploadStream);
    });
};


// Validate and upload image
const singleImageUpload = async (file) => {
    const { createReadStream, filename, mimetype } = await file;

     // Validate file type (allow only images)
    if(!mimetype.startsWith('image/')) {
        throw new ValidationError('Invalid file type. Only images are allowed.');
    }
    // Clean filename and generate unique name
    const cleanFilename = filename.replace(/\s+/g, '_').replace(/[^\w.-]/g, '');
    const uniqueFilename = `task-${Date.now()}-${uuidv4()}-${cleanFilename}`

    const readStream = createReadStream();
    const chunks = [];
    for await (const chunk of readStream) {
    chunks.push(chunk);
    }
    const buffer = Buffer.concat(chunks);

    // Process the image using sharp
    const processedBuffer = await sharp(buffer)
        .resize(800, 800, {
            fit: 'inside',
            withoutEnlargement: true
        })
        .toFormat('webp')
        .webp({ quality: 85 })
        .toBuffer();

    // Create a new stream from the processed buffer
    const processedStream = Readable.from(processedBuffer);

    // Upload the processed image stream to Cloudinary
    const result = await uploadToCloudinary(processedStream, uniqueFilename);
    return { secure_url: result.secure_url, public_id: result.public_id} ;
};

module.exports = { singleImageUpload };
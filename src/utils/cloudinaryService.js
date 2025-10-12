import { v2 as cloudinary } from 'cloudinary';

// Перевіряємо чи є всі креденшили
const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

if (cloudName && apiKey && apiSecret) {
  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
  });
}

export const uploadImage = async file => {
  // Якщо Cloudinary не налаштований, повертаємо null
  if (!cloudName || !apiKey || !apiSecret) {
    console.warn('Cloudinary not configured, skipping image upload');
    return null;
  }

  try {
    const result = await cloudinary.uploader.upload(file.path, {
      folder: 'contacts',
      transformation: [
        { width: 350, height: 350, crop: 'fill' },
        { quality: 'auto' },
        { fetch_format: 'auto' },
      ],
    });

    return result.secure_url;
  } catch {
    console.error('Error uploading to Cloudinary');
    throw new Error('Failed to upload image');
  }
};

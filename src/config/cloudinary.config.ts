import { v2 as cloudinary } from 'cloudinary';
import config from '.';

cloudinary.config({
    cloud_name: config.cloud_name, 
    api_key: config.cloud_api_key,
    api_secret: config.cloud_secret_key
});

export const cloudinaryUpload = cloudinary;
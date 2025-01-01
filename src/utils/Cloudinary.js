import {v2 as cloudinary} from "cloudinary";
import fs from "fs";
const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = process.env;

cloudinary.config({
    cloud_name: CLOUDINARY_CLOUD_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET,
});

export const uploadOnCloudinary = async (filePath) => {
    if (filePath === undefined) {
        throw new Error('File path is required');
    }
    try {
        const result = await cloudinary.uploader.upload(filePath, {
            resource_type: 'auto',
        });
        console.log('Image uploaded successfully',result.url);
        return result;
    } catch (error) {
        fs.unlinkSync(filePath);
        return error;
    }
};


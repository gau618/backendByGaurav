import {v2 as cloudinary} from "cloudinary";
import fs from "fs";
// const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = process.env;
// console.table(CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET);
cloudinary.config({
    cloud_name: "drttdp1pe",
    api_key: 767732297953839,
    api_secret: "Exvv1ayUx1fq-mPV08ZWTjeQbSE",
});

export const uploadOnCloudinary = async (filePath) => {
    if (filePath === undefined) {
        throw new Error('File path is required');
    }
    try {
        const result = await cloudinary.uploader.upload(filePath, {
            resource_type: 'auto',
        });
        // console.log('Image uploaded successfully',result.url);
        fs.unlinkSync(filePath);
        return result;
    } catch (error) {
        fs.unlinkSync(filePath);
        return error;
    }
};


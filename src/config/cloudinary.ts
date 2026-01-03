import dotenv from "dotenv"
import { v2 as cloudinary } from "cloudinary"
import multer from "multer";

dotenv.config()

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SCRET
})

export const upload = multer({ storage: multer.memoryStorage() });

//Helper Function to upload file buffer to Cloudinary
export const uploadToCloudinary = async (fileBuffer: Buffer, folder: string) => {
  return await new Promise<any>((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      { folder },
      (err, result) => {
        if (err || !result) return reject(err);
        resolve(result);
      }
    ).end(fileBuffer);
  });
};

export default cloudinary

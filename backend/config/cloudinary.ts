import { v2 as cloudinary } from "cloudinary";
import path from "path";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadToCloudinary = async (filePath: string, folder: string) => {
  try {
    // Convert relative path to absolute path
    const absolutePath = path.isAbsolute(filePath)
      ? filePath
      : path.resolve(process.cwd(), filePath);

    const result = await cloudinary.uploader.upload(absolutePath, {
      folder,
      resource_type: "image",
    });
    return result.secure_url;
  } catch (err: any) {
    console.error("Cloudinary upload error:", err);
    console.error("Attempted file path:", filePath);
    throw new Error(
      `Failed to upload file to Cloudinary: ${err.message || "Unknown error"}`
    );
  }
};

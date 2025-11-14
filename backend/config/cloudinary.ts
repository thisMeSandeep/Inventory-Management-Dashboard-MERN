import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadToCloudinary = async (buffer: Buffer, folder: string) => {
  try {
    return new Promise<string>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: "image",
        },
        (error, result) => {
          if (error) {
            console.error("Cloudinary upload error:", error);
            reject(new Error(
              `Failed to upload file to Cloudinary: ${error.message || "Unknown error"}`
            ));
          } else {
            resolve(result!.secure_url);
          }
        }
      );
      
      uploadStream.end(buffer);
    });
  } catch (err: any) {
    console.error("Cloudinary upload error:", err);
    throw new Error(
      `Failed to upload file to Cloudinary: ${err.message || "Unknown error"}`
    );
  }
};

import "../envConfig.js";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import asyncHandler from "./asyncHandler.js";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function uploadOnCloudinary(localFilePath) {
  let uploadResult = null;
  try {
    if (!localFilePath) {
      console.log("No Localpath provided to upload.");

      return null;
    }
    uploadResult = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });
  } catch (error) {
    console.log(error);
  } finally {
    try {
      fs.unlinkSync(localFilePath);
      console.log("Local file deleted successfully.");
    } catch (deleteError) {
      console.error("Error deleting local file:", deleteError);
    }
  }

  return uploadResult;
}
const deleteFromCloudinary = asyncHandler(async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error("Cloudinary delete error:", error);
    return null;
  }
});

export { uploadOnCloudinary, deleteFromCloudinary };

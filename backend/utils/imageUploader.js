import { storage, ID, InputFile } from "../config/appwrite.js"; // <-- Import InputFile

export async function uploadImagesToAppwrite(files) {
  if (!files || files.length === 0) {
    return [];
  }

  try {
    const uploadPromises = files.map((file) => {
      return storage
        .createFile(
          process.env.APPWRITE_BUCKET_ID,
          ID.unique(),
          // --- THIS IS THE FIX ---
          // Wrap the buffer and filename in an InputFile object
          InputFile.fromBuffer(file.buffer, file.originalname)
        )
        .then((appwriteFile) => {
          // Construct and return the public URL for each file
          return `${process.env.APPWRITE_ENDPOINT}/storage/buckets/${process.env.APPWRITE_BUCKET_ID}/files/${appwriteFile.$id}/view?project=${process.env.APPWRITE_PROJECT_ID}`;
        });
    });

    const imageUrls = await Promise.all(uploadPromises);
    return imageUrls;
  } catch (error) {
    console.error("Appwrite upload error:", error);
    throw new Error("Failed to upload images to Appwrite.");
  }
}

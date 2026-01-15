// In a new file, e.g., 'config/appwrite.js'
import { Client, Storage, ID } from "node-appwrite";
import { InputFile } from "node-appwrite/file";

import dotenv from "dotenv";
dotenv.config();

// Initialize the Appwrite Client
const client = new Client()
  .setEndpoint(process.env.APPWRITE_ENDPOINT)
  .setProject(process.env.APPWRITE_PROJECT_ID)
  .setKey(process.env.APPWRITE_API_KEY);

// Initialize the Appwrite services
export const storage = new Storage(client);
export { ID, InputFile }; // Export ID for creating unique file IDs

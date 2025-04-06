import dotenv from "dotenv";
dotenv.config();

export default function getBodyAndKeys() {
  // "IMPORTANT: Make sure to modify the keys and the request body before using this script."

  const projectId = process.env.VITE_PROJECT_ID
    ? Number(process.env.VITE_PROJECT_ID)
    : null;
  const keys = {
    // Your project id can be found at https://sequence.build. You’ll see it in the URL after selecting your project
    projectId,
    // Follow the first step in https://docs.sequence.xyz/guides/metadata-guide/
    jwtAccessKey: process.env.JWT_ACCESS_KEY,
    // Your access key can be found at https://sequence.build under the project settings
    projectAccessKey: process.env.VITE_PROJECT_ACCESS_KEY,
  };

  if (!keys.projectId) throw new Error("Missing project id");
  if (!keys.jwtAccessKey) throw new Error("Missing jwt access key");
  if (!keys.projectAccessKey) throw new Error("Missing project access key");

  const body = {
    // Modify with number of NFTs to create
    quantity: 10,
    // Modify with your collection ID
    collectionId: 892189,
  };

  return { body, keys };
}

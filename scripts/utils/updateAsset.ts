export const updateAsset = async (
  projectID,
  collectionID,
  assetID,
  tokenID,
  url,
  projectAccessKey,
  jwtAccessKey,
) => {
  const response = await fetch(url);
  if (!response.ok)
    throw new Error(`Failed to fetch file from ${url}: ${response.statusText}`);

  const arrayBuffer = await response.arrayBuffer();
  const blob = new Blob([arrayBuffer]);

  const formData = new FormData();
  formData.append("file", blob, `image.png`); // You might want to dynamically determine the filename

  const METADATA_URL = "https://metadata.sequence.app";

  // Construct the endpoint URL
  const endpointURL = `${METADATA_URL}/projects/${projectID}/collections/${collectionID}/tokens/${tokenID}/upload/${assetID}`;

  try {
    // Use fetch to make the request
    const fetchResponse = await fetch(endpointURL, {
      method: "PUT",
      body: formData,
      headers: {
        "X-Access-Key": projectAccessKey,
        Authorization: `Bearer ${jwtAccessKey}`,
      },
    });

    // Assuming the response is JSON
    const data = await fetchResponse.json();
    return data;
  } catch (err) {
    console.log(err);
  }
};

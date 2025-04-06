export const uploadAsset = async (
  projectID,
  collectionID,
  assetID,
  tokenID,
  url,
  projectAccessKey,
  jwtAccessKey,
) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch file from ${url}: ${response.statusText}`);
  }
  const arrayBuffer = await response.arrayBuffer();
  const blob = new Blob([arrayBuffer]);

  const formData = new FormData();
  formData.append("file", blob, `image.png`); // You can dynamically determine the filename if needed

  const METADATA_URL = "https://metadata.sequence.app";
  const endpointURL = `${METADATA_URL}/projects/${projectID}/collections/${collectionID}/tokens/${tokenID}/upload/${assetID}`;

  try {
    const fetchResponse = await fetch(endpointURL, {
      method: "PUT",
      body: formData,
      headers: {
        "X-Access-Key": projectAccessKey,
        Authorization: `Bearer ${jwtAccessKey}`,
      },
    });

    const data = await fetchResponse.json();
    return data;
  } catch (err) {
    console.log(err);
  }
};

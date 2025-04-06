import { SequenceCollections } from "@0xsequence/metadata";
import { generateNFTsMetadata, getRandomImage } from "./utils/dataGenerators";
import { updateAsset } from "./utils/updateAsset";
import getBodyAndKeys from "./utils/getBodyAndKeys";

function main() {
  function findAssetWithImageField(data) {
    const asset = data.assets.find((asset) => asset.metadataField === "image");
    return asset ? asset.id : null;
  }

  async function updateTokenIds(
    metadatas,
    originalMetadatas,
    collectionsService,
    projectId,
    collectionId,
    projectAccessKey,
    jwtAccessKey,
  ) {
    if (metadatas.length > 500) {
      console.log(
        "Invalid metadatas length. Please send maximum 500 metadatas.",
      );
      return;
    }
    if (!projectId || !collectionId) {
      console.log("Empty fields in create token ids");
      return;
    }

    return await Promise.all(
      metadatas.map(async (metadata, index) => {
        const assetId = findAssetWithImageField(originalMetadatas[index]);
        const tokenId = originalMetadatas[index].token?.tokenId;

        try {
          await updateAsset(
            projectId,
            collectionId,
            assetId,
            tokenId,
            getRandomImage(),
            projectAccessKey,
            jwtAccessKey,
          );

          const updateTokenBody = {
            projectId: projectId,
            collectionId: collectionId,
            private: false,
            tokenId,
            token: { ...metadata, tokenId },
          };

          const data = await collectionsService.updateToken(updateTokenBody);

          return data;
        } catch (error) {
          return {
            ...error,
            tokenId: metadata.token.tokenId,
          };
        }
      }),
    );
  }

  async function updateMetadatas(body, keys) {
    const { collectionId } = body;
    const { jwtAccessKey, projectAccessKey, projectId } = keys;

    if (!jwtAccessKey || !projectAccessKey || !projectId?.toString()) {
      console.log(JSON.stringify("Bad Request. Missing keys"));
      return;
    }

    if (!collectionId || typeof collectionId !== "number") {
      console.log("Bad Request. Missing body values");
      return;
    }

    const METADATA_URL = "https://metadata.sequence.app";
    const collectionsService = new SequenceCollections(
      METADATA_URL,
      jwtAccessKey,
    );

    const metadatasFromApi = await collectionsService.listTokens({
      projectId,
      collectionId: collectionId,
      page: {
        pageSize: 10000,
      },
    });

    const metadatasFromApiTwo = await Promise.all(
      metadatasFromApi?.tokens?.map(async (metadata) => {
        return await collectionsService.getToken({
          projectId,
          collectionId: collectionId,
          tokenId: metadata.tokenId,
        });
      }),
    );

    const formattedOriginalMetadata = metadatasFromApiTwo.filter(
      (metadata) =>
        metadata?.assets?.length !== 0 &&
        metadata?.assets?.find(
          (assetData) => assetData.metadataField === "image",
        ),
    );
    const metadatas = generateNFTsMetadata(formattedOriginalMetadata.length);

    const metadataStatuses = await updateTokenIds(
      metadatas,
      formattedOriginalMetadata,
      collectionsService,
      projectId,
      collectionId,
      projectAccessKey,
      jwtAccessKey,
    );

    const data = {
      message: "Updated Tokens",
      status: "success",
      metadataStatuses,
    };

    console.log(JSON.stringify(data));
  }

  const { body, keys } = getBodyAndKeys();
  updateMetadatas(body, keys);
}

main();

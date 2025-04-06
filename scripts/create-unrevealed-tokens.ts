import { SequenceCollections } from "@0xsequence/metadata";
import { ethers } from "ethers";
import { uploadAsset } from "./utils/uploadAsset";
import {
  generatePlaceholderMetadata,
  mergeAttributes,
} from "./utils/dataGenerators";
import getBodyAndKeys from "./utils/getBodyAndKeys";

function main() {
  async function createTokenIds(
    startTokenId,
    metadatas,
    collectionsService,
    projectId,
    collectionId,
    projectAccessKey,
    jwtAccessKey,
  ) {
    if (startTokenId < 0) throw new Error("Invalid startTokenId");
    if (metadatas.length > 500) {
      throw new Error(
        "Invalid metadatas length. Please send maximum 500 metadatas.",
      );
    }
    if (!projectId || !collectionId) {
      throw new Error("Empty fields in create token ids");
    }

    return await Promise.all(
      metadatas.map(async (metadata, index) => {
        const { name, description, attributes, image } = metadata;
        try {
          const { token } = await collectionsService.createToken({
            projectId,
            collectionId,
            token: {
              tokenId: (index + startTokenId).toString(),
              name,
              description,
              decimals: 0,
              properties: mergeAttributes(attributes),
            },
          });

          const randomTokenIDSpace = ethers.BigNumber.from(
            ethers.utils.hexlify(ethers.utils.randomBytes(20)),
          );

          const jsonCreateAsset = await collectionsService.createAsset({
            projectId,
            asset: {
              id: Number(String(randomTokenIDSpace).slice(0, 10)),
              collectionId,
              tokenId: (index + startTokenId).toString(),
              metadataField: "image",
            },
          });

          await uploadAsset(
            projectId,
            collectionId,
            jsonCreateAsset.asset.id,
            "8",
            image,
            projectAccessKey,
            jwtAccessKey,
          );

          const updateTokenBody = {
            projectId,
            collectionId,
            private: false,
            tokenId: token.tokenId,
            token: { ...token },
          };

          const data = await collectionsService.updateToken(updateTokenBody);

          return data;
        } catch (error) {
          return {
            ...error,
            tokenId: index + startTokenId,
          };
        }
      }),
    );
  }

  async function createPlaceholders(body, keys) {
    const { quantity, collectionId } = body;
    const { jwtAccessKey, projectAccessKey, projectId } = keys;
    const startTokenId = 0;

    if (!jwtAccessKey || !projectAccessKey || !projectId?.toString()) {
      console.log(JSON.stringify("Bad Request. Missing keys"));
      return;
    }

    if (!quantity?.toString() || !startTokenId?.toString() || !collectionId) {
      console.log(JSON.stringify("Bad Request. Missing body values"));
      return;
    }

    const METADATA_URL = "https://metadata.sequence.app";
    const collectionsService = new SequenceCollections(
      METADATA_URL,
      jwtAccessKey,
    );
    const metadatas = generatePlaceholderMetadata(quantity);
    const metadataStatuses = await createTokenIds(
      startTokenId,
      metadatas,
      collectionsService,
      projectId,
      collectionId,
      projectAccessKey,
      jwtAccessKey,
    );
    const data = {
      message: "Created Tokens",
      status: "success",
      metadataStatuses,
    };

    console.log(JSON.stringify(data));
  }

  const { body, keys } = getBodyAndKeys();
  createPlaceholders(body, keys);
}

main();

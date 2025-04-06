import { SUPPORTED_NETWORKS } from "./config";

type nameOrId = string | number;

export const getChain = (nameOrId: nameOrId) => {
  return SUPPORTED_NETWORKS.find(
    (n) =>
      n.name === String(nameOrId).toLowerCase() ||
      n.chainId === Number(nameOrId),
  );
};

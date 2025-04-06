import { getChain } from "./getChain";
import { createPublicClient, http } from "viem";

export const getPublicClient = (chainId: number) => {
  const networkConfig = getChain(chainId);
  if (!networkConfig) {
    throw new Error(`Invalid chainId: ${chainId}`);
  }

  return createPublicClient({
    chain: {
      ...networkConfig.viemChainConfig,
      rpcUrls: {
        default: {
          http: [networkConfig.readOnlyNodeURL],
        },
        public: {
          http: [networkConfig.readOnlyNodeURL],
        },
      },
    },
    batch: {
      multicall: true,
    },
    transport: http(),
  });
};

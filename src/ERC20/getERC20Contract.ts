import { ERC20_ABI } from "./ERC20_abi";
import { getPublicClient } from "./rpcClients";
import { getContract, WalletClient, Hex } from "viem";

interface ContractInstanceParams {
  contractAddress: string;
  chainId: number;
  signer?: WalletClient;
}

export const getERC20Contract = (args: ContractInstanceParams) => {
  const publicClient = getPublicClient(args.chainId);

  return getContract({
    address: args.contractAddress as Hex,
    abi: ERC20_ABI,
    client: {
      public: publicClient,
      wallet: args.signer,
    },
  });
};
